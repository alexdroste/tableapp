/**
 * API-call: subscribe to full EventDict (containing all events).
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @returns {Promise} indicates success
 */
export function subscribeFullEventDict(api) {
    return api.request('events/subscribeFullEventDict');
}


/**
 * API-call: unsubscribe from full EventDict.
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @returns {Promise} indicates success
 */
export function unsubscribeFullEventDict(api) {
    return api.request('events/unsubscribeFullEventDict');
}


/**
 * API-call: join an event (by id).
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @param {string} eventId id of event to join
 * @returns {Promise} indicates success
 */
export function joinEvent(api, eventId) {
    return api.request('events/joinEvent', { eventId });   
}


/**
 * API-call: leave an event (by id).
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @param {string} eventId id of event to leave
 * @returns {Promise} indicates success
 */
export function leaveEvent(api, eventId) {
    return api.request('events/leaveEvent', { eventId });   
}


/**
 * API-call: switch the active event (by id).
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @param {string} eventId id of event to switch to
 * @returns {Promise} indicates success
 */
export function switchActiveEvent(api, eventId) {
    return api.request('events/switchActiveEvent', { eventId });
}
