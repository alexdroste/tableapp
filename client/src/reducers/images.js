import { combineReducers } from 'redux';
import * as eventsActionTypes from '../actiontypes/events';
import * as imagesActionTypes from '../actiontypes/images';
import * as userActionTypes from '../actiontypes/user';
import * as utils from '../utils';


/**
 * Dictionary of images.
 * 
 * dict[key] = value:
 * * key := id of image 
 * * value := image-data (base64)
 * @typedef {object} ImageDict
 */


/**
 * Dictionary of thumbnails.
 * 
 * dict[key] = value:
 * * key := id of image 
 * * value := thumbnail-data (base64)
 * @typedef {object} ThumbnailDict
 */


/**
 * Shape of images reducers state.
 * Default values are the initial state.
 * @typedef {object} ImagesState
 * @property {ImageDict} [imageDict={}]
 * @property {ThumbnailDict} [thumbnailDict={}]
 */
const initialState = {
    imageDict: {},
    thumbnailDict: {},
};


const imageDict = (state = initialState.imageDict, action) => {
    switch (action.type) {
        case imagesActionTypes.ADD_LOCAL_IMAGE: {
            const nextState = { ...state };
            nextState[action.id] = action.imageData;
            return nextState;
        }
        case imagesActionTypes.LOAD_IMAGES_SUCCESS:
            return {
                ...state,
                ...action.result.imageDict,
            };
        case imagesActionTypes.REMOVE_IMAGES: {
            const nextState = { ...state };
            action.imageIds.forEach((id) => {
                delete nextState[id];
            });
            return nextState;
        }
        // reset
        case eventsActionTypes.SWITCH_ACTIVE_EVENT_REQUEST:
        case userActionTypes.CONTINUE_SESSION_REQUEST:
        case userActionTypes.LOGIN_REQUEST:
        case userActionTypes.LOGOUT_SUCCESS:
            return initialState.imageDict;
        default:
            return state;
    }
};


const thumbnailDict = (state = initialState.thumbnailDict, action) => {
    switch (action.type) {
        case imagesActionTypes.ADD_LOCAL_IMAGE: {
            const nextState = { ...state };
            nextState[action.id] = action.thumbnailData;
            return nextState;
        }
        case imagesActionTypes.LOAD_IMAGES_SUCCESS:
            return {
                ...state,
                ...action.result.thumbnailDict,
            };
        case imagesActionTypes.REMOVE_IMAGES: {
            const nextState = { ...state };
            action.imageIds.forEach((id) => {
                delete nextState[id];
            });
            return nextState;
        }
        // reset
        case eventsActionTypes.SWITCH_ACTIVE_EVENT_REQUEST:
        case userActionTypes.CONTINUE_SESSION_REQUEST:
        case userActionTypes.LOGIN_REQUEST:
        case userActionTypes.LOGOUT_SUCCESS:
            return initialState.thumbnailDict;
        default:
            return state;
    }
};


/**
 * images-reducer
 * @function
 * @param {ImagesState} state
 * @param {object} action
 */
export const images = combineReducers({
    imageDict,
    thumbnailDict,
});


// helpers

/**
 * Generates a new local image id (uuid).
 * @function
 * @returns {string} local image id
 */
export const generateLocalImageId = () =>
    "local-" + utils.generateUUID();


// selectors

/**
 * Selector to retrieve image data for a specific imageId from images-state.
 * @function
 * @param {ImagesState} state images-state
 * @param {string} imageId id of image
 * @returns {(string|null)} image-data (base64), null if image-data is not (locally) available
 */
export const getImage = (state, imageId) =>
    state.imageDict[imageId] || null;


/**
 * Selector to retrieve thumbnail data for a specific imageId from images-state.
 * @function
 * @param {ImagesState} state images-state
 * @param {string} imageId id of image
 * @returns {(string|null)} thumbnail-data (base64), null if thumbnail-data is not (locally) available
 */
export const getThumbnail = (state, imageId) =>
    state.thumbnailDict[imageId] || null;


/**
 * Selector to retrieve whole thumbnail dictionary from images-state.
 * @function
 * @param {ImagesState} state images-state
 * @returns {ThumbnailDict} dictionary of thumbnails
 */
export const getThumbnailDict = (state) => 
    state.thumbnailDict;



