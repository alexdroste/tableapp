const { globalShortcut } = require('electron')


/**
 * Setup global-shortcut module for specified browserWindow.
 * @name setupGlobalShortcut
 * @function
 * @param {BrowserWindow} browserWindow 
 */
module.exports = (browserWindow) => {
    globalShortcut.register('Alt+S', () => {
        browserWindow.webContents.send('toggleMiniControlView');
    });

    globalShortcut.register('F8', () => {
        browserWindow.webContents.send('toggleMiniControlView');
    });
};