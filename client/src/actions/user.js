import * as userActionTypes from '../actiontypes/user';


/**
 * Creates action for accepting terms of service.
 * @function
 * @returns {object} action
 */
export function acceptTos() {
    return ({
        type: 'apiCall',
        apiCall: {
            key: 'acceptTos',
            types: [userActionTypes.ACCEPT_TOS_REQUEST, 
                userActionTypes.ACCEPT_TOS_SUCCESS, 
                userActionTypes.ACCEPT_TOS_FAILURE],
            call: (api) => api.request('user/acceptTos')
        }
    });
}


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
            call: (api) => api.request('user/continueSession', { sessionToken })
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
            call: (api) => api.request('user/login', { email, password })
        }
    });
}


/**
 * Creates action for logging out.
 * @function
 * @returns {object} action
 */
export function logout() {
    return ({
        type: 'apiCall',
        apiCall: {
            key: 'logout',
            types: [userActionTypes.LOGOUT_REQUEST, 
                userActionTypes.LOGOUT_SUCCESS, 
                userActionTypes.LOGOUT_FAILURE],
            call: (api) => api.request('user/logout')
        }
    });
}
