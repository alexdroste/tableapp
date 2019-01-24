"use strict";

const db = require('../db').db;
const utils = require('../utils');


/**
 * Controller for user activity analytics.
 * @module activityLogController
 */


// --------- Public ---------

/**
 * Logs a user-activity.
 * @static
 * @async
 * @function
 * @param {string} activity name of activity
 * @param {string} userId id of user
 * @param {ObjectID} activeEventId id of users active event
 * @param {object} data additional data
 */
async function logActivity(activity, userId, activeEventId, data) {
    console.debug(`ACTIVITY\t${activity.padEnd(40)}\t${userId}\t${activeEventId}\t${JSON.stringify(data)}`);

    const res = await db().collection('activitylog').insertOne({
        activeEventId,
        activity,
        data,
        timestamp: Date.now(),
        userId,
    });

    if (res.insertedCount < 1)
        throw utils.createError('activity could not be logged');
}
exports.logActivity = logActivity;
