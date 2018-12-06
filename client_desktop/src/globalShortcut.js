const electron = require('electron')


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
};