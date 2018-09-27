"use strict";

const ObjectID = require('mongodb').ObjectID;
const EntryListTypeEnum = require('./EntryListTypeEnum');
const EntryListSubscription = require('./EntryListSubscription');
const PermissionLevelEnum = require('./PermissionLevelEnum');
const utils = require('./utils');
var statusCodes = require('http-status-codes');


let curClientId = 0;


/**
 * Class representing a single client connection.
 */
class Client {
    /**
     * Creates a Client instance.
     * @param {SocketIoConnection} socket socket connection to client
     * @param {Controller} controller controller object containing initialized controllers
     * @param {ClientBroker} broker reference to parent ClientBroker instance
     */
    constructor(socket, controller, broker) {
        // public properties
        /**
         * Id of active event.
         * @type {(ObjectID|null)}
         */
        this.activeEventId = null;
        /**
         * Internal (process-unique) id for a client.
         * @type {number}
         */
        this.id = curClientId++;
        /**
         * Id of entry client subscribed comments of.
         * Null indicates that no comments(-updates/-data) are subscribed.
         * @type {(ObjectID|null)}
         */
        this.commentsSubscribedForEntryId = null;
        /**
         * Timestamp of connect-event.
         * @type {number}
         */
        this.connectTimestamp = Date.now();
        /**
         * Infos about clients subscribed entries.
         */
        this.entriesSubscription = {
            /**
             * List subscription instance.
             * Null indicates that no list subscription is active.
             * @type {(EntryListSubscription|null)}
             */
            listSubscription: null,
            /**
             * List of subscribed entryIds.
             * @type {Array<ObjectID>}
             */
            subscribedIds: [],
        };
        /**
         * User-Agent of connected client.
         * @type {string}
         */
        this.userAgent = socket.request.headers['user-agent'];
        /**
         * IP-Address of connected client.
         * @type {string}
         */
        this.ip = socket.request.connection.remoteAddress;
        /**
         * Permissionlevel of user for active event. 
         * Defaults to NOT_A_USER.
         * @type {PermissionLevelEnum}
         */
        this.permissionLevel = PermissionLevelEnum.NOT_A_USER;
        /**
         * Id of authenticated user.
         * @type {(string|null)}
         */
        this.userId = null;
        /**
         * Indicates if client subcribed to full EventDict.
         * Defaults to false.
         * @type {boolean}
         */
        this.subscribedFullEventDict = false;

        // private properties
        /**
         * Open socket connection to client.
         * @private
         * @type {SocketIoConnection}
         */
        this._socket = socket;
        /**
         * Controller object containing initialized controllers.
         * @private
         * @type {Controller}
         */
        this._controller = controller;
        /**
         * Reference to parent ClientBroker instance that manages this instance.
         * @private
         * @type {ClientBroker}
         */
        this._broker = broker;

        // setup listeners
        this.on('disconnect',                           false,  false,  this._handleDisconnect);

        // comments
        this.on('comments/changeVote',                  true,   true,   this._handleChangeVoteForComment);
        this.on('comments/postComment',                 true,   true,   this._handlePostComment);
        this.on('comments/subscribeCommentsForEntry',   true,   true,   this._handleSubscribeCommentsForEntry);
        this.on('comments/unsubscribeCommentsForEntry', true,   true,   this._handleUnsubscribeCommentsForEntry);

        // desktopApp
        this.on('desktopApp/broadcastNewImage',         true,   true,   this._handleBroadcastNewImage);

        // entries
        this.on('entries/changeBookmark',               true,   true,   this._handleChangeBookmark);
        this.on('entries/changeFollow',                 true,   true,   this._handleChangeFollow);
        this.on('entries/changeVote',                   true,   true,   this._handleChangeVote);
        this.on('entries/loadMoreEntries',              true,   true,   this._handleLoadMoreEntries);
        this.on('entries/postEntry',                    true,   true,   this._handlePostEntry);
        this.on('entries/subscribeEntries',             true,   true,   this._handleSubscribeEntries);
        this.on('entries/subscribeEntryList',           true,   true,   this._handleSubscribeEntryList);
        this.on('entries/unsubscribeEntries',           true,   true,   this._handleUnsubscribeEntries);
        this.on('entries/unsubscribeEntryList',         true,   true,   this._handleUnsubscribeEntryList);
        
        // events
        this.on('events/subscribeFullEventDict',        true,   false,  this._handleSubscribeFullEventDict);
        this.on('events/unsubscribeFullEventDict',      true,   false,  this._handleUnsubscribeFullEventDict);
        this.on('events/joinEvent',                     true,   false,  this._handleJoinEvent);
        this.on('events/leaveEvent',                    true,   false,  this._handleLeaveEvent);
        this.on('events/switchActiveEvent',             true,   false,  this._handleSwitchActiveEvent);

        // images
        this.on('images/loadImages',                    true,   true,   this._handleLoadImages);

        // user
        this.on('user/continueSession',                 true,   true,   this._handleContinueSession);
        this.on('user/login',                           false,  false,  this._handleLogin);
    }




