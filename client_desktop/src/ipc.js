const electron = require('electron');
const app = electron.app;
const ipc = electron.ipcMain;


/**
 * Setup ipc module for specified browserWindow.
 * @name setupIpc
 * @function
 * @param {BrowserWindow} browserWindow 
 */
module.exports = (browserWindow) => {

    let isMiniControlViewActive = false;
    let normalViewBounds = null;
    let miniControlViewBounds = null;

    ipc.on('setMiniControlViewActive', (event, active) => {
        if (active === isMiniControlViewActive)
            return; // no change => do nothing
        isMiniControlViewActive = active;
        
        if (active) { // init mini-control-view
            normalViewBounds = browserWindow.getBounds();
            if (miniControlViewBounds)
                browserWindow.setSize(miniControlViewBounds.width, miniControlViewBounds.height);
            else
                browserWindow.setSize(140, 160);
        } else { // return to normal/full - view
            miniControlViewBounds = browserWindow.getBounds();
            browserWindow.setSize(normalViewBounds.width, normalViewBounds.height);
        }
    });


    // ipc.on('restoreLastWindowSize', (event, data) => {
    //     browserWindow.setSize(lastBounds.width, lastBounds.height);
    // });


    ipc.on('setWindowAlwaysOnTop', (event, alwaysOnTop) => {
        if (alwaysOnTop) {
            if (app.dock) // macOS
                app.dock.hide();
            browserWindow.setAlwaysOnTop(true, 'floating', 99999);
            browserWindow.setVisibleOnAllWorkspaces(true);
            browserWindow.setFullScreenable(false);
            if (app.dock) // macOS
                app.dock.show();
        } else {
            browserWindow.setAlwaysOnTop(false, 'normal');
            browserWindow.setVisibleOnAllWorkspaces(false);
            browserWindow.setFullScreenable(true);
        }
    });
}
