import * as notificationsActionTypes from '../actiontypes/notifications';


/**
 * Creates an action for marking/logging an notification as read by user.
 * @function
 * @param {string} notificationId id of notification
 * @returns {object} action
 */
export function readNotification(notificationId) {
    return ({
        type: 'apiCall',
        apiCall: {
            types: [notificationsActionTypes.READ_NOTIFICATION_REQUEST,
                notificationsActionTypes.READ_NOTIFICATION_SUCCESS,
                notificationsActionTypes.READ_NOTIFICATION_FAILURE],
            call: api => api.request('notifications/readNotification', { notificationId })
        }
    });
}


/**
 * Creates action for updating the NotificationDict.
 * @function
 * @param {NotificationDict} notificationDict updated NotificationDict
 * @returns {object} action
 */
export function updateNotificationDict(notificationDict) {
    return ({
        type: notificationsActionTypes.UPDATE_NOTIFICATION_DICT,
        notificationDict,
    });
}