    //#region private
    // --------- Private ---------

    //#region general
    /**
     * Eventhandler for socket disconnect event.
     * @private
     * @function
     */
    _handleDisconnect() {
        const disconnectTimestamp = Date.now();
        const sessionDurationMin = ((disconnectTimestamp - this.connectTimestamp) / 1000 / 60).toFixed(1);
        console.log('client disconnected', { clientId: this.id, ip: this.ip, userId: this.userId, sessionDurationMin});
        this._socket = null;
        this._broker.unregisterClient(this);
    }


    /**
     * Initializes instance-state by users login-data.
     * @async
     * @private
     * @function
     * @param {UserController~LoginData} loginData loginData object
     * @returns {Promise} 
     */
    async _setupAfterAuthentication(loginData) {
        this.activeEventId = loginData.activeEventId;
        this.userId = loginData.id;
        console.log('user authorized', { clientId: this.id, ip: this.ip, userId: this.userId });
        this.emitUpdateEventDict(await this._controller.events.getEventDict(this.userId));
        if (this.activeEventId)
            await this._switchActiveEvent(this.activeEventId);
    }


    /**
     * Socket message callback function.
     * @callback Client~messageAcknowledgementCallback
     * @param {*} error error object, message / null or undefined for "no error"
     * @param {*} result data to send back to client
     */


    //#endregion general

    //#region comments
    /**
     * Eventhandler for vote change on comment. 
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {string} data.entryId entryId (as string)
     * @param {string} data.commentId commentId (as string)
     * @param {number} data.vote number representing vote (>0: upvote, 0: no vote, <0: downvote)
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     * @returns {Promise} 
     */
    async _handleChangeVoteForComment(data, cb) {
        try {
            await this._controller.comments.changeUserVote(this.activeEventId, 
                new ObjectID(data.entryId), new ObjectID(data.commentId), this.userId, data.vote);
            cb(null);
        } catch (err) {
            cb(utils.createError('change user vote for comment failed', err.code));
            throw err;
        }
    }


    /**
     * Eventhandler for new comment posted. 
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {string} data.content content of comment
     * @param {string} data.entryId entryId (as string)
     * @param {Array<string>} data.imageDataArr array of attached images (base64 encoded)
     * @param {boolean} data.isAnonymous true if posting is anonymous, otherwise false
     * @param {(string|null)} data.parentId id of parent-comment (as string). null for toplevel
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     * @returns {Promise} 
     */
    async _handlePostComment(data, cb) {
        try {
            const entryId = new ObjectID(data.entryId);
            const parentId = data.parentId ? new ObjectID(data.parentId) : null;
            await this._controller.comments.postComment(
                this.activeEventId, entryId, parentId, this.userId, 
                data.isAnonymous, data.content, data.imageDataArr);
            cb(null);
        } catch (err) {
            cb(utils.createError('could not post comment', err.code));
            throw err;
        }
    }


