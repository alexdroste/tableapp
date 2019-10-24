const electron = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const setupIpc = require('./ipc');
const setupGlobalShortcut = require('./globalShortcut');
const WindowManager = require('./WindowManager');
const config = require('./config');
const defaults = require('./defaults');
const log = require('./log');

log.info("App started");

let mainWindow;
const appURL = isDev ? 'https://localhost:3000/' : config.deploymentURL;

electron.app.commandLine.appendSwitch("ignore-certificate-errors");


// TODO only hide window on close to keep app running in bg (on osx only)
/**
 * Create main window and fully initialize context.
 * Includes preloading state and setting up ipc.
 * @function
 */
function createWindow() {
    const { width, height, minWidth, minHeight } = defaults.windowSize.normalView;
    mainWindow = new electron.BrowserWindow({ 
        width, 
        height,
        minWidth,
        minHeight,
        minimizable: false,
        maximizable: false,
        frame: false,
        transparent: false,
        // titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js'),
        }
    });
    // mainWindow.setBounds2 = mainWindow.setBounds;
    // mainWindow.setBounds = (args) => {
    //     console.dir(args);
    //     mainWindow.setBounds2(args);
    // };
    // mainWindow.setMenu(null);
    mainWindow.removeMenu();
    const windowManager = new WindowManager(mainWindow);
    setupIpc(mainWindow, windowManager);
    setupGlobalShortcut(mainWindow);

    mainWindow.webContents.on("did-fail-load", function() {
        const btn = electron.dialog.showMessageBox(mainWindow, {
            type: 'error',
            buttons: ['Erneut Versuchen', 'App beenden'],
            defaultId: 0,
            title: 'Server nicht erreichbar',
            message: 'Server nicht erreichbar unter:\n' + appURL + '\nEventuell funktioniert die Internetverbindung nicht.'
        });
        if (btn == 0) {
            mainWindow.loadURL(appURL);
        } else {
            electron.app.quit();
        }
    });

    mainWindow.loadURL(appURL);

    mainWindow.on('closed', () => mainWindow = null);

    if (isDev)
        mainWindow.webContents.openDevTools({mode: 'detach'});
}


electron.app.on('ready', createWindow);


electron.app.on('window-all-closed', () => {
    log.info("App closed");
    electron.app.quit();
    // if (process.platform !== 'darwin') {
    //     app.quit();
    // }
});


electron.app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
