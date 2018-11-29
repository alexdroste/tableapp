import * as desktopAppActionTypes from '../actiontypes/desktopApp';
import { isMiniControlViewActive, isPresentationmodeActive } from '../reducers/desktopApp';


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
        imageData
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
 * Creates action for going to/exiting the mini-control-view (controls window size/position).
 * Only dispatches is presentation-mode is active.
 * @function
 * @param {boolean} active indicates if mini-control-view should be active
 * @returns {object} action
 */
export function setMiniControlViewActive(active) {
    return (dispatch, getState) => {
        if (!isPresentationmodeActive(getState().desktopApp))
            return;
        dispatch({
            type: desktopAppActionTypes.SET_MINI_CONTROL_VIEW_ACTIVE,
            ipcCall: (ipc) => ipc.sendMessage('setMiniControlViewActive', active),
            active,
        });
    };
}


// /**
//  * Creates action for resizing the app-window to the last saved size.
//  * @function
//  * @returns {object} action
//  */
// export function restoreLastWindowSize() {
//     return {
//         type: desktopAppActionTypes.RESTORE_LAST_WINDOW_SIZE,
//         ipcCall: (ipc) => ipc.sendMessage('restoreLastWindowSize'),
//     };
// }


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
        ipcCall: (ipc) => ipc.sendMessage('setWindowAlwaysOnTop', alwaysOnTop),
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


/**
 * Creates action for toggling mini-control-view active state.
 * @function
 * @returns {object} action
 */
export function toggleMiniControlView() {
    return (dispatch, getState) => {
        dispatch(setMiniControlViewActive(!isMiniControlViewActive(getState().desktopApp)));
    };
}
