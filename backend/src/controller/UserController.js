"use strict";
const config = require('../config');
const LDAPConnection = require('../LDAPConnection');
const utils = require('../utils');
var statusCodes = require('http-status-codes');


/**
 * Controller for user-data.
 */
class UserController {
    /**
     * Initializes user controller.
     * @param {object} dbConnection mongodb database connection
     */
    constructor(dbConnection) {
        /**
         * Database connection that is beeing used.
         * @private
         * @type {object}
         */
        this._db = dbConnection;
    }
    
    
    // --------- Private ---------

    /**
     * Login data object.
     * @typedef {object} UserController~LoginData
     * @property {(ObjectID|null)} activeEventId id of active (or last active) event, null if no event is active
     * @property {string} id id of user
     * @property {string} name name of user
     * @property {string} sessionToken sessionToken (jwt)
     */


    /**
     * Creates login data object.
     * @private
     * @async
     * @function
     * @param {string} dn DN of user
     * @param {Promise<string>} sessionToken resolves to sessionToken (jwt)
     * @returns {Promise<UserController~LoginData>} resolves to login data object
     */
    async _createLoginData(dn, sessionToken) {
        const ldap = new LDAPConnection(config.ldap.dn, config.ldap.password);
        try { 
            await ldap.open();
            const id = Buffer.from(dn).toString('base64'); // !important to filter illegal characters ($, .)
            const name = await ldap.getNameFromDn(dn);
            const activeEventId = await this.getLastActiveEventId(id);
            return {
                activeEventId,
                id,
                name,
                sessionToken
            };
        } catch (err) {
            throw err;
        } finally {
            ldap.close();
        }
        
    }


    // --------- Public ---------

    /**
     * Continue session with supplied sessionToken.
     * @async
     * @function
     * @param {string} sessionToken valid sessionToken
     * @returns {Promise<UserController~LoginData>} resolve to login data object (id, name, sessionToken)
     * @throws {Error} if supplied sessionToken is not valid/expired
     */
    async continueSession(sessionToken) {
        if (!sessionToken)
            throw utils.createError('sessionToken param must be set', statusCodes.BAD_REQUEST);

        const payload = utils.verifySessionToken(sessionToken); // throws
        return await this._createLoginData(payload.dn, sessionToken);
    }


    /**
     * Retrieves id of last active event for a user.
     * @async
     * @function
     * @param {string} userId id of user
     * @returns {Promise<(ObjectID|null)>} resolves to last ative event-id (or null)
     */
    async getLastActiveEventId(userId) {
        if (!userId)
            throw utils.createError('userId param must be set', statusCodes.BAD_REQUEST);

        const arr = await this._db.collection('users')
            .find({ _id: userId })
            .project({ lastActiveEventId: 1 })
            .toArray();
        
        if (arr.length < 1)
            return null;
        
        return arr[0].lastActiveEventId;
    }


    /**
     * Login user by email and password.
     * 
     * HINT: if app is not in production mode, using 'debug' as password always grants access
     * @async
     * @function
     * @param {string} email email of user
     * @param {string} password password of user
     * @returns {Promise<UserController~LoginData>} resolves to login data object (id, name, sessionToken)
     * @throws {Error} with message: 'email not found' and code NOT_FOUND if supplied email could not be found
     * @throws {Error} if user/password combination could not be used to bind to ldap
     */
    async login(email, password) {
        const ldap = new LDAPConnection(config.ldap.dn, config.ldap.password);
        let loginLdap;
        try {
            if (!email || !password)
                throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

            await ldap.open();                
            const dn = await ldap.searchForDnByEmail(email);
            if (!dn)
                throw utils.createError('email not found', statusCodes.NOT_FOUND);
            
            if (!utils.isAppInDevelopmentMode() || password !== 'debug') {
                loginLdap = new LDAPConnection(dn, password);
                await loginLdap.open(); // bind will reject if unsuccessful
            }

            return await this._createLoginData(dn, utils.createSessionToken(dn));
        } catch (err) { 
            throw err;
        } finally {
            ldap.close(); 
            if (loginLdap)
                loginLdap.close();
        }
    }

    
    /**
     * Sets lastActiveEventId for a user.
     * @async
     * @function
     * @param {string} userId id of user
     * @param {ObjectID} eventId id of event to set as lastActiveEventId
     * @returns {Promise} indicates success
     */
    async saveLastActiveEventId(userId, eventId) {
        if (!userId)
            throw utils.createError('userId param must be set', statusCodes.BAD_REQUEST);
        
        const res = await this._db.collection('users')
            .updateOne({ _id: userId }, { $set: { lastActiveEventId: eventId } }, {
                upsert: true,
            });
        if (res.result.ok !== 1)
            throw utils.createError('error setting lastActiveEventId for user', statusCodes.INTERNAL_SERVER_ERROR);                
    }
}


module.exports = UserController;
