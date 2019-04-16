import { combineReducers } from 'redux';
import * as notificationsActionTypes from '../actiontypes/notifications';
import * as userActionTypes from '../actiontypes/user';


/**
 * A notification object.
 * @typedef {object} Notification
 * @todo document properties
 */


/**
 * Dictionary of notifications.
 * 
 * dict[key] = value:
 * * key := id of notification
 * * value := {@link Notification}
 * @typedef {object} NotificationDict
 */


/**
 * Shape of notifications reducers state.
 * Default values are the initial state.
 * @typedef {object} NotificationsState
 * @property {NotificationDict} [notificationDict={}] dictionary of notifications
 */
const initialState = {
    notificationDict: {},
};


export const notificationDict = (state = initialState.notificationDict, action) => {
    switch (action.type) {
        case notificationsActionTypes.UPDATE_NOTIFICATION_DICT:
            return {
                ...state,
                ...action.notificationDict,
            };
        // reset
        case userActionTypes.CONTINUE_SESSION_REQUEST:
        case userActionTypes.LOGIN_REQUEST:
        case userActionTypes.LOGOUT_SUCCESS:
            return initialState.notificationDict;
        default:
            return state;
    }
};


/**
 * notifications-reducer
 * @function
 * @param {NotificationsState} state
 * @param {object} action
 */
export const notifications = combineReducers({
    notificationDict,
});


// selectors

/**
 * Selector to select notification by id from notifications-state.
 * @function
 * @param {NotificationsState} state notifications-state
 * @param {string} id id of notification
 * @returns {Notification} notification
 */
export const getNotificationById = (state, id) =>
    state.notificationDict[id];


/**
 * Selector to select notification-dict from notifications-state.
 * @function
 * @param {NotificationsState} state notifications-state
 * @returns {NotificationDict} notification dict
 */
export const getNotificationDict = (state) =>
    state.notificationDict;


let notificationIdsSortedCache = {};
/**
 * Selector to retrieve sorted list of notification ids from notifications-state.
 * Sorted by timestamp desc.
 * List gets cached and is only re-generated if notificationDict in state changes.
 * @function
 * @param {NotificationsState} state notifications-state
 * @returns {Array<string>} array of notification ids sorted by timestamp desc
 */
export const getNotificationIdsSorted = (state) => {
    if (notificationIdsSortedCache.list && notificationIdsSortedCache.lastDict === state.notificationDict)
        return notificationIdsSortedCache.list;
    notificationIdsSortedCache.lastDict = state.notificationDict;
    const list = Object.keys(state.notificationDict);
    list.sort((a, b) => state.notificationDict[b].timestamp - state.notificationDict[a].timestamp);
    // works because you can subtract booleans (e.g. "false - true" = -1)
    // list.sort((a, b) => state.notificationDict[a].isRead - state.notificationDict[b].isRead);
    notificationIdsSortedCache.list = list;
    return list;
};


/**
 * Selector to state whether user has unread notifications from notifications-state.
 * @function
 * @param {NotificationsState} state notifications-state
 * @returns {boolean} indicates whether user has unread notifications
 */
export const hasUnreadNotifications = (state) => {
    for (let n in state.notificationDict) {
        if (state.notificationDict.hasOwnProperty(n))
            if (!state.notificationDict[n].isRead)
                return true;
    }
    return false;
};
