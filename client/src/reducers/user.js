import { combineReducers } from 'redux';
import * as eventsActionTypes from '../actiontypes/events';
import * as userActionTypes from '../actiontypes/user';
import * as utils from '../utils'; // extra-code for surveys


/**
 * Enum for login states
 * @enum {number}
 * @property {number} LOGGED_OUT indicates that no one is logged in
 * @property {number} PENDING indicates that login is pending
 * @property {number} FAILED indicates that a login attempt failed
 * @property {number} LOGGED_IN indicates that a user is logged in
 */
export const LoginStateEnum = Object.freeze({
    LOGGED_OUT: 0,
    PENDING: 1,
    FAILED: 2,
    LOGGED_IN: 3,
});


/**
 * Shape of user reducers state.
 * Default values are the initial state.
 * @typedef {object} UserState
 * @property {boolean} [acceptedTos=false] indicates if logged in user has accepted terms of service
 * @property {(string|null)} [id=null] logged in users id
 * @property {(string|null)} [lastActiveEventId] id of last active event (on auth), null if no event was reported last active
 * @property {LoginStateEnum} [loginState=LoginStateEnum.LOGGED_OUT] indicates login-state
 * @property {(string|null)} [name=null] logged in users name
 * @property {object} [notifications={emailNotifications: [], inAppNotifications: []}] object containing activated notification types (emailNotifications, inAppNotifications)
 * @property {(string|null)} [sessionToken=null] on login received sessionToken
 */
const initialState = {
    acceptedTos: false,
    extSurveys: [], // extra-code for surveys
    id: null,
    lastActiveEventId: null,
    loginState: LoginStateEnum.LOGGED_OUT,
    name: null,
    notifications: {
        emailNotifications: [],
        inAppNotifications: [],
    },
    sessionToken: null,
};


const acceptedTos = (state = initialState.acceptedTos, action) => {
    switch (action.type) {
        case userActionTypes.CONTINUE_SESSION_SUCCESS:
        case userActionTypes.LOGIN_SUCCESS:
            return action.result.hasAcceptedTos;
        case userActionTypes.ACCEPT_TOS_SUCCESS:
            return true;
        case userActionTypes.CONTINUE_SESSION_FAILURE:
        case userActionTypes.LOGOUT_SUCCESS:
            return initialState.acceptedTos;
        default:
            return state;
    }
};


// extra-code for surveys
const extSurveys = (state = initialState.extSurveys, action) => {
    switch (action.type) {
        case userActionTypes.CONTINUE_SESSION_SUCCESS:
        case userActionTypes.LOGIN_SUCCESS:
            return action.result.extSurveys || [];
        case userActionTypes.ADD_EXT_SURVEY_ID_DONE_SUCCESS:
            return utils.uniqueArray([...state, action.extSurveyId]);
        case userActionTypes.CONTINUE_SESSION_FAILURE:
        case userActionTypes.LOGOUT_SUCCESS:
            return initialState.extSurveys;
        default:
            return state;
    }
};


const id = (state = initialState.id, action) => {
    switch (action.type) {
        case userActionTypes.CONTINUE_SESSION_SUCCESS:
        case userActionTypes.LOGIN_SUCCESS:
            return action.result.id;
        case userActionTypes.CONTINUE_SESSION_FAILURE:
        case userActionTypes.LOGOUT_SUCCESS:
            return initialState.id;
        default:
            return state;
    }
};


const lastActiveEventId = (state = initialState.lastActiveEventId, action) => {
    switch (action.type) {
        case userActionTypes.CONTINUE_SESSION_SUCCESS:
        case userActionTypes.LOGIN_SUCCESS:
            return action.result.lastActiveEventId;
        case eventsActionTypes.JOIN_EVENT_REQUEST:
        case eventsActionTypes.LEAVE_EVENT_REQUEST:
        case eventsActionTypes.SWITCH_ACTIVE_EVENT_REQUEST:
            return null;
        case userActionTypes.CONTINUE_SESSION_FAILURE:
        case userActionTypes.LOGIN_REQUEST:
        case userActionTypes.LOGOUT_SUCCESS:
            return initialState.lastActiveEventId;
        default:
            return state;
    }
};


