import { combineReducers } from 'redux';
import * as eventsActionTypes from '../actiontypes/events';
import * as eventScreenshotsActionTypes from '../actiontypes/eventScreenshots';
import * as userActionTypes from '../actiontypes/user';


/**
 * Shape of eventScreenshots reducers state.
 * Default values are the initial state.
 * @typedef {object} EventScreenshotsState
 * @property {Array<string>} [ids=[]] list of (image-)ids of screenshots
 */
const initialState = {
    ids: [],
};


const ids = (state = initialState.ids, action) => {
    switch (action.type) {
        case eventScreenshotsActionTypes.UPDATE_SCREENSHOT_IDS:
            return action.ids;
        // reset
        case eventsActionTypes.SWITCH_ACTIVE_EVENT_REQUEST:
        case userActionTypes.CONTINUE_SESSION_REQUEST:
        case userActionTypes.LOGIN_REQUEST:
        case userActionTypes.LOGOUT_SUCCESS:
            return initialState.ids;
        default:
            return state;
    }
};


/**
 * eventScreenshots-reducer
 * @function
 * @param {EventScreenshotsState} state
 * @param {object} action
 */
export const eventScreenshots = combineReducers({
    ids,
});


// selectors

/**
 * Selector to retrieve ids of screenshots from eventScreenshots-state.
 * @function
 * @param {EventScreenshotsState} state eventScreenshots-state
 * @returns {Array<string>} list of (image-)ids of screenshots (from event)
 */
export const getScreenshotIds = (state) =>
    state.ids;

