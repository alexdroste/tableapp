"use strict";
var statusCodes = require('http-status-codes');
const utils = require('../utils');


/**
 * Controller for analytics.
 */
class ActivityLogController {
    /**
     * Initializes analytics controller.
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

    

    // --------- Public ---------



    // methods

    /**
     * Logs a user-activity.
     * @async
     * @function
     * @param {string} activity name of activity
     * @param {string} userId id of user
     * @param {ObjectID} activeEventId id of users active event
     * @param {object} data additional data
     */
    async logActivity(activity, userId, activeEventId, data) {
        console.debug(`ACTIVITY\t${activity.padEnd(40)}\t${userId}\t${activeEventId}\t${JSON.stringify(data)}`);

        const res = await this._db.collection('activitylog').insertOne({
            activeEventId,
            activity,
            data,
            timestamp: Date.now(),
            userId,
        });

        if (res.insertedCount < 1)
            throw utils.createError('activity could not be logged');
    }
}


module.exports = ActivityLogController;
