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

    async logActivity(activity, userId, ip, userAgent, activeEventId, data) {
        console.debug(`ACTIVITY\t${activity.padEnd(40)}\t${userId}\t${ip}\t${userAgent}\t${activeEventId}\t${JSON.stringify(data)}`);
        const logDoc = {
            timestamp: Date.now(),
            activity,
            userId,
            ip,
            userAgent,
            activeEventId,
            data,
        };
    }
}


module.exports = ActivityLogController;
