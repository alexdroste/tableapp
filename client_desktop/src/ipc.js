const electron = require('electron');
const app = electron.app;
const dialog = electron.dialog;
const ipc = electron.ipcMain;
const Broadcast = require('./Broadcast');


/**
 * Setup ipc module for specified browserWindow.
 * @name setupIpc
 * @function
 * @param {BrowserWindow} browserWindow 
 */
module.exports = (browserWindow) => {

    let broadcast = null;
    let lastBounds = null;

    ipc.on('resizeWindow', (event, { width, height }) => {
        lastBounds = browserWindow.getBounds();
        browserWindow.setSize(width, height);
    });


    ipc.on('restoreLastWindowSize', (event, data) => {
        browserWindow.setSize(lastBounds.width, lastBounds.height);
    });


    ipc.on('setWindowAlwaysOnTop', (event, alwaysOnTop) => {
        if (alwaysOnTop) {
            app.dock.hide();
            browserWindow.setAlwaysOnTop(true, 'floating');
            browserWindow.setVisibleOnAllWorkspaces(true);
            browserWindow.setFullScreenable(false);
            app.dock.show();
        } else {
            browserWindow.setAlwaysOnTop(false, 'normal');
            browserWindow.setVisibleOnAllWorkspaces(false);
            browserWindow.setFullScreenable(true);
        }
    });


    ipc.on('setBroadcastActive', (event, active) => {
        if (!active) {
            broadcast.stop();
            broadcast = null;
            return;
        } else {
            const res = dialog.showMessageBox(null, {
                type: "question",
                buttons: ['Nein', 'Ja'],
                defaultId: 0,
                message: "Möchten Sie zulassen, dass die Table-App ihren Desktop streamt?\n\n"
                    + "Bitte denken Sie daran, private Inhalte zu schließen und ggf. (System-)Benachrichtigungen auszuschalten.",
                cancelId: 0,
            });
            if (res !== 1) {
                event.sender.send('broadcastCancelled');
                return;
            }

            broadcast = new Broadcast();
            broadcast.onNewImage((base64) => {
                // as soon as a new image is available
                // send it via ipc back to client
                event.sender.send('newBroadcastImage', base64);
            });
            broadcast.start();
        }
    });
}