    /**
     * Eventhandler for comment subscription request (for entry).
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {string} data.entryId entryId (as string)
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     * @returns {Promise} 
     */
    async _handleSubscribeCommentsForEntry(data, cb) {
        try {
            const entryId = new ObjectID(data.entryId);
            const commentDict = await this._controller.comments.getComments(
                this.activeEventId, entryId, this.userId);
            this.commentsSubscribedForEntryId = entryId;
            cb(null, { commentDict })
        } catch (err) {
            cb(utils.createError('could not subscribe comments for entry', err.code));
            throw err;
        }
    }


    /**
     * Eventhandler for comment unsubscription request.
     * @async
     * @private
     * @function
     * @param {object} data empty object
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     * @returns {Promise} 
     */
    async _handleUnsubscribeCommentsForEntry(data, cb) {
        try {
            this.commentsSubscribedForEntryId = null;
            cb(null)
        } catch (err) {
            cb(utils.createError('could not unsubscribe comments for entry', err.code));
            throw err;
        }
    }


    //#endregion comments

    //#region desktopApp
    /**
     * Eventhandler for image/screenshot broadcast.
     * @async
     * @private
     * @function
     * @param {string} data base64 image-data of full image
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     * @returns {Promise} 
     */
    async _handleBroadcastNewImage(data, cb) {
        try {
            await this._controller.eventScreenshots.addImageForEvent(this.activeEventId, data);
            cb(null);
        } catch (err) {
            cb(utils.createError('could not broadcast image', err.code));
            throw err;
        }
    }

        
    //#endregion desktopApp

    //#region entries
    /**
     * Eventhandler for bookmark changed (for entry).
     * @async
     * @private
     * @function
     * @param {string} data 
     * @param {string} data.entryId id of entry (as string)
     * @param {boolean} data.bookmark true sets bookmark, false unsets
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     * @returns {Promise} 
     */
    async _handleChangeBookmark(data, cb) {
        try {
            await this._controller.entries.changeUserBookmark(
                this.activeEventId, new ObjectID(data.entryId), this.userId, data.bookmark);
            cb(null);
        } catch (err) {
            cb(utils.createError('change user bookmark for entry failed', err.code));
            throw err;
        }
    }


    /**
     * Eventhandler for follow-state changed (for entry).
     * @async
     * @private
     * @function
     * @param {string} data 
     * @param {string} data.entryId id of entry (as string)
     * @param {boolean} data.follow true sets follow, false unsets
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     * @returns {Promise} 
     */
    async _handleChangeFollow(data, cb) {
        try {
            await this._controller.entries.changeUserFollow(
                this.activeEventId, new ObjectID(data.entryId), this.userId, data.follow);
            cb(null);
        } catch (err) {
            cb(utils.createError('change user follow for entry failed', err.code));
            throw err;
        }
    }


    /**
     * Eventhandler for vote change on entry. 
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {string} data.entryId entryId (as string)
     * @param {number} data.vote number representing vote (>0: upvote, 0: no vote, <0: downvote)
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     * @returns {Promise} 
     */
    async _handleChangeVote(data, cb) {
        try {
            await this._controller.entries.changeUserVote(
                this.activeEventId, new ObjectID(data.entryId), this.userId, data.vote);
            cb(null);
        } catch (err) {
            cb(utils.createError('change user vote for entry failed', err.code));
            throw err;
        }
    }


