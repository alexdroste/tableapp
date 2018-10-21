import * as userActionTypes from '../actiontypes/user';


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
 * @property {boolean} [hasAcceptedTos=false] indicates if logged in user has accepted terms of service
 * @property {(string|null)} [id=null] logged in users id
 * @property {LoginStateEnum} [loginState=LoginStateEnum.LOGGED_OUT] indicates login-state
 * @property {(string|null)} [name=null] logged in users name
 * @property {(string|null)} [sessionToken=null] on login received sessionToken
 */
const initialState = {
    hasAcceptedTos: false,
    id: null,
    loginState: LoginStateEnum.LOGGED_OUT,
    name: null,
    sessionToken: null,
}


/**
 * user-reducer
 * @function
 * @param {UserState} state
 * @param {object} action
 */
export const user = (state = initialState, action) => {
    switch (action.type) {
        // changing to Pending when trying continue session causes remount
        // => important to announce subscriptions, etc again after reconnect
        case userActionTypes.CONTINUE_SESSION_REQUEST: 
        case userActionTypes.LOGIN_REQUEST:
            return {
                ...state,
                loginState: LoginStateEnum.PENDING,
            };
        case userActionTypes.CONTINUE_SESSION_FAILURE:
            return {
                ...state,
                loginState: LoginStateEnum.LOGGED_OUT,
                sessionToken: null
            };
        case userActionTypes.LOGIN_FAILURE:
            return {
                ...state,
                loginState: LoginStateEnum.FAILED,
                sessionToken: null,
            };
        case userActionTypes.CONTINUE_SESSION_SUCCESS:
        case userActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                hasAcceptedTos: action.result.hasAcceptedTos,
                id: action.result.id,
                loginState: LoginStateEnum.LOGGED_IN,
                name: action.result.name,
                sessionToken: action.result.sessionToken,
            };
        case userActionTypes.ACCEPT_TOS_SUCCESS:
            return {
                ...state,
                hasAcceptedTos: true,
            };
        case userActionTypes.LOGOUT_SUCCESS:
            return initialState;
        default:
            return state;
    }
};


// selectors

/**
 * Selector to select current login state from user-state.
 * @function
 * @param {UserState} state user-state
 * @returns {LoginStateEnum} current login state
 */
export const getLoginState = (state) =>
    state.loginState;

    
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
    state.hasAcceptedTos;
