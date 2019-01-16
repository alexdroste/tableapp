"use strict";

const config = require('../config');
const db = require('../db').db;
const LDAPConnection = require('../LDAPConnection');
const utils = require('../utils');
var statusCodes = require('http-status-codes');


/**
 * Controller for user-data.
 * @module userController
 */


/**
 * Login data object.
 * @typedef {object} LoginData
 * @property {(ObjectID|null)} activeEventId id of active (or last active) event, null if no event is active
 * @property {boolean} hasAcceptedTos indicates if user accepted the terms of service
 * @property {string} id id of user
 * @property {string} name name of user
 * @property {string} sessionToken sessionToken (jwt)
 */


// --------- Private ---------

/**
 * Creates login data object.
 * @private
 * @async
 * @function
 * @param {string} dn DN of user
 * @param {Promise<string>} sessionToken resolves to sessionToken (jwt)
 * @returns {Promise<UserController~LoginData>} resolves to login data object
 */
async function _createLoginData(dn, sessionToken) {
    const ldap = new LDAPConnection(config.ldap.dn, config.ldap.password);
    try { 
        await ldap.open();
        const id = Buffer.from(dn).toString('base64'); // !important to filter illegal characters ($, .)
        const name = await ldap.getNameFromDn(dn);

        // create user in db if not exist (first login)
        const resUpdate = await db().collection('users').updateOne(
                { _id: id },
                {
                    $setOnInsert: {
                        hasAcceptedTos: false,
                        lastActiveEventId: null,
                        sessionInfos: [],
                    }
                },
                { upsert: true }
            );
        if (resUpdate.result.ok !== 1)
            throw utils.createError('error updating/upserting user document', statusCodes.INTERNAL_SERVER_ERROR);
        
        // fetch user doc
        const userDoc = await db().collection('users').findOne(
                { _id: id },
                { projection: {
                    hasAcceptedTos: 1,
                    lastActiveEventId: 1,
                }}
            );
        if (!userDoc)
            throw utils.createError('userId not found', statusCodes.NOT_FOUND);

        return {
            activeEventId: userDoc.lastActiveEventId,
            hasAcceptedTos: userDoc.hasAcceptedTos,
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
 * Sets hasAcceptedTos to true for a user.
 * @static
 * @async
 * @function
 * @param {string} userId id of user
 * @returns {Promise} indicates success
 */
async function acceptTos(userId) {
    if (!userId)
        throw utils.createError('userId param must be set', statusCodes.BAD_REQUEST);
    
    const res = await db().collection('users')
        .updateOne({ _id: userId }, { $set: { hasAcceptedTos: true } });
    if (res.result.ok !== 1)
        throw utils.createError('error setting hasAcceptedTos for user', statusCodes.INTERNAL_SERVER_ERROR);                
    if (res.result.n < 1)
        throw utils.createError('userId not found', statusCodes.NOT_FOUND);
}
exports.acceptTos = acceptTos;


/**
 * Continue session with supplied sessionToken.
 * @static
 * @async
 * @function
 * @param {string} sessionToken valid sessionToken
 * @returns {Promise<UserController~LoginData>} resolve to login data object (id, name, sessionToken)
 * @throws {Error} if supplied sessionToken is not valid/expired
 */
async function continueSession(sessionToken) {
    if (!sessionToken)
        throw utils.createError('sessionToken param must be set', statusCodes.BAD_REQUEST);

    const payload = utils.verifySessionToken(sessionToken); // throws
    return await _createLoginData(payload.dn, sessionToken);
}
exports.continueSession = continueSession;


// /**
//  * Retrieves id of last active event for a user.
//  * @async
//  * @function
//  * @param {string} userId id of user
//  * @returns {Promise<(ObjectID|null)>} resolves to last ative event-id (or null)
//  */
// async getLastActiveEventId(userId) {
//     if (!userId)
//         throw utils.createError('userId param must be set', statusCodes.BAD_REQUEST);

//     const arr = await db().collection('users')
//         .find({ _id: userId })
//         .project({ lastActiveEventId: 1 })
//         .toArray();
    
//     if (arr.length < 1)
//         return null;
    
//     return arr[0].lastActiveEventId;
// }


/**
 * Login user by email and password.
 * 
 * HINT: if app is not in production mode, using 'debug' as password always grants access
 * @static
 * @async
 * @function
 * @param {string} email email of user
 * @param {string} password password of user
 * @returns {Promise<UserController~LoginData>} resolves to login data object (id, name, sessionToken)
 * @throws {Error} with message: 'email not found' and code NOT_FOUND if supplied email could not be found
 * @throws {Error} if user/password combination could not be used to bind to ldap
 */
async function login(email, password) {
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

        return await _createLoginData(dn, utils.createSessionToken(dn));
    } catch (err) { 
        throw err;
    } finally {
        ldap.close(); 
        if (loginLdap)
            loginLdap.close();
    }
}
exports.login = login;


/**
 * Sets lastActiveEventId for a user.
 * @static
 * @async
 * @function
 * @param {string} userId id of user
 * @param {ObjectID} eventId id of event to set as lastActiveEventId
 * @returns {Promise} indicates success
 */
async function saveLastActiveEventId(userId, eventId) {
    if (!userId)
        throw utils.createError('userId param must be set', statusCodes.BAD_REQUEST);
    
    const res = await db().collection('users')
        .updateOne({ _id: userId }, { $set: { lastActiveEventId: eventId } });
    if (res.result.ok !== 1)
        throw utils.createError('error setting lastActiveEventId for user', statusCodes.INTERNAL_SERVER_ERROR);                
    if (res.result.n < 1)
        throw utils.createError('userId not found', statusCodes.NOT_FOUND);
}
exports.saveLastActiveEventId = saveLastActiveEventId;


/**
 * Saves sessionInfo for a user. Used for tracking and analysis.
 * @static
 * @async
 * @function
 * @param {string} userId id of user
 * @param {number} fromTimestamp login/auth timestamp
 * @param {number} toTimestamp logout/disconnect timestamp
 * @param {string} sessionToken used sessionToken
 * @param {string} [ip] ip-address
 * @param {string} [userAgent] userAgent of users browser
 * @returns {Promise} indicates success
 */
async function saveSessionInfos(userId, fromTimestamp, toTimestamp, sessionToken, ip, userAgent) {
    if (!userId || !fromTimestamp || !toTimestamp || !sessionToken)
        throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);
    
    const res = await db().collection('users')
        .updateOne({ _id: userId }, {
            $push: { sessionInfos: {
                from: fromTimestamp,
                to: toTimestamp,
                sessionToken,
                ip,
                userAgent,
            }},
        });
        
    if (res.result.ok !== 1)
        throw utils.createError('error saving user session info', statusCodes.INTERNAL_SERVER_ERROR);
    if (res.result.n < 1)
        throw utils.createError('userId not found', statusCodes.NOT_FOUND);
}
exports.saveSessionInfos = saveSessionInfos;
