const electron = require('electron');


/**
 * Setup ipc module for specified browserWindow.
 * @name setupIpc
 * @function
 * @param {BrowserWindow} browserWindow 
 * @param {WindowManager} windowManager WindowManager for given browserWindow
 */
module.exports = (browserWindow, windowManager) => {
    electron.ipcMain.on('setMiniControlViewActive', (event, active) => {
        windowManager.setMiniControlViewActive(active);
    });


    electron.ipcMain.on('setWindowAlwaysOnTop', (event, alwaysOnTop) => {
        windowManager.setAlwaysOnTop(alwaysOnTop);
    });
}
