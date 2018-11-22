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
    const screen = electron.screen; // https://github.com/electron/electron/issues/5897

    let isMiniControlViewActive = false;
    let normalViewBounds = null;
    let miniControlViewBounds = null;

    ipc.on('setMiniControlViewActive', (event, active) => {
        if (active === isMiniControlViewActive)
            return; // no change => do nothing
        isMiniControlViewActive = active;

        let curBounds = browserWindow.getBounds();
        let curScreen = screen.getDisplayNearestPoint({x: curBounds.x, y: curBounds.y});
        let nextBounds = null;
        
        if (active) { // init mini-control-view
            normalViewBounds = curBounds;
            if (miniControlViewBounds)
                nextBounds = miniControlViewBounds;
            else
                nextBounds = { x: curBounds.x, y: curBounds.y, width: 140, height: 160 };
        } else { // return to normal/full - view
            miniControlViewBounds = curBounds;
            nextBounds = normalViewBounds;
        }

        let nextScreen = screen.getDisplayNearestPoint({x: nextBounds.x, y: nextBounds.y});
        if (curScreen.id === nextScreen.id)
            browserWindow.setBounds(nextBounds);
        else
            browserWindow.setSize(nextBounds.width, nextBounds.height);

        curBounds = browserWindow.getBounds();
        let newX = curBounds.x;
        let newY = curBounds.y;
        // ensure window is in screens bounds
        if (curBounds.x < curScreen.bounds.x) // left
            newX = curScreen.bounds.x;
        if (curBounds.y < curScreen.bounds.y) // top
            newY = curScreen.bounds.y;
        if (curBounds.x + curBounds.width > curScreen.bounds.x + curScreen.bounds.width) // right
            newX = curScreen.bounds.x + curScreen.bounds.width - curBounds.width;
        if (curBounds.y + curBounds.height > curScreen.bounds.y + curScreen.bounds.height) // bottom
            newY = curScreen.bounds.y + curScreen.bounds.height - curBounds.height;

        browserWindow.setPosition(newX, newY);

        // TODO check window fits screen size
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
