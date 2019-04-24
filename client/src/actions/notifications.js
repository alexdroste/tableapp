import * as notificationsActionTypes from '../actiontypes/notifications';


/**
 * Creates an action for marking/logging an notification as read by user.
 * @function
 * @param {string} notificationId id of notification
 * @param {boolean} inAppClick indicates if read was triggered by clicking in-app notification or indirect (e.g. mail-link)
 * @returns {object} action
 */
export function readNotification(notificationId, inAppClick) {
    return ({
        type: 'apiCall',
        apiCall: {
            types: [notificationsActionTypes.READ_NOTIFICATION_REQUEST,
                notificationsActionTypes.READ_NOTIFICATION_SUCCESS,
                notificationsActionTypes.READ_NOTIFICATION_FAILURE],
            call: api => api.request('notifications/readNotification', { notificationId, inAppClick })
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
