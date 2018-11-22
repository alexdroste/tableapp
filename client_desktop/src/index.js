const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const setupIpc = require('./ipc');
const serve = require('electron-serve');


let loadUrl;
let ipc;
let mainWindow;

app.commandLine.appendSwitch("ignore-certificate-errors");

if (!isDev)
    loadUrl = serve({directory: 'app'});


// TODO only hide window on close to keep app running in bg (on osx only)
/**
 * Create main window and fully initialize context.
 * Includes preloading state and setting up ipc.
 * @function
 */
function createWindow() {
    mainWindow = new BrowserWindow({ 
        width: 900, 
        height: 680,
        minWidth: 550, // TODO put default in an external file
        minHeight: 350,
        frame: false,
        transparent: false,
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    mainWindow.setMenu(null);
    ipc = setupIpc(mainWindow);

    if (isDev)
        mainWindow.loadURL('https://localhost:3000/');
    else
        loadUrl(mainWindow);

    mainWindow.on('closed', () => mainWindow = null);

    if (isDev)
        mainWindow.webContents.openDevTools({mode: 'detach'});
}


app.on('ready', createWindow);


app.on('window-all-closed', () => {
    app.quit();
    // if (process.platform !== 'darwin') {
    //     app.quit();
    // }
});


app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
