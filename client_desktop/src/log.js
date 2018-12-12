const log = require('electron-log');
log.transports.file.level = 'debug';

process.on('uncaughtException', (err) => {
    log.error(err);
    alert("An Error occurred, please contact the Developer.")
});


process.on('unhandledRejection', function (reason, promise) {
    log.error('Unhandled rejection', {reason: reason, promise: promise});
    alert("An Error occurred, please contact the Developer.")
});


module.exports = log;