    /**
     * Eventhandler for load more entries request (depends on active list subscription).
     * @async
     * @private
     * @function
     * @param {object} data empty object
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     * @returns {Promise} 
     */
    async _handleLoadMoreEntries(data, cb) {
        try {
            if (!this.entriesSubscription.listSubscription)
                throw utils.createError('there must be a subscription to an entrylist', statusCodes.BAD_REQUEST);
            
            const res = await this.entriesSubscription.listSubscription.getMoreEntries();
            const entryDict = await this._controller.entries
                .getEntries(this.activeEventId, this.userId, res.addedEntryIds);
            cb(null, { 
                entryDict, 
                idList: this.entriesSubscription.listSubscription.getIdList(),
                hasMoreEntriesToLoad: res.hasMoreEntriesToLoad,
            });
        } catch (err) {
            cb(utils.createError('load more entries failed'));
            throw err;
        }
    }


    /**
     * Eventhandler for new entry posted. 
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {string} data.content content of comment
     * @param {Array<string>} data.imageDataArr array of attached images (base64 encoded)
     * @param {boolean} data.isAnonymous true if posting is anonymous, otherwise false
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     * @returns {Promise} 
     */
    async _handlePostEntry(data, cb) {
        try {
            // TODO check if active event is set
            await this._controller.entries.postEntry(
                this.activeEventId, this.userId, data.isAnonymous, data.content, data.imageDataArr);
            cb(null);
        } catch (err) {
            cb(utils.createError('post entry failed', err.code));
            throw err;
        }
    }


    /**
     * Eventhandler for subscribe to entries request (by ids).
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {Array<string>} data.entryIds array of entryIds (as strings)
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     * @returns {Promise} 
     */
    async _handleSubscribeEntries(data, cb) {
        try {
            const entryIds = data.entryIds.map((id) => new ObjectID(id));
            entryIds.forEach((id) => {
                if (this.entriesSubscription.subscribedIds.findIndex((cur) => cur.equals(id)) === -1)
                    this.entriesSubscription.subscribedIds.push(id);
            });
            const entryDict = await this._controller.entries
                .getEntries(this.activeEventId, this.userId, entryIds);
            cb(null, { entryDict });
        } catch (err) {
            cb(utils.createError('subscribe entries failed', err.code));
            throw err;
        }
    }


    /**
     * Eventhandler for subscribe to entry-list request.
     * @private
     * @function
     * @param {object} data 
     * @param {EntryListTypeEnum} data.listType list type
     * @param {boolean} data.onlyBookmarked indicates if only bookmarked entries should be included in subscription
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     */
    _handleSubscribeEntryList(data, cb) {
        try {
            this.entriesSubscription.listSubscription = null;
            if (!Object.values(EntryListTypeEnum).includes(data.listType))
                throw utils.createError('listType not defined', statusCodes.BAD_REQUEST);
            this.entriesSubscription.listSubscription = new EntryListSubscription(
                this._controller.entries, data.listType, this.activeEventId, 
                this.userId, data.onlyBookmarked);
            cb(null);
        } catch (err) {
            cb(utils.createError('subscribe entrylist failed', err.code));
            throw err;
        }
    }


    /**
     * Eventhandler for unsubscribe from (previously subscribed) entries request (by ids).
     * @private
     * @function
     * @param {object} data 
     * @param {Array<string>} data.entryIds array of entryIds (as strings)
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     */
    _handleUnsubscribeEntries(data, cb) {
        try {
            const entryIds = data.entryIds.map((id) => new ObjectID(id));
            entryIds.forEach((id) => {
                const idx = this.entriesSubscription.subscribedIds.findIndex((cur) => cur.equals(id));
                if (idx !== -1)
                    this.entriesSubscription.subscribedIds.splice(idx, 1);
            });
            cb(null);
        } catch (err) {
            cb(utils.createError('subscribe entries failed', err.code));
            throw err;
        }
    }


    /**
     * Eventhandler for unsubscribe from (previously subscribed) entry-list request.
     * @private
     * @function
     * @param {object} data empty object
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     */
    _handleUnsubscribeEntryList(data, cb) {
        this.entriesSubscription.listSubscription = null;
        cb(null);
    }


    //#endregion entries

