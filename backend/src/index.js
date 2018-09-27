"use strict";

require('./console');
const config = require('./config');
const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer);
const MongoClient = require('mongodb').MongoClient;
const LDAPConnection = require('./LDAPConnection');
const ClientBroker = require('./ClientBroker');
const configureController = require('./controller/index');
const utils = require('./utils');


if (utils.isAppInDevelopmentMode())
    console.warn('launching in development/debug mode');

MongoClient.connect(config.db.url).then(client => {
    console.info('mongodb connected');
    const db = client.db(config.db.name);
    const controller = configureController(db);
    const broker = new ClientBroker(io, controller);
}, reason => {
    console.error(reason);
    process.exit();
});


httpServer.listen(4898, () => {
    console.info('http server listening on port 4898');
});

