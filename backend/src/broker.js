"use strict";

const Client = require('./Client');
const entriesController = require('./controller/entries');
const eventsController = require('./controller/events');
const eventScreenshotsController = require('./controller/eventScreenshots');
const PermissionLevelEnum = require('./PermissionLevelEnum');


/**
 * Module that manages client connections, accepts data updates
 * and distributes updates among connected clients.
 * @module clientBroker
 */


/**
 * Array of managed/connected client instances.
 * @private
 * @type {Array<Client>}
 */
let _clients = [];



// --------- Public ---------

// general
/**
 * Eventhandler for new connection.
 * @static
 * @function
 * @param {SocketIoConnection} socket socket connection to client
 */
function handleConnection(socket) {
    let client = new Client(socket);
    console.debug(`BROKER-EVENT\t${'connection'.padEnd(40)}\t${client.id}\t${client.ip}\t${client.userAgent}`);
    _clients.push(client);
}
exports.handleConnection = handleConnection;


/**
 * Unregister a Client instance.
 * Passed instance will not be managed by this broker after call anymore.
 * @static
 * @function
 * @param {Client} client Client instance to unregister.
 */
function unregisterClient(client) {
    _clients = _clients.filter((elem) => 
        elem !== client);
}
exports.unregisterClient = unregisterClient;


// comments
/**
 * Eventhandler for updated comment data.
 * @static
 * @async
 * @function
 * @param {ObjectID} eventId id of event of updated comment
 * @param {ObjectID} entryId id of entry of updated comment
 * @param {ObjectID} commentId id of comment which has been updated
 * @param {boolean} affectsEntryMetadata indicates if update of comment affects metadata of the superordinate entry
 * @returns {Promise} indicates success
 */
async function handleCommentUpdated(eventId, entryId, commentId, affectsEntryMetadata) {
    if (affectsEntryMetadata) {
        // call updateEntry for entryId to update commentCount, etc.
        handleEntryUpdated(eventId, entryId);
    }
    try {
        _clients.forEach(async (client) => {
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
exports.handleCommentUpdated = handleCommentUpdated; 


// entries
/**
 * Eventhandler for updated entry data.
 * @static
 * @async
 * @function
 * @param {ObjectID} eventId id of event of updated entry
 * @param {ObjectID} entryId id of entry which has been updated
 * @returns {Promise} indicates success
 */
async function handleEntryUpdated(eventId, entryId) {
    try {
        const entryInfo = await entriesController.getEntryInfo(eventId, entryId);

        _clients.forEach(async (client) => {
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
exports.handleEntryUpdated = handleEntryUpdated;


// events
/**
 * Eventhandler for updated event-data.
 * @static
 * @async
 * @function
 * @param {ObjectID} eventId id of event which users have been updated
 * @returns {Promise} indicates success
 */
async function handleEventUpdated(eventId) {
    try {
        _clients.forEach(async (client) => {
            try {
                if (client.userId)
                    await client.updateEventDict([eventId]);
            } catch (err) {
                console.error(err);
            }
        });
    } catch (err) {
        console.error(err);
    }
}
exports.handleEventUpdated = handleEventUpdated;


/**
 * Eventhandler for updated user data (of event).
 * @static
 * @async
 * @function
 * @param {ObjectID} eventId id of event which users have been updated
 * @param {Array<string>} userIds array of updated/affected userIds
 * @returns {Promise} indicates success
 */
async function handleEventUsersUpdated(eventId, userIds) {
    try {
        const userDictUpdate = await eventsController.getUserDict(
            eventId, true, false, userIds);
        const userDictUpdateWithPermissionLevelAndEmail = await eventsController.getUserDict(
            eventId, true, true, userIds);

        _clients.forEach(async (client) => {
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
exports.handleEventUsersUpdated = handleEventUsersUpdated;


// eventScreenshots
/**
 * Eventhandler for updated screenshot data (of event).
 * @static
 * @async
 * @function
 * @param {ObjectID} eventId id of event which screenshots have been updated
 * @returns {Promise} indicates success
 */
async function handleEventScreenshotsUpdated(eventId) {
    try {
        const ids = await eventScreenshotsController.getScreenshotIdsForEvent(eventId);

        _clients.forEach(async (client) => {
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
exports.handleEventScreenshotsUpdated = handleEventScreenshotsUpdated;


// notifications
async function handleUpdateNotifications(clientNotificationsUserDict) {
    try {
        const userIds = Object.keys(clientNotificationsUserDict);
        _clients.forEach(async (client) => {
            try {
                if (!userIds.includes(client.userId))
                    return;
                await client.emitUpdateNotificationDict(clientNotificationsUserDict[client.userId]);
            } catch (err) {
                console.error(err);
            }
        });
    } catch (err) {
        console.error(err);
    }
}
exports.handleUpdateNotifications = handleUpdateNotifications;