    //#region events
    /**
     * Eventhandler for subscribe to full EventDict request.
     * @async
     * @private
     * @function
     * @param {object} data empty object
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     * @returns {Promise} 
     */
    async _handleSubscribeFullEventDict(data, cb) {
        try {
            this.subscribedFullEventDict = true;        
            const fullDict = await this._controller.events.getEventDict(this.userId, true);
            this.emitUpdateEventDict(fullDict);
            cb(null);    
        } catch (err) {
            cb(utils.createError('subscribe full eventDict failed', statusCodes.INTERNAL_SERVER_ERROR));   
            throw err;
        }
    }


    /**
     * Eventhandler for unsubscribe from full EventDict request.
     * @private
     * @function
     * @param {object} data empty object
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     */
    _handleUnsubscribeFullEventDict(data, cb) {
        this.subscribedFullEventDict = false;                
        cb(null);
    }


    /**
     * Eventhandler for join-event request.
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {string} data.eventId eventId (as string)
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     * @returns {Promise}
     */
    async _handleJoinEvent(data, cb) {
        try {
            await this._controller.events.changeUserPermissionLevelForEvent(
                new ObjectID(data.eventId), this.userId, PermissionLevelEnum.USER);
            cb(null);
        } catch (err) {
            cb(utils.createError('could not join event', err.code));
            throw err;
        }
    }


    /**
     * Eventhandler for leave-event request.
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {string} data.eventId eventId (as string)
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     * @returns {Promise}
     */
    async _handleLeaveEvent(data, cb) {
        try {
            await this._controller.events.changeUserPermissionLevelForEvent(
                new ObjectID(data.eventId), this.userId, PermissionLevelEnum.NOT_A_USER);
            if (this.activeEventId.equals(new ObjectID(data.eventId)))
                await this._switchActiveEvent(null);
            cb(null);
        } catch (err) {
            cb(utils.createError('could not leave event', err.code));
            throw err;
        }
    }


    /**
     * Eventhandler for switch-active-event request.
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {string} data.eventId eventId (as string)
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     * @returns {Promise}
     */
    async _handleSwitchActiveEvent(data, cb) {
        try {
            await this._switchActiveEvent(new ObjectID(data.eventId));
            cb(null);    
        } catch (err) {
            cb(utils.createError('switch active event failed', statusCodes.INTERNAL_SERVER_ERROR));
            throw err;
        }    
    }


    /**
     * Performs switch of active event. Initializes corresponding client context.
     * @async
     * @private
     * @function
     * @param {ObjectID} newEventId id of event to switch to
     * @returns {Promise} indicates success
     * @todo reorganize position of this function
     */
    async _switchActiveEvent(newEventId) {
        console.debug('switch active event', { clientId: this.id, userId: this.userId, activeEventId: this.activeEventId, newEventId });
        this.entriesSubscription.listSubscription = null;            
        this.activeEventId = newEventId;
        this.permissionLevel = PermissionLevelEnum.NOT_A_USER;
        await this._controller.user.saveLastActiveEventId(this.userId, this.activeEventId);
        if (!this.activeEventId)
            return;
        
        // TODO cancel if newEventId does not exist
        const event = (await this._controller.events.getEventDict(
            this.userId, true, [newEventId]))[newEventId];
        this.permissionLevel = event.permissionLevel;
        
        const withPermissionLevelAndEmail = this.permissionLevel >= PermissionLevelEnum.ADMINISTRATOR;
        this.emitUpdateUserDict(await this._controller.events.getUserDict(
            this.activeEventId, true, withPermissionLevelAndEmail));

        this.emitUpdateRoleList(await this._controller.events.getRoleList(this.activeEventId));

        this.emitUpdateEventScreenshotIds(
            await this._controller.eventScreenshots.getScreenshotIdsForEvent(this.activeEventId));
    }


    //#endregion events