const loginState = (state = initialState.loginState, action) => {
    switch (action.type) {
        // changing to Pending when trying continue session causes remount
        // => important to announce subscriptions, etc again after reconnect
        case userActionTypes.CONTINUE_SESSION_REQUEST: 
        case userActionTypes.LOGIN_REQUEST:
            return LoginStateEnum.PENDING;
        case userActionTypes.LOGIN_FAILURE:
            return LoginStateEnum.FAILED;
        case userActionTypes.CONTINUE_SESSION_SUCCESS:
        case userActionTypes.LOGIN_SUCCESS:
            return LoginStateEnum.LOGGED_IN;
        // TODO case userActionTypes.LOGIN_FAILURE:
        case userActionTypes.LOGOUT_REQUEST:
        case userActionTypes.CONTINUE_SESSION_FAILURE:
        case userActionTypes.LOGOUT_SUCCESS:
            return initialState.loginState;
        default:
            return state;
    }
};


const name = (state = initialState.name, action) => {
    switch (action.type) {
        case userActionTypes.CONTINUE_SESSION_SUCCESS:
        case userActionTypes.LOGIN_SUCCESS:
            return action.result.name;
        case userActionTypes.CONTINUE_SESSION_FAILURE:
        case userActionTypes.LOGOUT_SUCCESS:
            return initialState.name;
        default:
            return state;
    }
};


const notifications = (state = initialState.notifications, action) => {
    switch (action.type) {
        case userActionTypes.CHANGE_ACTIVE_NOTIFICATION_TYPES_SUCCESS:
            return {
                emailNotifications: action.emailNotifications,
                inAppNotifications: action.inAppNotifications,
            };
        case userActionTypes.GET_ACTIVE_NOTIFICATION_TYPES_SUCCESS:
            return action.result;
        case userActionTypes.CONTINUE_SESSION_FAILURE:
        case userActionTypes.LOGOUT_SUCCESS:
            return initialState.notifications;
        default:
            return state;
    }
};


const sessionToken = (state = initialState.sessionToken, action) => {
    switch (action.type) {
        case userActionTypes.LOGIN_FAILURE:
            return null;
        case userActionTypes.CONTINUE_SESSION_SUCCESS:
        case userActionTypes.LOGIN_SUCCESS:
            return action.result.sessionToken;
        // needed to prevent automatic session continue after logout action
        case userActionTypes.LOGOUT_REQUEST:
        case userActionTypes.CONTINUE_SESSION_FAILURE:
        case userActionTypes.LOGOUT_SUCCESS:
            return initialState.sessionToken;
        default:
            return state;
    }
};


/**
 * user-reducer
 * @function
 * @param {UserState} state
 * @param {object} action
 */
export const user = combineReducers({
    acceptedTos,
    extSurveys, // extra-code for surveys
    id,
    lastActiveEventId,
    loginState,
    name,
    notifications,
    sessionToken,
});

// selectors

/**
 * Selector to select last active eventId (on auth) from user-state.
 * @function
 * @param {UserState} state user-state
 * @returns {(string|null)} last active eventId (on auth)
 */
export const getLastActiveEventId = (state) =>
    state.lastActiveEventId;


/**
 * Selector to select current login state from user-state.
 * @function
 * @param {UserState} state user-state
 * @returns {LoginStateEnum} current login state
 */
export const getLoginState = (state) =>
    state.loginState;


/**
 * Selector to select active notification types from user-state.
 * @function
 * @param {UserState} state user-state
 * @returns {object} object containing activated notification types (emailNotifications, inAppNotifications)
 */
export const getActiveNotificationTypes = (state) =>
    state.notifications;

    
/**
 * Selector to select user id from user-state.
 * @function
 * @param {UserState} state user-state
 * @returns {(string|null)} user id, null if no user is logged in
 */
export const getUserId = (state) =>
    state.id;


/**
 * Selector to select user name from user-state.
 * @function
 * @param {UserState} state user-state
 * @returns {(string|null)} user name, null if no user is logged in
 */
export const getUserName = (state) =>
    state.name;


/**
 * Selector to select sessionToken from user-state.
 * @function
 * @param {UserState} state user-state
 * @returns {(string|null)} sessionToken, null if user is not logged in
 */
export const getSessionToken = (state) => 
    state.sessionToken;


/**
 * Selector to retrieve state whether user accepted terms of service from user-state.
 * @function
 * @param {UserState} state user-state
 * @returns {boolean} indicates if user has accepted terms of service
 */
export const hasAcceptedTos = (state) =>
    state.acceptedTos;
