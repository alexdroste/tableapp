"use strict";

require('./console');
const broker = require('./broker');
const config = require('./config');
const fs = require('fs');
const path = require('path');
const db = require('./db'); 
const utils = require('./utils');


if (utils.isAppInDevelopmentMode())
    console.warn('launching in development/debug mode');


db.connect().catch(reason => {
    console.error(reason);
    process.exit();
});


const httpsServer = require('https').createServer({
    cert: fs.readFileSync(path.resolve(config.ssl.certPath)),
    key: fs.readFileSync(path.resolve(config.ssl.keyPath)),
});
const io = require('socket.io')(httpsServer);

// setup connection handler of (client-)broker
io.on('connection', (socket) => broker.handleConnection(socket));


httpsServer.listen(4898, () => {
    console.info('http server listening on port 4898');
});