    //#region images
    /**
     * Eventhandler for load images request.
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {Array<string>} data.imageIds array of ids of images (as string) to retrieve
     * @param {boolean} data.onlyThumbnails indicates if only the thumbnails should be queried
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     * @returns {Promise}
     */
    async _handleLoadImages(data, cb) {
        try {
            const imageIds = data.imageIds.map((id) => new ObjectID(id));
            const ret = await this._controller.images.getImages(imageIds, data.onlyThumbnails);
            cb(null, ret);
        } catch (err) {
            cb(utils.createError('load images failed', err.code));            
            throw err;
        }
    }


    //#endregion images

    //#region user
    /**
     * Eventhandler for continue session request.
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {string} data.sessionToken sessionToken
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     * @returns {Promise}
     */
    async _handleContinueSession(data, cb) {
        try {
            const loginData = await this._controller.user.continueSession(data.sessionToken);
            await this._setupAfterAuthentication(loginData);
            // TODO move callback before _setupAfterAuthentication and fix client behaviour
            cb(null, loginData);
        } catch (err) {
            cb(utils.createError('continue session failed', statusCodes.UNAUTHORIZED));            
            if (err.code === statusCodes.BAD_REQUEST) {
                console.log('continue session failed', { clientId: this.id, ip: this.ip, sessionToken: data.sessionToken });
            } else {
                throw err;
            }
        }
    }


    /**
     * Eventhandler for login request.
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {string} data.email email of user
     * @param {string} data.password password of user
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     * @returns {Promise}
     */
    async _handleLogin(data, cb) {
        try {
            const loginData = await this._controller.user.login(data.email, data.password);
            await this._setupAfterAuthentication(loginData);
            cb(null, loginData);
        } catch (err) {
            cb(utils.createError('login failed', statusCodes.UNAUTHORIZED));
            if (err.name === 'InvalidCredentialsError' 
                    || err.code === statusCodes.NOT_FOUND 
                    || err.code === statusCodes.BAD_REQUEST) {
                console.log('login failed', { clientId: this.id, ip: this.ip, email: data.email });
            } else {
                throw err;
            }
        }
    }


    //#endregion user

    //#endregion private

    //#region public
    // --------- Public ---------    

    //#region general
    /**
     * Handler for client-event.
     * @callback Client~eventHandler
     * @param {object} data event-data
     * @param {Client~messageAcknowledgementCallback} cb data-handled callback
     */


    /**
     * Registers an event-handler. Calls event handler with current context (this).
     * @param {string} event event-identifier
     * @param {boolean} requiresAuthentication true if event-handler requries authentication
     * @param {boolean} requiresActiveEvent true if event-handler requires an event to be active
     * @param {Client~eventHandler} handler event-handler
     */
    on(event, requiresAuthentication, requiresActiveEvent, handler) {
        this._socket.on(event, async (data, cb) => {
            const debugInfo = { clientEvent: event, clientId: this.id };
            try {
                // check for authentication
                if (requiresAuthentication && !this.userId) {
                    let err = utils.createError(`event: "${event}" requires authentication`, statusCodes.UNAUTHORIZED);
                    console.warn(debugInfo, err);
                    return cb(err);
                }
                // check for activeEvent set
                if (requiresActiveEvent && !this.activeEventId) {
                    let err = utils.createError(`event: "${event}" requires an event to be active`, statusCodes.UNAUTHORIZED);
                    console.warn(debugInfo, err);
                    return cb(err);
                }
                console.debug(debugInfo);
                // handle event with current context, Promise.resolve is needed to support async and sync handlers
                // in case of error: handler is responsible for calling socket-cb with custom error data
                await Promise.resolve(handler.call(this, data, cb));
            } catch (err) {
                console.error(debugInfo, err);
            }
        });
    }


    //#endregion general

    //#region comments
    /**
     * Sends specified CommentDict to client.
     * @function
     * @param {CommentsController~CommentDict} commentDict CommentDict to send
     */
    emitUpdateCommentDict(commentDict) {
        this._socket.emit('comments/updateCommentDict', commentDict);
    }


