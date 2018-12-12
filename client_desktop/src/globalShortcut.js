const electron = require('electron')
const log = require('./log');


/**
 * Setup global-shortcut module for specified browserWindow.
 * @name setupGlobalShortcut
 * @function
 * @param {BrowserWindow} browserWindow 
 */
module.exports = (browserWindow) => {
    electron.globalShortcut.register('Alt+S', () => {
        browserWindow.webContents.send('toggleMiniControlView');
    });

    electron.globalShortcut.register('F8', () => {
        browserWindow.webContents.send('toggleMiniControlView');
    });

    electron.globalShortcut.register('F6', () => {
        log.info('MARK - set by user pressing F6');
    });
};