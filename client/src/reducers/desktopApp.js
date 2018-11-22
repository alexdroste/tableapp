import { combineReducers } from 'redux';
import * as desktopAppActionTypes from '../actiontypes/desktopApp';


/**
 * Shape of desktopApp reducers state.
 * Default values are the initial state.
 * @typedef {object} DesktopAppState
 * @property {boolean} [app=false] indicates if client runs inside electron context (enables desktop-App features)
 * @property {boolean} [broadcastActive=false] indicates if screenshot broadcasting is active
 * @property {string} [lastBroadcastedImage=null] base64 image-data of last broadcasted image
 * @property {boolean} [presentationmodeActive=false] indicates if client is in presentation-mode
 * @property {boolean} [windowAlwaysOnTop=false] indicates if app-window is always on top of other windows
 */
const initialState = {
    app: false,
    broadcastActive: false,
    lastBroadcastedImage: null,
    presentationmodeActive: false,
    windowAlwaysOnTop: false,
};


const app = (state = initialState.app, action) => {
    switch (action.type) {
        case desktopAppActionTypes.INIT_DESKTOP_APP:
            return true;
        default:
            return state;
    }
};


const broadcastActive = (state = initialState.broadcastActive, action) => {
    switch (action.type) {
        case desktopAppActionTypes.BROADCAST_CANCELLED:
            return false;
        case desktopAppActionTypes.SET_BROADCAST_ACTIVE:
            return action.active;
        default:
            return state;
    }
};


const lastBroadcastedImage = (state = initialState.lastBroadcastedImage, action) => {
    switch (action.type) {
        case desktopAppActionTypes.BROADCAST_NEW_IMAGE_REQUEST:
            return action.imageData;
        default:
            return state;
    }
};


const presentationmodeActive = (state = initialState.presentationmodeActive, action) => {
    switch (action.type) {
        case desktopAppActionTypes.SET_PRESENTATION_MODE_ACTIVE:
            return action.active;
        default:
            return state;
    }
};


const windowAlwaysOnTop = (state = initialState.windowAlwaysOnTop, action) => {
    switch (action.type) {
        case desktopAppActionTypes.SET_WINDOW_ALWAYS_ON_TOP:
            return action.alwaysOnTop;
        default:
            return state;
    }
};


/**
 * desktopApp-reducer
 * @function
 * @param {DesktopAppState} state
 * @param {object} action
 */
export const desktopApp = combineReducers({
    app,
    broadcastActive,
    lastBroadcastedImage,
    presentationmodeActive,
    windowAlwaysOnTop,
});


// selectors
/**
 * Selector to retrieve last broadcasted image from desktopApp-state.
 * @function
 * @param {DesktopAppState} state desktopApp-state
 * @returns {string} base64 image-data
 */
export const getLastBroadcastedImage = (state) =>
    state.lastBroadcastedImage;


/**
 * Selector to select state if screenshot broadcasting is active from desktopApp-state.
 * @function
 * @param {DesktopAppState} state desktopApp-state
 * @returns {boolean} indicates if screenshot broadcasting is active
 */
export const isBroadcastActive = (state) =>
    state.broadcastActive;


/**
 * Selector to select state if client runs inside electron context from desktopApp-state.
 * @function
 * @param {DesktopAppState} state desktopApp-state
 * @returns {boolean} indicates if client runs inside electron context
 */
export const isDesktopApp = (state) =>
    state.app;


/**
 * Selector to select state if presentationmode is active from desktopApp-state.
 * @function
 * @param {DesktopAppState} state desktopApp-state
 * @returns {boolean} indicates if app is in presentation-mode 
 */
export const isPresentationmodeActive = (state) =>
    state.presentationmodeActive;


/**
 * Selector to select state if window is always on top from desktopApp-state.
 * @function
 * @param {DesktopAppState} state desktopApp-state
 * @returns {boolean} indicates if app-window is always on top of other windows
 */
export const isWindowAlwaysOnTop = (state) =>
    state.windowAlwaysOnTop;

