const electron = require('electron');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const setupIpc = require('./ipc');
const serve = require('electron-serve');
const setupGlobalShortcut = require('./globalShortcut');
const WindowManager = require('./WindowManager');
const defaults = require('./defaults');


let loadUrl;
let mainWindow;

electron.app.commandLine.appendSwitch("ignore-certificate-errors");

if (!isDev)
    loadUrl = serve({directory: 'app'});


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
    mainWindow.setMenu(null);
    const windowManager = new WindowManager(mainWindow);
    setupIpc(mainWindow, windowManager);
    setupGlobalShortcut(mainWindow);

    if (isDev)
        mainWindow.loadURL('https://localhost:3000/');
    else
        loadUrl(mainWindow);

    mainWindow.on('closed', () => mainWindow = null);

    if (isDev)
        mainWindow.webContents.openDevTools({mode: 'detach'});
}


electron.app.on('ready', createWindow);


electron.app.on('window-all-closed', () => {
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
