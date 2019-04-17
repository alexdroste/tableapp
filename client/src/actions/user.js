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

// extra-code for surveys
export function addExtSurveyIdDone(extSurveyId) {
    return ({
        type: 'apiCall',
        apiCall: {
            key: 'addExtSurveyIdDone',
            types: [userActionTypes.ADD_EXT_SURVEY_ID_DONE_REQUEST, 
                userActionTypes.ADD_EXT_SURVEY_ID_DONE_SUCCESS, 
                userActionTypes.ADD_EXT_SURVEY_ID_DONE_FAILURE],
            call: (api) => api.request('user/addExtSurveyIdDone', { extSurveyId })
        },
        extSurveyId,
    });
}


/**
 * Creates action for changing the active notifications types for authenticated user.
 * @function
 * @param {Array<NotificationTypesEnum>} emailNotifications array of activated email notification types
 * @param {Array<NotificationTypesEnum>} inAppNotifications array of activated in-app notification types
 * @returns {object} action
 */
export function changeActiveNotificationTypes(emailNotifications, inAppNotifications) {
    return ({
        type: 'apiCall',
        apiCall: {
            key: 'getActiveNotificationTypes',
            types: [userActionTypes.CHANGE_ACTIVE_NOTIFICATION_TYPES_REQUEST, 
                userActionTypes.CHANGE_ACTIVE_NOTIFICATION_TYPES_SUCCESS, 
                userActionTypes.CHANGE_ACTIVE_NOTIFICATION_TYPES_FAILURE],
            call: (api) => api.request('user/changeActiveNotificationTypes', { emailNotifications, inAppNotifications })
        },
        emailNotifications,
        inAppNotifications,
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
 * Creates action for retrieving the active notifications types for authenticated user.
 * @function
 * @returns {object} action
 */
export function getActiveNotificationTypes() {
    return ({
        type: 'apiCall',
        apiCall: {
            key: 'getActiveNotificationTypes',
            types: [userActionTypes.GET_ACTIVE_NOTIFICATION_TYPES_REQUEST, 
                userActionTypes.GET_ACTIVE_NOTIFICATION_TYPES_SUCCESS, 
                userActionTypes.GET_ACTIVE_NOTIFICATION_TYPES_FAILURE],
            call: (api) => api.request('user/getActiveNotificationTypes')
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
