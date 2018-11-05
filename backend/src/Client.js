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
         * Timestamp of connect-event.
         * @type {number}
         */
        this.connectTimestamp = Date.now();
        /**
         * Internal (process-unique) id for a client.
         * @type {number}
         */
        this.id = curClientId++;
        /**
         * IP-Address of connected client.
         * @type {string}
         */
        this.ip = socket.request.connection.remoteAddress;
        /**
         * User-Agent of connected client.
         * @type {string}
         */
        this.userAgent = socket.request.headers['user-agent'];

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

        // init/reset client-state
        this._init();

        // setup listeners
        this.on('disconnect',                           this._handleDisconnect, {
        });

        // comments
        this.on('comments/changeVote',                  this._handleChangeVoteForComment, {
            requiresActiveEvent: true,
            requiresAuthentication: true
        });
        this.on('comments/deleteComment',               this._handleDeleteComment, {
            requiresActiveEvent: true,
            requiresAuthentication: true
        });
        this.on('comments/postComment',                 this._handlePostComment, {
            requiresActiveEvent: true,
            requiresAuthentication: true
        });
        this.on('comments/subscribeCommentsForEntry',   this._handleSubscribeCommentsForEntry, {
            requiresActiveEvent: true,
            requiresAuthentication: true
        });
        this.on('comments/unsubscribeCommentsForEntry', this._handleUnsubscribeCommentsForEntry, {
            requiresActiveEvent: true,
            requiresAuthentication: true
        });

        // desktopApp
        this.on('desktopApp/broadcastNewImage',         this._handleBroadcastNewImage, {
            requiresActiveEvent: true,
            requiresAuthentication: true
        });

        // entries
        this.on('entries/changeBookmark',               this._handleChangeBookmark, {
            requiresActiveEvent: true,
            requiresAuthentication: true
        });
        this.on('entries/changeFollow',                 this._handleChangeFollow, {
            requiresActiveEvent: true,
            requiresAuthentication: true
        });
        this.on('entries/changeVote',                   this._handleChangeVote, {
            requiresActiveEvent: true,
            requiresAuthentication: true
        });
        this.on('entries/deleteEntry',                  this._handleDeleteEntry, {
            requiresActiveEvent: true,
            requiresAuthentication: true
        });
        this.on('entries/loadMoreEntries',              this._handleLoadMoreEntries, {
            requiresActiveEvent: true,
            requiresAuthentication: true
        });
        this.on('entries/postEntry',                    this._handlePostEntry, {
            requiresActiveEvent: true,
            requiresAuthentication: true
        });
        this.on('entries/readEntry',                    this._handleReadEntry, {
            requiresActiveEvent: true,
            requiresAuthentication: true,
        });
        this.on('entries/subscribeEntries',             this._handleSubscribeEntries, {
            requiresActiveEvent: true,
            requiresAuthentication: true
        });
        this.on('entries/subscribeEntryList',           this._handleSubscribeEntryList, {
            requiresActiveEvent: true,
            requiresAuthentication: true
        });
        this.on('entries/unsubscribeEntries',           this._handleUnsubscribeEntries, {
            requiresActiveEvent: true,
            requiresAuthentication: true
        });
        this.on('entries/unsubscribeEntryList',         this._handleUnsubscribeEntryList, {
            requiresActiveEvent: true,
            requiresAuthentication: true
        });
        
        // events
        this.on('events/subscribeFullEventDict',        this._handleSubscribeFullEventDict, {
            requiresAuthentication: true
        });
        this.on('events/unsubscribeFullEventDict',      this._handleUnsubscribeFullEventDict, {
            requiresAuthentication: true
        });
        this.on('events/joinEvent',                     this._handleJoinEvent, {
            requiresAuthentication: true
        });
        this.on('events/leaveEvent',                    this._handleLeaveEvent, {
            requiresAuthentication: true
        });
        this.on('events/switchActiveEvent',             this._handleSwitchActiveEvent, {
            requiresAuthentication: true
        });

        // images
        this.on('images/loadImages',                    this._handleLoadImages, {
            requiresAuthentication: true
        });

        // user
        this.on('user/acceptTos',                       this._handleAcceptTos, {
            requiresAuthentication: true
        });
        this.on('user/continueSession',                 this._handleContinueSession, {
        });
        this.on('user/login',                           this._handleLogin, {
        });
        this.on('user/logout',                          this._handleLogout, {
            requiresAuthentication: true
        });
    }



    //#region private
    // --------- Private ---------

    //#region general
    /**
     * Initializes / resets client-state properties.
     * @private
     * @function
     */
    _init() {
        // public properties
        /**
         * Id of active event.
         * @type {(ObjectID|null)}
         */
        this.activeEventId = null;
        /**
         * Id of entry client subscribed comments of.
         * Null indicates that no comments(-updates/-data) are subscribed.
         * @type {(ObjectID|null)}
         */
        this.commentsSubscribedForEntryId = null;
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
         * Indicates if auth-user has accepted the terms of service.
         * @type {boolean}
         */
        this.hasAcceptedTos = false;
        /**
         * Timestamp of login / continue session.
         * @type {(number|null)}
         */
        this.loginTimestamp = null;
        /**
         * Permissionlevel of user for active event. 
         * Defaults to NOT_A_USER.
         * @type {PermissionLevelEnum}
         */
        this.permissionLevel = PermissionLevelEnum.NOT_A_USER;
        /**
         * Currently used sessionToken (by authenticated user).
         * @type {(string|null)}
         */
        this.sessionToken = null;
        /**
         * Indicates if client subcribed to full EventDict.
         * Defaults to false.
         * @type {boolean}
         */
        this.subscribedFullEventDict = false;
        /**
         * Id of authenticated user.
         * @type {(string|null)}
         */
        this.userId = null;
    }


    /**
     * Eventhandler for socket disconnect event.
     * @async
     * @private
     * @function
     */
    async _handleDisconnect() {
        await this._trackAndSaveUserSessionInfos();
        this._socket = null;
        this._broker.unregisterClient(this);
    }


    async _logActivity(activity, data) {
        if (!this.userId) {
            console.error('calling log activity without userId being set is forbidden', activity, data);
            return;
        }
        await this._controller.activityLog.logActivity(activity, this.userId, this.activeEventId, data);
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
        this.hasAcceptedTos = loginData.hasAcceptedTos;
        this.loginTimestamp = Date.now();
        this.sessionToken = loginData.sessionToken;
        this.userId = loginData.id;
        this._logActivity('user/beginSession', { ip: this.ip, userAgent: this.userAgent });
        this.emitUpdateEventDict(await this._controller.events.getEventDict(this.userId));
        if (this.activeEventId)
            await this._switchActiveEvent(this.activeEventId);
    }


    /**
     * Saves session-infos for user.
     * @async
     * @private
     * @function
     * @returns {Promise} 
     */
    async _trackAndSaveUserSessionInfos() {
        if (!this.userId)
            return;
        const logoutTimestamp = Date.now();
        await this._controller.user.saveSessionInfos(this.userId, 
            this.loginTimestamp, logoutTimestamp, this.sessionToken, this.ip, this.userAgent);
        const sessionDurationSec = Math.round((logoutTimestamp - this.loginTimestamp) / 1000);
        this._logActivity('user/endSession', { sessionDurationSec });
    }


    //#endregion general

    //#region comments
    /**
     * Eventhandler for vote change on comment. 
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {string} data.commentId commentId (as string)
     * @param {string} data.entryId entryId (as string)
     * @param {number} data.vote number representing vote (>0: upvote, 0: no vote, <0: downvote)
     * @returns {Promise} 
     */
    async _handleChangeVoteForComment({ commentId, entryId, vote }) {
        commentId = new ObjectID(commentId);
        entryId = new ObjectID(entryId);
        await this._controller.comments.changeUserVote(this.activeEventId, 
            entryId, commentId, this.userId, vote);
        this._logActivity('comments/changeVote', { commentId, entryId, vote });
    }


    /**
     * Eventhandler for comment deletion. 
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {string} data.commentId commentId (as string)
     * @param {string} data.entryId entryId (as string)
     * @returns {Promise} 
     */
    async _handleDeleteComment({ commentId, entryId }) {
        // TODO ensure sufficient permissions
        commentId = new ObjectID(commentId);
        entryId = new ObjectID(entryId);
        await this._controller.comments.deleteComment(this.activeEventId, entryId, commentId);
        this._logActivity('comments/deleteComment', { commentId, entryId });
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
     * @returns {Promise} 
     */
    async _handlePostComment({ content, entryId, imageDataArr, isAnonymous, parentId }) {
        entryId = new ObjectID(entryId);
        parentId = parentId ? new ObjectID(parentId) : null;
        const commentId = await this._controller.comments.postComment(
            this.activeEventId, entryId, parentId, this.userId, 
            isAnonymous, content, imageDataArr);
        this._logActivity('comments/postComment', { commentId, entryId, parentId });
    }


    /**
     * Eventhandler for comment subscription request (for entry).
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {string} data.entryId entryId (as string)
     * @returns {Promise<CommentsController~CommentDict>} returns dict of comments
     */
    async _handleSubscribeCommentsForEntry({ entryId }) {
        entryId = new ObjectID(entryId);
        const commentDict = await this._controller.comments.getComments(
            this.activeEventId, entryId, this.userId);
        this.commentsSubscribedForEntryId = entryId;
        this._logActivity('comments/viewCommentList', { entryId });
        return commentDict;
    }


    /**
     * Eventhandler for comment unsubscription request.
     * @async
     * @private
     * @function
     * @returns {Promise} 
     */
    async _handleUnsubscribeCommentsForEntry() {
        this.commentsSubscribedForEntryId = null;
    }


    //#endregion comments

    //#region desktopApp
    /**
     * Eventhandler for image/screenshot broadcast.
     * @async
     * @private
     * @function
     * @param {object} data
     * @param {string} data.imageData base64 image-data of full image
     * @returns {Promise} 
     */
    async _handleBroadcastNewImage({ imageData }) {
        await this._controller.eventScreenshots.addImageForEvent(this.activeEventId, imageData);
        this._logActivity('desktopApp/broadcastNewImage');
    }

        
    //#endregion desktopApp

    //#region entries
    /**
     * Eventhandler for bookmark changed (for entry).
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {string} data.entryId id of entry (as string)
     * @param {boolean} data.bookmark true sets bookmark, false unsets
     * @returns {Promise} 
     */
    async _handleChangeBookmark({ entryId, bookmark }) {
        entryId = new ObjectID(entryId);
        await this._controller.entries.changeUserBookmark(
            this.activeEventId, entryId, this.userId, bookmark);
        this._logActivity('entries/changeBookmark', { entryId, bookmark });
    }


    /**
     * Eventhandler for follow-state changed (for entry).
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {string} data.entryId id of entry (as string)
     * @param {boolean} data.follow true sets follow, false unsets
     * @returns {Promise} 
     */
    async _handleChangeFollow({ entryId, follow }) {
        entryId = new ObjectID(entryId);
        await this._controller.entries.changeUserFollow(
            this.activeEventId, entryId, this.userId, follow);
        this._logActivity('entries/changeFollow', { entryId, follow });
    }


    /**
     * Eventhandler for vote change on entry. 
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {string} data.entryId entryId (as string)
     * @param {number} data.vote number representing vote (>0: upvote, 0: no vote, <0: downvote)
     * @returns {Promise} 
     */
    async _handleChangeVote({ entryId, vote }) {
        entryId = new ObjectID(entryId);
        await this._controller.entries.changeUserVote(
            this.activeEventId, entryId, this.userId, vote);
        this._logActivity('entries/changeVote', { entryId, vote });
    }

    
    /**
     * Eventhandler for entry deletion. 
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {string} data.entryId entryId (as string)
     * @returns {Promise} 
     */
    async _handleDeleteEntry({ entryId }) {
        // TODO ensure sufficient permissions
        entryId = new ObjectID(entryId);
        await this._controller.entries.deleteEntry(this.activeEventId, entryId);
        this._logActivity('entries/deleteEntry', { entryId });
    }


    /**
     * Result of _handleLoadMoreEntries call.
     * @typedef {object} Client~LoadMoreEntriesResult
     * @property {EntriesController~EntryDict} entryDict dict containing next entries
     * @property {boolean} hasMoreEntriesToLoad indicates if more entries can be loaded
     * @property {Array<ObjectID>} idList array of entry-ids (see EntryListSubscription.getIdList())
     */


    /**
     * Eventhandler for load more entries request (depends on active list subscription).
     * @async
     * @private
     * @function
     * @returns {Promise<Client~LoadMoreEntriesResult>} returns more entries 
     */
    async _handleLoadMoreEntries() {
        if (!this.entriesSubscription.listSubscription)
            throw utils.createError('there must be a subscription to an entrylist', statusCodes.FAILED_DEPENDENCY);
        
        const res = await this.entriesSubscription.listSubscription.getMoreEntries();
        const entryDict = await this._controller.entries
            .getEntries(this.activeEventId, this.userId, res.addedEntryIds);
        return { 
            entryDict, 
            hasMoreEntriesToLoad: res.hasMoreEntriesToLoad,
            idList: this.entriesSubscription.listSubscription.getIdList(),
        };
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
     * @returns {Promise} 
     */
    async _handlePostEntry({ content, imageDataArr, isAnonymous }) {
        const entryId = await this._controller.entries.postEntry(
            this.activeEventId, this.userId, isAnonymous, content, imageDataArr);
        this._logActivity('entries/postEntry', { entryId });
    }


    /**
     * Eventhandler for entry was read by user. 
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {string} data.entryId id of entry (as string)
     * @param {boolean} data.isScrollOver true if read-event was triggered while scrolling over entry, false otherwise (focus, click)
     * @returns {Promise} 
     */
    async _handleReadEntry({ entryId, isScrollOver }) {
        entryId = new ObjectID(entryId);
        this._logActivity('entries/readEntry', { entryId, isScrollOver });
    }


    /**
     * Eventhandler for subscribe to entries request (by ids).
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {Array<string>} data.entryIds array of entryIds (as strings)
     * @returns {Promise<EntriesController~EntryDict>} resolves to dictionary of entries (that were subscribed)
     */
    async _handleSubscribeEntries({ entryIds }) {
        entryIds = entryIds.map((id) => new ObjectID(id));
        entryIds.forEach((id) => {
            if (this.entriesSubscription.subscribedIds.findIndex((cur) => cur.equals(id)) === -1)
                this.entriesSubscription.subscribedIds.push(id);
        });
        return await this._controller.entries
            .getEntries(this.activeEventId, this.userId, entryIds);
    }


    /**
     * Eventhandler for subscribe to entry-list request.
     * @private
     * @function
     * @param {object} data 
     * @param {EntryListTypeEnum} data.listType list type
     * @param {boolean} data.onlyBookmarked indicates if only bookmarked entries should be included in subscription
     */
    _handleSubscribeEntryList({ listType, onlyBookmarked }) {
        this.entriesSubscription.listSubscription = null;
        if (!Object.values(EntryListTypeEnum).includes(listType))
            throw utils.createError('listType not defined', statusCodes.BAD_REQUEST);
        this.entriesSubscription.listSubscription = new EntryListSubscription(
            this._controller.entries, listType, this.activeEventId, 
            this.userId, onlyBookmarked);
        this._logActivity('entries/viewEntryList', { listType, onlyBookmarked });
    }


    /**
     * Eventhandler for unsubscribe from (previously subscribed) entries request (by ids).
     * @private
     * @function
     * @param {object} data 
     * @param {Array<string>} data.entryIds array of entryIds (as strings)
     */
    _handleUnsubscribeEntries({ entryIds }) {
        entryIds = entryIds.map((id) => new ObjectID(id));
        entryIds.forEach((id) => {
            const idx = this.entriesSubscription.subscribedIds.findIndex((cur) => cur.equals(id));
            if (idx !== -1)
                this.entriesSubscription.subscribedIds.splice(idx, 1);
        });
    }


    /**
     * Eventhandler for unsubscribe from (previously subscribed) entry-list request.
     * @private
     * @function
     */
    _handleUnsubscribeEntryList() {
        this.entriesSubscription.listSubscription = null;
    }


    //#endregion entries

    //#region events
    /**
     * Eventhandler for subscribe to full EventDict request.
     * @async
     * @private
     * @function
     * @returns {Promise} 
     */
    async _handleSubscribeFullEventDict() {
        this.subscribedFullEventDict = true;        
        const fullDict = await this._controller.events.getEventDict(this.userId, true);
        this.emitUpdateEventDict(fullDict);
    }


    /**
     * Eventhandler for unsubscribe from full EventDict request.
     * @private
     * @function
     */
    _handleUnsubscribeFullEventDict() {
        this.subscribedFullEventDict = false;                
    }


    /**
     * Eventhandler for join-event request.
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {string} data.eventId eventId (as string)
     * @returns {Promise}
     */
    async _handleJoinEvent({ eventId }) {
        eventId = new ObjectID(eventId);
        await this._controller.events.changeUserPermissionLevelForEvent(
            eventId, this.userId, PermissionLevelEnum.USER);
        this._logActivity('events/joinEvent', { eventId });
    }


    /**
     * Eventhandler for leave-event request.
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {string} data.eventId eventId (as string)
     * @returns {Promise}
     */
    async _handleLeaveEvent({ eventId }) {
        eventId = new ObjectID(eventId);
        await this._controller.events.changeUserPermissionLevelForEvent(
            eventId, this.userId, PermissionLevelEnum.NOT_A_USER);
        this._logActivity('events/leaveEvent', { eventId });
        if (this.activeEventId.equals(eventId))
            await this._switchActiveEvent(null);
    }


    /**
     * Eventhandler for switch-active-event request.
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {string} data.eventId eventId (as string)
     * @returns {Promise}
     */
    async _handleSwitchActiveEvent({ eventId }) {
        await this._switchActiveEvent(new ObjectID(eventId));
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
        this._logActivity('events/switchActiveEvent', { fromEventId: this.activeEventId, toEventId: newEventId });
        this.commentsSubscribedForEntryId = null;
        this.entriesSubscription = {
            listSubscription: null,
            subscribedIds: [],
        };
        this.permissionLevel = PermissionLevelEnum.NOT_A_USER;
        this.activeEventId = newEventId;
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
     * @returns {Promise<ImagesController~GetImagesResult>} resolves to an object containing an imageDict and thumbnailDict property, if onlyThumbnails is set imageDict will be an empty object
     */
    async _handleLoadImages({ imageIds, onlyThumbnails }) {
        imageIds = imageIds.map((id) => new ObjectID(id));
        return await this._controller.images.getImages(imageIds, onlyThumbnails);
    }


    //#endregion images

    //#region user
    /**
     * Eventhandler for accept terms of service request.
     * @async
     * @private
     * @function
     * @returns {Promise}
     */
    async _handleAcceptTos() {
        await this._controller.user.acceptTos(this.userId);
        this._logActivity('user/acceptTos');
    }


    /**
     * Eventhandler for continue session request.
     * @async
     * @private
     * @function
     * @param {object} data 
     * @param {string} data.sessionToken sessionToken
     * @returns {Promise<UserController~LoginData>} returns loginData
     */
    async _handleContinueSession({ sessionToken }) {
        try {
            const loginData = await this._controller.user.continueSession(sessionToken);
            await this._setupAfterAuthentication(loginData);
            return loginData;
        } catch (err) {
            err.statusCode = statusCodes.UNAUTHORIZED;
            throw err;
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
     * @returns {Promise<UserController~LoginData>} returns loginData
     */
    async _handleLogin({ email, password }) {
        try {
            const loginData = await this._controller.user.login(email, password);
            await this._setupAfterAuthentication(loginData);
            return loginData;
        } catch (err) {
            if (err.name === 'InvalidCredentialsError' 
                    || err.statusCode === statusCodes.NOT_FOUND 
                    || err.statusCode === statusCodes.BAD_REQUEST) {
                console.log(`login failed ${this.id} ${this.ip} ${email}`);
                err.doNotLog = true;
            }
            err.statusCode = statusCodes.UNAUTHORIZED;
            throw err;
        }
    }


    /**
     * Eventhandler for logout request.
     * @async
     * @private
     * @function
     */
    async _handleLogout() {
        await this._trackAndSaveUserSessionInfos();
        this._logActivity('user/logout');
        this._init(); // reset client-state 
    }


    //#endregion user

    //#endregion private

    //#region public
    // --------- Public ---------    

    //#region general
    /**
     * Handler for client-event.
     * Can be async.
     * Response data must be returned.
     * @callback Client~eventHandler
     * @param {object} data event-data
     */


    /**
     * Registers an event-handler. Calls event handler with current context (this).
     * @param {string} event event-identifier
     * @param {Client~eventHandler} handler event-handler
     * @param {object} [options] additional options
     * @param {boolean} [options.requiresActiveEvent=false] true if event-handler requires an event to be active
     * @param {boolean} [options.requiresAuthentication=false] true if event-handler requries authentication
     * @param {PermissionLevelEnum} [options.requiredPermissionLevel=PermissionLevelEnum.NOT_A_USER] required permission level
     */
    on(event, handler, options) {
        const opts = {
            requiresActiveEvent: false,
            requiresAuthentication: false, 
            requiredPermissionLevel: PermissionLevelEnum.NOT_A_USER, 
            ...options,
        };

        this._socket.on(event, async (data, cb) => {
            const debugInfo = `\t${event.padEnd(40)}\t${this.id}\t${this.userId}`;
            try {
                let err = null;
                // check for authentication
                if (opts.requiresAuthentication && !this.userId)
                    err = utils.createError('authentication required', statusCodes.UNAUTHORIZED);
                // check for activeEvent set
                if (opts.requiresActiveEvent && !this.activeEventId)
                    err = utils.createError('event requires an event to be active', statusCodes.FAILED_DEPENDENCY);
                if (err) {
                    console.warn('EVENT', debugInfo, err.statusCode, err);
                    return cb(utils.createError(`${event} failed`, err.statusCode));
                }
                // handle event with current context, Promise.resolve is needed to support async and sync handlers
                // in case of error: handler is responsible for calling socket-cb with custom error data
                const res = await Promise.resolve(handler.call(this, data));
                console.debug('EVENT', debugInfo);
                if (cb)
                    cb(null, res);
            } catch (err) {
                if (!err.doNotLog)
                    console.error('EVENT', debugInfo, err.statusCode, err);
                if (cb)
                    cb(utils.createError(`${event} failed`, err.statusCode));
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
