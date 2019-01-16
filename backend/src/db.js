"use strict";

/**
 * Manage connection to database.
 * @module db
 */

const config = require('./config');
const MongoClient = require('mongodb').MongoClient;


/**
 * Mongo database instance.
 * @type {Db}
 */
let _instance = null;


/**
 * Establishes connection to mongodb.
 * @static
 * @async
 * @function
 * @returns {Promise} indicates success
 */
async function connect() {
    return MongoClient.connect(config.db.url).then(client => {
        console.info('mongodb connected');
        _instance = client.db(config.db.name);
        return Promise.resolve();
    });
}
exports.connect = connect;


/**
 * Returns current db-instance.
 * @static
 * @function
 * @returns {Db} MongodbClient db instance
 */
function db() {
    return _instance;
}
exports.db = db;
