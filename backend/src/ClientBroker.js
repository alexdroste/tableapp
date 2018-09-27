"use strict";

const Client = require('./Client');
const PermissionLevelEnum = require('./PermissionLevelEnum');


/**
 * Class that manages client connections, listens to data updates
 * and distributes updates among connected clients.
 */
class ClientBroker {
    /**
     * Creates a ClientBroker instance.
     * @param {SocketIO} io socket io instance
     * @param {Controller} controller controller object containing initialized controllers
     */
    constructor(io, controller) {
        /**
         * Used socketio instance.
         * @private
         * @type {SocketIO}
         */
        this._io = io;
        /**
         * Used Controller object.
         * @private
         * @type {Controller}
         */
        this._controller = controller;
        /**
         * Array of managed/connected client instances.
         * @private
         * @type {Array<Client>}
         */
        this._clients = [];

        // setup (controller)event listeners
        // comments
        this._controller.comments.onCommentUpdated((...args) => this._handleCommentUpdated(...args));

        // entries
        this._controller.entries.onEntryUpdated((...args) => this._handleEntryUpdated(...args));

        // events
        this._controller.events.onEventUsersUpdated((...args) => this._handleEventUsersUpdated(...args));

        // eventScreenshots
        this._controller.eventScreenshots.onEventScreenshotsUpdated((...args) => this._handleEventScreenshotsUpdated(...args));

        // setup socket listeners
        this._io.on('connection', (socket) => this._handleConnection(socket));
    }


    // --------- Private ---------

    // general
    /**
     * Eventhandler for new connection.
     * @private
     * @function
     * @param {SocketIoConnection} socket socket connection to client
     */
    _handleConnection(socket) {
        let client = new Client(socket, this._controller, this);
        console.log('client connected', { clientId: client.id, ip: client.ip, userAgent: client.userAgent });
        this._clients.push(client);
    }


    // comments
    /**
     * Eventhandler for updated comment data.
     * @async
     * @private
     * @function
     * @param {ObjectID} eventId id of event of updated comment
     * @param {ObjectID} entryId id of entry of updated comment
     * @param {ObjectID} commentId id of comment which has been updated
     * @param {boolean} affectsEntryMetadata indicates if update of comment affects metadata of the superordinate entry
     * @returns {Promise} indicates success
     */
    async _handleCommentUpdated(eventId, entryId, commentId, affectsEntryMetadata) {
        if (affectsEntryMetadata) {
            // call updateEntry for entryId to update commentCount, etc.
            this._handleEntryUpdated(eventId, entryId);
        }
        try {
            // TODO handle comment deleted
            this._clients.forEach(async (client) => {
                try {
                    if (!eventId.equals(client.activeEventId)
                        || !entryId.equals(client.commentsSubscribedForEntryId))
                        return;
                    await client.updateComment(entryId, commentId);
                } catch (err) {
                    console.error(err);
                }
            });
        } catch (err) {
            console.error(err);
        }
    }


    // entries
    /**
     * Eventhandler for updated entry data.
     * @async
     * @private
     * @function
     * @param {ObjectID} eventId id of event of updated entry
     * @param {ObjectID} entryId id of entry which has been updated
     * @returns {Promise} indicates success
     */
    async _handleEntryUpdated(eventId, entryId) {
        try {
            // TODO handle entry deleted
            const entryInfo = await this._controller.entries.getEntryInfo(eventId, entryId);

            this._clients.forEach(async (client) => {
                try {
                    if (!eventId.equals(client.activeEventId))
                        return;
                    await client.updateEntry(entryInfo);
                } catch (err) {
                    console.error(err);
                }
            });
        } catch (err) {
            console.error(err);
        }
    }


    // events
    /**
     * Eventhandler for updated user data (of event).
     * @async
     * @private
     * @function
     * @param {ObjectID} eventId id of event which users have been updated
     * @param {Array<string>} userIds array of updated/affected userIds
     * @returns {Promise} indicates success
     */
    async _handleEventUsersUpdated(eventId, userIds) {
        try {
            const userDictUpdate = await this._controller.events.getUserDict(
                eventId, true, false, userIds);
            const userDictUpdateWithPermissionLevelAndEmail = await this._controller.events.getUserDict(
                eventId, true, true, userIds);

            this._clients.forEach(async (client) => {
                try {
                    const userInvolved = userIds.indexOf(client.userId) !== -1;
                    const isActiveEvent = eventId.equals(client.activeEventId);
                    if (!userInvolved && !isActiveEvent)
                        return;
                    if (userInvolved)
                        await client.updateEventDict([eventId]);
                    // TODO no way to remove a user entry atm, only add/update existing
                    if (isActiveEvent) {
                        if (client.permissionLevel >= PermissionLevelEnum.ADMINISTRATOR)
                            client.emitUpdateUserDict(userDictUpdateWithPermissionLevelAndEmail);
                        else
                            client.emitUpdateUserDict(userDictUpdate);
                    }
                } catch (err) {
                    console.error(err);
                }
            });
        } catch (err) {
            console.error(err);
        }
    }


    // eventScreenshots
    /**
     * Eventhandler for updated screenshot data (of event).
     * @async
     * @private
     * @function
     * @param {ObjectID} eventId id of event which screenshots have been updated
     * @returns {Promise} indicates success
     */
    async _handleEventScreenshotsUpdated(eventId) {
        try {
            const ids = await this._controller.eventScreenshots.getScreenshotIdsForEvent(eventId);

            this._clients.forEach(async (client) => {
                try {
                    if (!eventId.equals(client.activeEventId))
                        return;
                    await client.emitUpdateEventScreenshotIds(ids);
                } catch (err) {
                    console.error(err);
                }
            });
        } catch (err) {
            console.error(err);
        }
    }


    // --------- Public ---------

    // general
    /**
     * Unregister a Client instance.
     * Passed instance will not be managed by this broker after call anymore.
     * @param {Client} client Client instance to unregister.
     */
    unregisterClient(client) {
        this._clients = this._clients.filter((elem) => 
            elem !== client);
    }
}


module.exports = ClientBroker;
