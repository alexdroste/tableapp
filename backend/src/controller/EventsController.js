"use strict";
const config = require('../config');
const LDAPConnection = require('../LDAPConnection');
const PermissionLevelEnum = require('../PermissionLevelEnum');
const utils = require('../utils');
const ldapUtils = require('../ldapUtils');
var statusCodes = require('http-status-codes');


/**
 * Controller for events.
 */
class EventsController {
    /**
     * A role object.
     * @typedef {object} EventsController~Role
     * @property {string} color named color, e.g. "red", "violet", "blue", ...
     * @property {string} id role-id
     * @property {string} name name of role, e.g. "Tutor"
     */


    /**
     * List of roles (see {@link EventsController~Role}) ordered by priority.
     * @typedef {Array<EventsController~Role>} EventsController~RoleList
     */


    /**
     * An event-user object.
     * @typedef {object} EventsController~EventUser
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
     * * value := {@link EventsController~EventUser}
     * @typedef {object} EventsController~UserDict
     */


    /**
     * An event object.
     * Containing non-general event infos for a single user.
     * @typedef {object} EventsController~TableEvent
     * @property {boolean} isArchived indicates if event is archived
     * @property {string} name title/name of event
     * @property {PermissionLevelEnum} permissionLevel permission level of user
     */


    /**
     * Dictionary of TableEvents.
     * 
     * dict[key] = value:
     * * key := id of event
     * * value := {@link EventsController~TableEvent}
     * @typedef {object} EventsController~EventDict
     */


    /**
     * Initializes events controller.
     * @param {object} dbConnection mongodb database connection
     */
    constructor(dbConnection) {
        /**
         * Database connection that is beeing used.
         * @private
         * @type {object}
         */
        this._db = dbConnection;      

        /**
         * Registered onEventUsersUpdated callback.
         * @private
         * @type {(EventsController~onEventUsersUpdatedCallback|null)}
         */
        this._onEventUsersUpdatedCallback = null;
    }

    
    // --------- Private ---------
    
    /**
     * Internal method that calls onEventUsersUpdated callback function.
     * @private
     * @function
     * @param {ObjectID} eventId id of event which users have been updated
     * @param {Array<string>} userIds array of updated/affected userIds
     */
    _onEventUsersUpdated(eventId, userIds) {
        if (!this._onEventUsersUpdatedCallback)
            return;

        this._onEventUsersUpdatedCallback(eventId, userIds);
    }
    

    // --------- Public ---------

    // events

    /**
     * Function called when users of an event have been updated.
     * @callback EventsController~onEventUsersUpdatedCallback
     * @param {ObjectID} eventId id of event which users have been updated
     * @param {Array<string>} userIds array of updated/affected userIds
     */

    
    /**
     * Register callback for event users have been updated.
     * @function
     * @param {EventsController~onEventUsersUpdatedCallback} cb callback when users of an event have been updated
     */
    onEventUsersUpdated(cb) {
        this._onEventUsersUpdatedCallback = cb;
    }


    // methods 

    /**
     * Changes a users permission level for a specific event.
     * @async
     * @function
     * @param {ObjectID} eventId id of event 
     * @param {string} userId id of user
     * @param {PermissionLevelEnum} permissionLevel permission level to set
     * @returns {Promise} indicates success
     * @throws {Error} with message: 'eventId not found' with statusCode NOT_FOUND if supplied eventId does not exist
     */
    async changeUserPermissionLevelForEvent(eventId, userId, permissionLevel) {
        try {
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
            const res = await this._db.collection('events')
                .updateOne({ _id: eventId }, update);
            if (res.result.ok !== 1)
                throw utils.createError('error changing permission for user', statusCodes.INTERNAL_SERVER_ERROR);
            if (res.result.n < 1)
                throw utils.createError('eventId not found', statusCodes.NOT_FOUND);
            if (res.result.nModified > 0)
                this._onEventUsersUpdated(eventId, [userId]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }


    /**
     * Retrives EventDict for a user.
     * @async
     * @function
     * @param {string} userId userId to get dict for
     * @param {boolean} [full=false] true receives every event, false only joined ones
     * @param {ObjectID[]} [eventIds=[]] Array of eventIds to retrieve dict for. Empty array []
     * means all events. Defaults to []. If set, parameter full is ignored.
     * @returns {Promise<EventsController~EventDict>} resolves to dictionary of events (for user)
     */
    async getEventDict(userId, full = false, eventIds = []) {
        try {
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

            const eventsArr = await this._db.collection('events')
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
        } catch (err) {
            console.error(err);
            throw err;
        }
    }


    /**
     * Retrieves rolesList for an event.
     * @async
     * @function
     * @param {ObjectID} eventId id of event
     * @returns {Promise<EventsController~RoleList>} resolves to list of roles ordered by priority
     * @throws {Error} with message: 'eventId not found' with statusCode NOT_FOUND if supplied eventId does not exist
     */
    async getRoleList(eventId) {
        try {
            if (!eventId)
                throw utils.createError('eventId param must be set', statusCodes.BAD_REQUEST);

            const eventsArr = await this._db.collection('events')
                .find({ _id: eventId })
                .project({ roles: 1 })
                .toArray();

            if (eventsArr < 1)
                throw utils.createError('eventId not found', statusCodes.NOT_FOUND);

            return eventsArr[0].roles;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }


    /**
     * Retrieves userDict for an event.
     * @async
     * @function
     * @param {ObjectID} eventId id of event to retrieve user dict from
     * @param {boolean} [withName=true] adds name property to user objects
     * @param {boolean} [withPermissionLevelAndEmail=false] if true, keeps permissionLevel property and adds email address of user
     * @param {string[]} [userIds=[]] Array of userIds to limit dict to. Unset means all users.
     * @returns {Promise<EventsController~UserDict>} resolves to dictionary of event-users
     * @throws {Error} with message: 'eventId not found' with statusCode NOT_FOUND if supplied eventId does not exist
     */
    async getUserDict(eventId, withName = true, withPermissionLevelAndEmail = false, userIds = []) {
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

            const eventsArr = await this._db.collection('events')
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
            console.error(err);
            throw err;
        } finally {
            ldap.close();
        }
    }
}


module.exports = EventsController;
