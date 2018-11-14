import * as desktopAppActionTypes from '../actiontypes/desktopApp';
import * as ipcActions from '../ipc/actions';


/**
 * Creates action for cancelling a broadcast.
 * @function
 * @returns {object} action
 */
export function broadcastCancelled() {
    return {
        type: desktopAppActionTypes.BROADCAST_CANCELLED,
    };
}


/**
 * Creates action for broadcasting a new image.
 * @function
 * @param {string} imageData base64 image-data of full image
 * @returns {object} action
 */
export function broadcastNewImage(imageData) {
    return ({
        type: 'apiCall',
        apiCall: {
            types: [desktopAppActionTypes.BROADCAST_NEW_IMAGE_REQUEST,
                desktopAppActionTypes.BROADCAST_NEW_IMAGE_SUCCESS,
                desktopAppActionTypes.BROADCAST_NEW_IMAGE_FAILURE],
            call: (api) => api.request('desktopApp/broadcastNewImage', { imageData })
        },
    });
}


/**
 * Creates action for initializing the desktop-app features/environment.
 * @function
 * @returns {object} action
 */
export function initDesktopApp() {
    return {
        type: desktopAppActionTypes.INIT_DESKTOP_APP,
    };
}


/**
 * Creates action for resizing the app-window.
 * @function
 * @param {number} width width in px
 * @param {number} height height in px
 * @returns {object} action
 */
export function resizeWindow(width, height) {
    return {
        type: desktopAppActionTypes.RESIZE_WINDOW,
        ipcCall: (ipc) => ipcActions.resizeWindow(ipc, width, height),
    };
}


/**
 * Creates action for resizing the app-window to the last saved size.
 * @function
 * @returns {object} action
 */
export function restoreLastWindowSize() {
    return {
        type: desktopAppActionTypes.RESTORE_LAST_WINDOW_SIZE,
        ipcCall: (ipc) => ipcActions.restoreLastWindowSize(ipc),
    };
}


/**
 * Creates action for setting presentationmode-active state.
 * @function
 * @param {boolean} active indicates if presentationmode should be activated 
 * @returns {object} action
 */
export function setPresentationmodeActive(active) {
    return {
        type: desktopAppActionTypes.SET_PRESENTATION_MODE_ACTIVE,
        active,
    };
}


/**
 * Creates action for setting always-on-top state.
 * @function
 * @param {boolean} alwaysOnTop indicates if app-window should be always on top of other windows
 * @returns {object} action
 */
export function setWindowAlwaysOnTop(alwaysOnTop) {
    return {
        type: desktopAppActionTypes.SET_WINDOW_ALWAYS_ON_TOP,
        ipcCall: (ipc) => ipcActions.setWindowAlwaysOnTop(ipc, alwaysOnTop),
        alwaysOnTop,
    };
}


/**
 * Creates action for setting broadcast state.
 * @function
 * @param {boolean} active indicates if broadcasting should be activated 
 * @returns {object} action
 */
export function setBroadcastActive(active) {
    return {
        type: desktopAppActionTypes.SET_BROADCAST_ACTIVE,
        active,
    };
}
