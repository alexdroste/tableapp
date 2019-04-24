
const _emailCache = {};
const _usernameCache = {};

/**
 * Searches for an users name by id, caches usernames. 
 * LDAPConnection needs to be open (connected & bound).
 * @async
 * @function
 * @param {LDAPConnection} ldap LDAPConnection instance to use
 * @param {string} userId userId to look up 
 * @returns {Promise<string>} resolves to the users name
 */
async function getNameFromUserIdWithCache(ldap, userId) {
    if (_usernameCache.hasOwnProperty(userId))
        return Promise.resolve(_usernameCache[userId]);
        // return await _usernameCache[userId];

    try {
        // IMPORTANT: following just works because in current implentation
        // userId is just the base64 encoded dn
        // as soon as this changes, following will no longer work
        const dn = Buffer.from(userId, 'base64').toString();
        const name = await ldap.getNameFromDn(dn);
        _usernameCache[userId] = name;
        return Promise.resolve(name);
        // _usernameCache[userId] = ldap.getNameFromDn(dn);
        // return await _usernameCache[userId];
    } catch (err) {
        console.error(err);
        throw err;
    }
}
module.exports.getNameFromUserIdWithCache = getNameFromUserIdWithCache;


/**
 * Searches for an users email by id, caches email addresses. 
 * LDAPConnection needs to be open (connected & bound).
 * @async
 * @function
 * @param {LDAPConnection} ldap LDAPConnection instance to use
 * @param {string} userId userId to look up 
 * @returns {Promise<string>} resolves to the users email
 */
async function getEmailFromUserIdWithCache(ldap, userId) {
    if (_emailCache.hasOwnProperty(userId))
        return Promise.resolve(_emailCache[userId]);
        // return await _emailCache[userId];

    try {
        // IMPORTANT: following just works because in current implentation
        // userId is just the base64 encoded dn
        // as soon as this changes, following will no longer work
        const dn = Buffer.from(userId, 'base64').toString();
        const email = await ldap.getEmailFromDn(dn);
        _emailCache[userId] = email;
        return Promise.resolve(email);
        // _emailCache[userId] = ldap.getEmailFromDn(dn);
        // return await _emailCache[userId];
    } catch (err) {
        console.error(err);
        throw err;
    }
}
module.exports.getEmailFromUserIdWithCache = getEmailFromUserIdWithCache;
