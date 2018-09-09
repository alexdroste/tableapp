/**
 * IPC-call: resize the app-window.
 * @function
 * @param {IpcHandler} ipc IpcHandler instance 
 * @param {number} width width in px
 * @param {number} height height in px
 */
export function resizeWindow(ipc, width, height) {
    ipc.sendMessage('resizeWindow', { width, height });
}


/**
 * IPC-call: resize the app-window to last saved size.
 * @function
 * @param {IpcHandler} ipc IpcHandler instance 
 */
export function restoreLastWindowSize(ipc) {
    ipc.sendMessage('restoreLastWindowSize');
}


/**
 * IPC-call: set if app-window is always-on-top.
 * @function
 * @param {IpcHandler} ipc IpcHandler instance 
 * @param {boolean} alwaysOnTop indicates if app-window should be always on top of other windows
 */
export function setWindowAlwaysOnTop(ipc, alwaysOnTop) {
    ipc.sendMessage('setWindowAlwaysOnTop', alwaysOnTop);
}


/**
 * IPC-call: set if broadcasting is active.
 * @function
 * @param {IpcHandler} ipc IpcHandler instance 
 * @param {boolean} active indicates if broadcasting should be activated 
 */
export function setBroadcastActive(ipc, active) {
    ipc.sendMessage('setBroadcastActive', active);
}
