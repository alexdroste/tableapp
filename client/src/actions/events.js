import * as eventsActionTypes from '../actiontypes/events';
import * as eventsApiMethods from '../api/actions/events';


/**
 * Creates action for subscribing to full EventDict (containing all events).
 * @function
 * @returns {object} action
 */
export function subscribeFullEventDict() {
    return ({
        type: 'apiCall',
        apiCall: {
            key: 'subscribeFullEventDict',
            types: [eventsActionTypes.SUBSCRIBE_FULL_EVENT_DICT_REQUEST,
                eventsActionTypes.SUBSCRIBE_FULL_EVENT_DICT_SUCCESS,
                eventsActionTypes.SUBSCRIBE_FULL_EVENT_DICT_FAILURE],
            call: (api) => eventsApiMethods.subscribeFullEventDict(api)
        }
    });
}


/**
 * Creates action for unsubscribing from full EventDict.
 * @function
 * @returns {object} action
 */
export function unsubscribeFullEventDict() {
    return ({
        type: 'apiCall',
        apiCall: {
            key: 'unsubscribeFullEventDict', // should not be blocked by subscribe event
            types: [eventsActionTypes.UNSUBSCRIBE_FULL_EVENT_DICT_REQUEST,
                eventsActionTypes.UNSUBSCRIBE_FULL_EVENT_DICT_SUCCESS,
                eventsActionTypes.UNSUBSCRIBE_FULL_EVENT_DICT_FAILURE],
            call: (api) => eventsApiMethods.unsubscribeFullEventDict(api)
        }
    });
}


/**
 * Creates action for joining an event.
 * @function
 * @param {string} eventId id of event to join
 * @returns {object} action
 */
export function joinEvent(eventId) {
    return ({
        type: 'apiCall',
        apiCall: { 
            types: [eventsActionTypes.JOIN_EVENT_REQUEST,
                eventsActionTypes.JOIN_EVENT_SUCCESS,
                eventsActionTypes.JOIN_EVENT_FAILURE],
            call: (api) => eventsApiMethods.joinEvent(api, eventId)
        },
        eventId
    });
}


/**
 * Creates action for leaving an event.
 * @function
 * @param {string} eventId id of event to leave
 * @returns {object} action
 */
export function leaveEvent(eventId) {
    return ({
        type: 'apiCall',
        apiCall: {
            types: [eventsActionTypes.LEAVE_EVENT_REQUEST,
                eventsActionTypes.LEAVE_EVENT_SUCCESS,
                eventsActionTypes.LEAVE_EVENT_FAILURE],
            call: (api) => eventsApiMethods.leaveEvent(api, eventId)
        },
        eventId
    });
}


/**
 * Creates action for switching the active event.
 * @function
 * @param {string} eventId id of event to switch to
 * @returns {object} action
 */
export function switchActiveEvent(eventId) {
    return ({
        type: 'apiCall',
        apiCall: {
            key: 'switchActiveEvent',
            types: [eventsActionTypes.SWITCH_ACTIVE_EVENT_REQUEST, 
                eventsActionTypes.SWITCH_ACTIVE_EVENT_SUCCESS, 
                eventsActionTypes.SWITCH_ACTIVE_EVENT_FAILURE],
            call: (api) => eventsApiMethods.switchActiveEvent(api, eventId)
        },
        eventId
    });
}


/**
 * Creates action for updating the EventDict.
 * @function
 * @param {EventDict} eventDict updated EventDict
 * @returns {object} action
 */
export function updateEventDict(eventDict) {
    return ({
        type: eventsActionTypes.UPDATE_EVENT_DICT,
        eventDict
    });
}

