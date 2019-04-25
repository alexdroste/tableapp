"use strict";

const broker = require('../broker');
const config = require('../config');
const db = require('../db').db;
const LDAPConnection = require('../LDAPConnection');
const ldapUtils = require('../ldapUtils');
const PermissionLevelEnum = require('../PermissionLevelEnum');
const statusCodes = require('http-status-codes');
const utils = require('../utils');


/**
 * Controller for events.
 * @module eventsController
 */

/**
 * A role object.
 * @typedef {object} Role
 * @property {string} color named color, e.g. "red", "violet", "blue", ...
 * @property {string} id role-id
 * @property {string} name name of role, e.g. "Tutor"
 */


/**
 * List of roles (see {@link eventsController~Role}) ordered by priority.
 * @typedef {Array<eventsController~Role>} eventsController~RoleList
 */


/**
 * An event-user object.
 * @typedef {object} EventUser
 * @property {string} [email] users email address
 * @property {string} name users full name, e.g. "Dr. Max Mustermann"
 * @property {PermissionLevelEnum} [permissionLevel] users permission level
 * @property {string} roleId users roleId
 */


/**
 * Dictionary of EventUsers.
 * 
 * dict[key] = value:
 * * key := id of user
 * * value := {@link EventUser}
 * @typedef {object} UserDict
 */


/**
 * An event object.
 * Containing non-general event infos for a single user.
 * @typedef {object} TableEvent
 * @property {boolean} isArchived indicates if event is archived
 * @property {string} name title/name of event
 * @property {PermissionLevelEnum} permissionLevel permission level of user
 */


/**
 * Dictionary of TableEvents.
 * 
 * dict[key] = value:
 * * key := id of event
 * * value := {@link TableEvent}
 * @typedef {object} EventDict
 */


// --------- Private ---------

/**
 * Internal method that triggers update handlers.
 * @private
 * @function
 * @param {ObjectID} eventId id of updated event
 */
function _onEventUpdated(eventId) {
    broker.handleEventUpdated(eventId);
}


/**
 * Internal method that triggers update handlers.
 * @private
 * @function
 * @param {ObjectID} eventId id of event which users have been updated
 * @param {Array<string>} userIds array of updated/affected userIds
 */
function _onEventUsersUpdated(eventId, userIds) {
    broker.handleEventUsersUpdated(eventId, userIds);
}


// --------- Public ---------

/**
 * Changes an events name/title.
 * @static
 * @async
 * @function
 * @param {ObjectID} eventId id of event 
 * @param {string} newName new name/title of event
 * @returns {Promise} indicates success
 */
async function changeEventName(eventId, newName) {
    if (!eventId || !newName)
        throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

    const res = await db().collection('events').updateOne(
        { _id: eventId }, 
        { $set: { name: newName }}
    );
    if (res.result.ok !== 1)
        throw utils.createError('error changing name of event', statusCodes.INTERNAL_SERVER_ERROR);
    if (res.result.n < 1)
        throw utils.createError('eventId not found', statusCodes.NOT_FOUND);
    if (res.result.nModified > 0)
        _onEventUpdated(eventId);
}
exports.changeEventName = changeEventName;


/**
 * Changes a users permission level for a specific event.
 * @static
 * @async
 * @function
 * @param {ObjectID} eventId id of event 
 * @param {string} userId id of user
 * @param {PermissionLevelEnum} permissionLevel permission level to set
 * @returns {Promise} indicates success
 * @throws {Error} with message: 'eventId not found' with code NOT_FOUND if supplied eventId does not exist
 */
async function changeUserPermissionLevelForEvent(eventId, userId, permissionLevel) {
    if (!userId || !eventId || permissionLevel === undefined || permissionLevel === null)
        throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

    const update = {};
    if (permissionLevel === PermissionLevelEnum.NOT_A_USER) {
        update.$unset = {};
        update.$unset['users.' + userId] = 1;
    }
    else {
        update.$set = {};
        update.$set['users.' + userId + '.permissionLevel'] = permissionLevel;
    }
    const res = await db().collection('events')
        .updateOne({ _id: eventId }, update);
    if (res.result.ok !== 1)
        throw utils.createError('error changing permission for user', statusCodes.INTERNAL_SERVER_ERROR);
    if (res.result.n < 1)
        throw utils.createError('eventId not found', statusCodes.NOT_FOUND);
    if (res.result.nModified > 0)
        _onEventUsersUpdated(eventId, [userId]);
}
exports.changeUserPermissionLevelForEvent = changeUserPermissionLevelForEvent;


