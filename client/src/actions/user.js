import * as userActionTypes from '../actiontypes/user';
import * as userApiMethods from '../api/actions/user';


/**
 * Creates action for continuing a session.
 * @function
 * @param {string} sessionToken sessionToken
 * @returns {object} action
 */
export function continueSession(sessionToken) {
    return ({
        type: 'apiCall',
        apiCall: {
            key: 'login',
            types: [userActionTypes.CONTINUE_SESSION_REQUEST, 
                userActionTypes.CONTINUE_SESSION_SUCCESS, 
                userActionTypes.CONTINUE_SESSION_FAILURE],
            call: (api) => userApiMethods.continueSession(api, sessionToken)
        }
    });
}


/**
 * Creates action for logging in.
 * @function
 * @param {string} email email of user
 * @param {string} password password of user
 * @returns {object} action
 */
export function login(email, password) {
    return ({
        type: 'apiCall',
        apiCall: {
            key: 'login',
            types: [userActionTypes.LOGIN_REQUEST, 
                userActionTypes.LOGIN_SUCCESS, 
                userActionTypes.LOGIN_FAILURE],
            call: (api) => userApiMethods.login(api, email, password)
        }
    });
}
