/**
 * API-call: change bookmark (set/unset) for entry.
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @param {string} entryId entryId 
 * @param {boolean} bookmark true sets bookmark, false unsets 
 * @returns {Promise} indicates success
 */
export function changeBookmark(api, entryId, bookmark) {
    return api.request('entries/changeBookmark', { entryId, bookmark });
}


/**
 * API-call: change follow-state for entry.
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @param {string} entryId entryId 
 * @param {boolean} follow true sets follow, false unsets 
 * @returns {Promise} indicates success
 */
export function changeFollow(api, entryId, follow) {
    return api.request('entries/changeFollow', { entryId, follow });
}


/**
 * API-call: change vote for entry.
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @param {string} entryId entryId 
 * @param {number} vote number representing vote (>0: upvote, 0: no vote, <0: downvote)
 * @returns {Promise} indicates success
 */
export function changeVote(api, entryId, vote) {
    return api.request('entries/changeVote', { entryId, vote });
}


/**
 * API-call: delete entry.
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @param {string} entryId entryId 
 * @returns {Promise} indicates success
 */
export function deleteEntry(api, entryId) {
    return api.request('entries/deleteEntry', { entryId });
}


/**
 * @typedef {object} LoadMoreEntriesResult
 * @property {EntryDict} entryDict dictionary of entries
 * @property {Array<string>} idList list of entry-ids ordered/filtered according to subscribed list type
 * @property {boolean} moreEntriesToLoad indicates if more entries can be load, false if client already subscribed to all available entries in list
 */


/**
 * API-call: requests more entries (depending on active list subscription).
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @returns {Promise<LoadMoreEntriesResult>} resolves to object containing more entries
 */
export function loadMoreEntries(api) {
    return api.request('entries/loadMoreEntries');   
}


/**
 * API-call: post new entry.
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @param {boolean} isAnonymous true if posting is anonymous, otherwise false
 * @param {string} content content of comment
 * @param {Array<string>} imageDataArr array of attached images (base64 encoded)
 * @returns {Promise} indicates success
 */
export function postEntry(api, isAnonymous, content, imageDataArr) {
    return api.request('entries/postEntry', { isAnonymous, content, imageDataArr });
}


/**
 * @typedef {object} SubscribeEntriesResult
 * @property {EntryDict} entryDict EntryDict 
 */


/**
 * API-call: subscribe to entries (by ids).
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @param {Array<string>} entryIds array of entryIds to subscribe to
 * @returns {Promise<SubscribeEntriesResult>} resolves to object containing EntryDict
 */
export function subscribeEntries(api, entryIds) {
    return api.request('entries/subscribeEntries', { entryIds });
}


/**
 * API-call: subscribe to entry-list (by type).
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @param {EntryListTypeEnum} listType list type
 * @param {boolean} onlyBookmarked indicates if only bookmarked entries should be included in subscription
 * @returns {Promise} indicates success
 */
export function subscribeEntryList(api, listType, onlyBookmarked) {
    return api.request('entries/subscribeEntryList', { listType, onlyBookmarked });
}


/**
 * API-call: unsubscribe from (previously subscribed) entries (by ids).
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @param {Array<string>} entryIds array of entryIds to unsubscribe from
 * @returns {Promise} indicates success
 */
export function unsubscribeEntries(api, entryIds) {
    return api.request('entries/unsubscribeEntries', { entryIds });
}


/**
 * API-call: unsubscribe from (previously subscribed) entry-list.
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @returns {Promise} indicates success
 */
export function unsubscribeEntryList(api) {
    return api.request('entries/unsubscribeEntryList');
}
