/**
 * @typedef {object} LoginData 
 * @property {(string|null)} activeEventId id of active (or last active) event, null if no event is active
 * @property {string} id id of user
 * @property {string} name name of user
 * @property {string} sessionToken sessionToken (jwt)
 */


/**
 * API-call: continue session (via sessionToken).
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @param {string} sessionToken sessionToken
 * @returns {Promise<LoginData>} resolves to object containing login-data (sessionToken, ...)
 */
export function continueSession(api, sessionToken) {
    return api.request('user/continueSession', { sessionToken });
}


/**
 * API-call: login.
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @param {string} email email of user
 * @param {string} password password of user
 * @returns {Promise<LoginData>} resolves to object containing login-data (sessionToken, ...)
 */
export function login(api, email, password) {
    return api.request('user/login', { email, password });
}