    /**
     * Sends a specified comment by its id to client.
     * Should get called when subscribed comment got updated.
     * @function
     * @param {ObjectID} entryId id of entry of updated comment
     * @param {ObjectID} commentId id of comment which has been updated
     * @returns {Promise} indicates success
     */
    async updateComment(entryId, commentId) {
        const commentDict = await this._controller.comments
            .getComments(this.activeEventId, entryId, this.userId, [commentId]);
        this.emitUpdateCommentDict(commentDict);
    }


    //#endregion comments

    //#region entries
    /**
     * Sends specified EntryDict (and optional corresponding idList from list subscription) to client.
     * @function
     * @param {EntriesController~EntryDict} entryDict EntryDict to send
     * @param {Array<ObjectID>} [idList] updated id list for list subscription (optional)
     */
    emitUpdateEntries(entryDict, idList) {
        //TODO convert object-ids from idList to strings, this should not happen implicitly
        this._socket.emit('entries/updateEntries', { entryDict, idList });
    }


    /**
     * Checks if client subscribed to entry (specified by EntryInfo), 
     * updates list subscription and sends entry-update to client if neccessary.
     * @async
     * @function
     * @param {EntriesController~EntryInfo} entryInfo EntryInfo of entry to update
     * @returns {Promise} indicates success
     */
    async updateEntry(entryInfo) {
        let idList = undefined;
        if (this.entriesSubscription.listSubscription) {
            idList = await this.entriesSubscription.listSubscription.updateEntry(entryInfo) ?
                this.entriesSubscription.listSubscription.getIdList() : undefined;
        }

        if (!idList && this.entriesSubscription.subscribedIds
            .findIndex((cur) => cur.equals(entryInfo._id)) === -1)
            return; 

        const entryDict = await this._controller.entries
            .getEntries(this.activeEventId, this.userId, [entryInfo._id]);
        // TODO only send idList if changed
        this.emitUpdateEntries(entryDict, idList);
    }


    //#endregion entries

    //#region eventInfo
    /**
     * Sends a specified RoleList to client.
     * @function
     * @param {EventsController~RoleList} roleList role-list to send
     */
    emitUpdateRoleList(roleList) {
        this._socket.emit('eventInfo/updateRoleList', roleList);
    }


    /**
     * Sends a specified UserDict to client.
     * @function
     * @param {EventsController~UserDict} userDict UserDict to send
     */
    emitUpdateUserDict(userDict) {
        this._socket.emit('eventInfo/updateUserDict', userDict);
    }


    //#endregion eventInfo

    //#region events
    /**
     * Sends a specified EventDict to client.
     * @function
     * @param {EventsController~EventDict} eventDict EventDict to send
     */
    emitUpdateEventDict(eventDict) {
        this._socket.emit('events/updateEventDict', eventDict);
    }


    /**
     * Retrieves event-data for specified eventIds 
     * and sends an EventDict-update to the client.
     * @async
     * @function
     * @param {Array<ObjectID>} eventIds array of eventIds that got updated 
     * and need to be updated on the client
     * @returns {Promise} indicates success
     */
    async updateEventDict(eventIds) {
        const dictUpdate = await this._controller.events
            .getEventDict(this.userId, true, eventIds);
        this.emitUpdateEventDict(dictUpdate);
    }


    //#endregion events

    //#region eventScreenshots
    /**
     * Sends specified imageIds (as available event-screenshots for the active event)
     * to the client.
     * @function
     * @param {Array<ObjectID>} imageIds array of imageIds for screenshots of active event
     */
    emitUpdateEventScreenshotIds(imageIds) {
        //TODO convert object-ids from array to strings, this should not happen implicitly
        this._socket.emit('eventScreenshots/updateScreenshotIds', imageIds);
    }


    //#endregion eventScreenshots

    //#endregion public
}


module.exports = Client;
