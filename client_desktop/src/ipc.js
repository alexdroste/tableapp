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
        let nextBounds = null;
        const curScreen = screen.getDisplayNearestPoint({x: curBounds.x, y: curBounds.y});
        let newMinimumSize = null;
        
        if (active) { // init mini-control-view
            browserWindow.setOpacity(.85);
            newMinimumSize = { width: 140, height: 140 };
            normalViewBounds = curBounds;
            if (miniControlViewBounds)
                nextBounds = miniControlViewBounds;
            else
                nextBounds = { x: curBounds.x, y: curBounds.y, width: 140, height: 140 };
        } else { // return to normal/full - view
            browserWindow.setOpacity(1);
            newMinimumSize = { width: 550, height: 350 }; // TODO put default in an external file
            miniControlViewBounds = curBounds;
            nextBounds = normalViewBounds;
        }

        const nextScreen = screen.getDisplayNearestPoint({x: nextBounds.x, y: nextBounds.y});
        // check if nextScreen is curScreen
        // ignore x/y values if nextScreen differs from curScreen
        if (curScreen.id !== nextScreen.id) {
            nextBounds.x = curBounds.x;
            nextBounds.y = curBounds.y;
        }

        // ensure window is in screens bounds
        // left + top check should have priority before right + bottom
        if (nextBounds.x + nextBounds.width > curScreen.bounds.x + curScreen.bounds.width) // right
            nextBounds.x = curScreen.bounds.x + curScreen.bounds.width - nextBounds.width;
        if (nextBounds.y + nextBounds.height > curScreen.bounds.y + curScreen.bounds.height) // bottom
            nextBounds.y = curScreen.bounds.y + curScreen.bounds.height - nextBounds.height;
        if (nextBounds.x < curScreen.bounds.x) // left
            nextBounds.x = curScreen.bounds.x;
        if (nextBounds.y < curScreen.bounds.y) // top
            nextBounds.y = curScreen.bounds.y;

        // ensure window fits screen size
        if (nextBounds.width > curScreen.width)
            nextBounds.width = curScreen.width;
        if (nextBounds.height > curScreen.height)
            nextBounds.height = curScreen.height;

        browserWindow.setMinimumSize(newMinimumSize.width, newMinimumSize.height);
        browserWindow.setBounds(nextBounds);
    });


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