/**
 * Retrives EventDict for a user.
 * @static
 * @async
 * @function
 * @param {string} userId userId to get dict for
 * @param {boolean} [full=false] true receives every event, false only joined ones
 * @param {ObjectID[]} [eventIds=[]] Array of eventIds to retrieve dict for. Empty array []
 * means all events. Defaults to []. If set, parameter full is ignored.
 * @returns {Promise<EventsController~EventDict>} resolves to dictionary of events (for user)
 */
async function getEventDict(userId, full = false, eventIds = []) {
    if (!userId)
        throw utils.createError('userId param must be set', statusCodes.BAD_REQUEST);

    const query = {};
    if (eventIds && eventIds.length > 0) {
        query._id = {
            $in: eventIds
        };
    } else if (!full) {
        query['users.' + userId + '.permissionLevel'] = {
            $gte: PermissionLevelEnum.USER
        };
    }


    const projection = {'_id': 1, 'isArchived': 1, 'name': 1};
    projection['users.' + userId + '.permissionLevel'] = 1;

    const eventsArr = await db().collection('events')
        .find(query)
        .project(projection)
        .toArray();

    const dict = {};
    eventsArr.forEach(event => {
        dict[event._id] = {
            isArchived: event.isArchived,
            name: event.name,
            permissionLevel: event.users.hasOwnProperty(userId) ?
                event.users[userId].permissionLevel : PermissionLevelEnum.NOT_A_USER
        };
    });
    return dict;
}
exports.getEventDict = getEventDict;


/**
 * Retrieves rolesList for an event.
 * @static
 * @async
 * @function
 * @param {ObjectID} eventId id of event
 * @returns {Promise<EventsController~RoleList>} resolves to list of roles ordered by priority
 * @throws {Error} with message: 'eventId not found' with code NOT_FOUND if supplied eventId does not exist
 */
async function getRoleList(eventId) {
    if (!eventId)
        throw utils.createError('eventId param must be set', statusCodes.BAD_REQUEST);

    const eventsArr = await db().collection('events')
        .find({ _id: eventId })
        .project({ roles: 1 })
        .toArray();

    if (eventsArr < 1)
        throw utils.createError('eventId not found', statusCodes.NOT_FOUND);

    return eventsArr[0].roles;
}
exports.getRoleList = getRoleList;


/**
 * Retrieves userDict for an event.
 * @static
 * @async
 * @function
 * @param {ObjectID} eventId id of event to retrieve user dict from
 * @param {boolean} [withName=true] adds name property to user objects
 * @param {boolean} [withPermissionLevelAndEmail=false] if true, keeps permissionLevel property and adds email address of user
 * @param {string[]} [userIds=[]] Array of userIds to limit dict to. Unset means all users.
 * @returns {Promise<EventsController~UserDict>} resolves to dictionary of event-users
 * @throws {Error} with message: 'eventId not found' with code NOT_FOUND if supplied eventId does not exist
 */
async function getUserDict(eventId, withName = true, withPermissionLevelAndEmail = false, userIds = []) {
    const ldap = new LDAPConnection(config.ldap.dn, config.ldap.password);
    try {
        if (!eventId)
            throw utils.createError('eventId param must be set', statusCodes.BAD_REQUEST);

        const projection = {};
        if (userIds && userIds.length > 0) {
            for (let userId of userIds) {
                projection['users.' + userId] = 1;
            }
        } else {
            projection['users'] = 1;
        }

        const eventsArr = await db().collection('events')
            .find({ _id: eventId })
            .project(projection)
            .toArray();

        if (eventsArr < 1)
            throw utils.createError('eventId not found', statusCodes.NOT_FOUND);
        
        await ldap.open();
        const users = eventsArr[0].users;
        const promises = Object.keys(users).map(async (userId) => {
            if (withName)
                users[userId].name = await ldapUtils.getNameFromUserIdWithCache(ldap, userId);
            if (withPermissionLevelAndEmail)
                users[userId].email = await ldapUtils.getEmailFromUserIdWithCache(ldap, userId);
            else
                delete users[userId].permissionLevel;
        });
        await Promise.all(promises);

        // set not found userIds explicitly to null in order to support deletion (client-side)
        userIds.forEach((userId) => {
            if (!users[userId])
                users[userId] = null;
        });
        return users;
    } catch (err) {
        throw err;
    } finally {
        ldap.close();
    }
}
exports.getUserDict = getUserDict;


/**
 * Checks if eventId is valid and exists in db.
 * @static
 * @async
 * @function
 * @param {ObjectID} eventId id of event
 * @returns {boolean} indicates if eventId is valid
 */
async function isEventIdValid(eventId) {
    if (!eventId)
        return false;
    const eventsArr = await db().collection('events')
        .find({ _id: eventId })
        .project({ _id: 1 })
        .toArray();

    if (eventsArr < 1)
        return false;
    return true;
}
exports.isEventIdValid = isEventIdValid;
