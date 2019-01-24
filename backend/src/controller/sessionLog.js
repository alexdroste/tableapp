"use strict";

const db = require('../db').db;
const utils = require('../utils');
var statusCodes = require('http-status-codes');


/**
 * Controller for user session loggin.
 * @module sessionLogController
 */


// --------- Public ---------

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
async function saveSessionInfo(userId, fromTimestamp, toTimestamp, sessionToken, ip, userAgent) {
    if (!userId || !fromTimestamp || !toTimestamp || !sessionToken)
        throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);
    
    const res = await db().collection('sessionlog')
        .insertOne({
            from: fromTimestamp,
            ip,
            sessionToken,
            to: toTimestamp,
            userAgent,
            userId,
        });
        
    if (res.result.ok !== 1)
        throw utils.createError('error saving user session info', statusCodes.INTERNAL_SERVER_ERROR);
    if (res.result.n < 1)
        throw utils.createError('userId not found', statusCodes.NOT_FOUND);
}
exports.saveSessionInfo = saveSessionInfo;
