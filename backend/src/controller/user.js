"use strict";

const config = require('../config');
const db = require('../db').db;
const LDAPConnection = require('../LDAPConnection');
const NotificationTypesEnum = require('../NotificationTypesEnum');
const utils = require('../utils');
var statusCodes = require('http-status-codes');


/**
 * Controller for user-data.
 * @module userController
 */


/**
 * Login data object.
 * @typedef {object} LoginData
 * @property {Array<string>} extSurveys // extra-code for surveys
 * @property {boolean} hasAcceptedTos indicates if user accepted the terms of service
 * @property {string} id id of user
 * @property {(ObjectID|null)} lastActiveEventId id of last active event, null if no event is active
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
                        emailNotifications: [NotificationTypesEnum.COMMENT_ON_ENTRY, NotificationTypesEnum.REPLY_ON_COMMENT, NotificationTypesEnum.NEW_ENTRY],
                        extSurveys: [], // extra-code for surveys
                        hasAcceptedTos: false,
                        inAppNotifications: [NotificationTypesEnum.COMMENT_ON_ENTRY, NotificationTypesEnum.REPLY_ON_COMMENT, NotificationTypesEnum.NEW_ENTRY],
                        lastActiveEventId: null,
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
                    extSurveys: 1, // extra-code for surveys
                    hasAcceptedTos: 1,
                    lastActiveEventId: 1,
                }}
            );
        if (!userDoc)
            throw utils.createError('userId not found', statusCodes.NOT_FOUND);

        return {
            extSurveys: userDoc.extSurveys, // extra-code for surveys
            hasAcceptedTos: userDoc.hasAcceptedTos,
            id,
            lastActiveEventId: userDoc.lastActiveEventId,
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


// extra-code for surveys
async function addExtSurveyIdDone(userId, extSurveyId) {
    if (!extSurveyId || !userId)
        throw utils.createError('extSurveyId & userId params must be set', statusCodes.BAD_REQUEST);

    const res = await db().collection('users')
        .updateOne({ _id: userId }, { $addToSet: { extSurveys: extSurveyId } });
    if (res.result.ok !== 1)
        throw utils.createError('error setting extSurvey-id done for user', statusCodes.INTERNAL_SERVER_ERROR);                
    if (res.result.n < 1)
        throw utils.createError('userId not found', statusCodes.NOT_FOUND);
}
exports.addExtSurveyIdDone = addExtSurveyIdDone;


/**
 * Changes the activated email/in-app notifications for a user.
 * @static
 * @async
 * @function
 * @param {string} userId id of user
 * @param {Array<NotificationTypesEnum>} emailNotifications array of activated email notification types
 * @param {Array<NotificationTypesEnum>} inAppNotifications array of activated in-app notification types
 * @returns {Promise} indicates success
 */
async function changeActiveNotificationTypes(userId, emailNotifications, inAppNotifications) {
    if (!emailNotifications || !inAppNotifications || !Array.isArray(emailNotifications) || !Array.isArray(inAppNotifications))
        throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);
    
    emailNotifications.sort((a,b) => a-b);
    inAppNotifications.sort((a,b) => a-b);

    const res = await db().collection('users').updateOne({ _id: userId }, 
            { 
                $set: { 
                    emailNotifications,
                    inAppNotifications,
                } 
            }
        );
    if (res.result.ok !== 1)
        throw utils.createError('error changing active notifications for user', statusCodes.INTERNAL_SERVER_ERROR);                
    if (res.result.n < 1)
        throw utils.createError('userId not found', statusCodes.NOT_FOUND);
}
exports.changeActiveNotificationTypes = changeActiveNotificationTypes;


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
 * Retrieves activated notification types for user.
 * @static
 * @async
 * @function
 * @param {string} userId id of user
 * @returns {Promise<object>} resolves to object containing emailNotifications and inAppNotifications
 */
async function getActiveNotificationTypes(userId) {
    if (!userId)
        throw utils.createError('userId must be set', statusCodes.BAD_REQUEST);

    const userDoc = await db().collection('users').findOne(
            { _id: userId },
            { projection: {
                emailNotifications: 1,
                inAppNotifications: 1,
            }}
        );
    if (!userDoc)
        throw utils.createError('userId not found', statusCodes.NOT_FOUND);

    return {
        emailNotifications: userDoc.emailNotifications,
        inAppNotifications: userDoc.inAppNotifications,
    };
}
exports.getActiveNotificationTypes = getActiveNotificationTypes;


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
