"use strict";

const DB_NAME = 'tableapp-190205';
const DB_URL = 'mongodb://localhost:27017';

const MongoClient = require('mongodb').MongoClient;


let _instance = null;


async function connect() {
    return MongoClient.connect(DB_URL).then(client => {
        console.info('mongodb connected');
        _instance = client.db(DB_NAME);
        return Promise.resolve();
    });
}
exports.connect = connect;


function db() {
    return _instance;
}
exports.db = db;
