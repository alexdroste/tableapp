import * as entriesActionTypes from '../actiontypes/entries';
import * as entriesApiMethods from '../api/actions/entries';
import { getImage } from '../reducers/images';


/**
 * Creates action for changing bookmarked-state (set/unset) for entry.
 * @function
 * @param {string} entryId entryId 
 * @param {boolean} bookmark true sets bookmark, false unsets 
 * @returns {object} action
 */
export function changeBookmark(entryId, bookmark) {
    return ({
        type: 'apiCall',
        apiCall: {            
            types: [entriesActionTypes.CHANGE_BOOKMARK_REQUEST,
                entriesActionTypes.CHANGE_BOOKMARK_SUCCESS,
                entriesActionTypes.CHANGE_BOOKMARK_FAILURE],
            call: (api) => entriesApiMethods.changeBookmark(api, entryId, bookmark)
        }
    });
}


/**
 * Creates action for changing follow-state for entry.
 * @function
 * @param {string} entryId entryId 
 * @param {boolean} follow true sets follow, false unsets 
 * @returns {object} action
 */
export function changeFollow(entryId, follow) {
    return ({
        type: 'apiCall',
        apiCall: {            
            types: [entriesActionTypes.CHANGE_FOLLOW_REQUEST,
                entriesActionTypes.CHANGE_FOLLOW_SUCCESS,
                entriesActionTypes.CHANGE_FOLLOW_FAILURE],
            call: (api) => entriesApiMethods.changeFollow(api, entryId, follow)
        }
    });
}


/**
 * Creates action for changing user vote for entry.
 * @function
 * @param {string} entryId entryId 
 * @param {number} vote number representing vote (>0: upvote, 0: no vote, <0: downvote)
 * @returns {object} action
 */
export function changeVote(entryId, vote) {
    return ({
        type: 'apiCall',
        apiCall: {
            types: [entriesActionTypes.CHANGE_VOTE_REQUEST,
                entriesActionTypes.CHANGE_VOTE_SUCCESS,
                entriesActionTypes.CHANGE_VOTE_FAILURE],
            call: (api) => entriesApiMethods.changeVote(api, entryId, vote)
        }
    });
}


/**
 * Creates action for deleting an entry.
 * @function
 * @param {string} entryId entryId 
 * @returns {object} action
 */
export function deleteEntry(entryId) {
    return ({
        type: 'apiCall',
        apiCall: {
            types: [entriesActionTypes.DELETE_ENTRY_REQUEST,
                entriesActionTypes.DELETE_ENTRY_SUCCESS,
                entriesActionTypes.DELETE_ENTRY_FAILURE],
            call: (api) => entriesApiMethods.deleteEntry(api, entryId)
        }
    });
}


/**
 * Creates action for loading more entries (into feed).
 * @function
 * @returns {object} action
 */
export function loadMoreEntries() {
    return ({
        type: 'apiCall',
        apiCall: {
            key: 'loadMoreEntries',
            types: [entriesActionTypes.LOAD_MORE_ENTRIES_REQUEST,
                entriesActionTypes.LOAD_MORE_ENTRIES_SUCCESS,
                entriesActionTypes.LOAD_MORE_ENTRIES_FAILURE],
            call: (api) => entriesApiMethods.loadMoreEntries(api)
        }
    });
}


/**
 * Creates an action for marking/logging an entry as read by user.
 * @function
 * @param {string} entryId id of entry
 * @param {boolean} isScrollOver true if read-event was triggered while scrolling over entry, false otherwise (focus, click)
 * @returns {object} action
 */
export function readEntry(entryId, isScrollOver) {
    return ({
        type: 'apiCall',
        apiCall: {
            types: [entriesActionTypes.READ_ENTRY_REQUEST,
                entriesActionTypes.READ_ENTRY_SUCCESS,
                entriesActionTypes.READ_ENTRY_FAILURE],
            call: api => api.request('entries/readEntry', { entryId, isScrollOver })
        }
    })
}


/**
 * Creates action for posting a new entry.
 * @function
 * @param {boolean} isAnonymous true if posting is anonymous, otherwise false
 * @param {string} content content of comment
 * @param {Array<string>} imageIds array of images (by id) to attach
 * @returns {object} action
 */
export function postEntry(isAnonymous, content, imageIds) {
    return (dispatch, getState) => {
        const imageDataArr = imageIds.map((id) => getImage(getState().images, id));
        dispatch({
            type: 'apiCall',
            apiCall: {
                key: 'postEntry',
                types: [entriesActionTypes.POST_ENTRY_REQUEST,
                    entriesActionTypes.POST_ENTRY_SUCCESS,
                    entriesActionTypes.POST_ENTRY_FAILURE],
                call: (api) => entriesApiMethods.postEntry(api, isAnonymous, content, imageDataArr)
            }
        });
    }
}


/**
 * Creates action for subscribing to entries.
 * @function
 * @param {Array<string>} entryIds array of entryIds to subscribe to
 * @returns {object} action
 */
export function subscribeEntries(entryIds) {
    return {
        type: 'apiCall',
        apiCall: {
            key: 'subscribeEntries',
            types: [entriesActionTypes.SUBSCRIBE_ENTRIES_REQUEST,
                entriesActionTypes.SUBSCRIBE_ENTRIES_SUCCESS,
                entriesActionTypes.SUBSCRIBE_ENTRIES_FAILURE],
            call: (api) => entriesApiMethods.subscribeEntries(api, entryIds)
        }
    };
}


/**
 * Creates action for subscribing to a list of entries.
 * @function
 * @param {EntryListTypeEnum} listType list type
 * @param {boolean} onlyBookmarked indicates if only bookmarked entries should be included in subscription
 * @returns {object} action
 */
export function subscribeEntryList(listType, onlyBookmarked) {
    return {
        type: 'apiCall',
        apiCall: {
            key: 'subscribeEntryList',
            types: [entriesActionTypes.SUBSCRIBE_ENTRY_LIST_REQUEST,
                entriesActionTypes.SUBSCRIBE_ENTRY_LIST_SUCCESS,
                entriesActionTypes.SUBSCRIBE_ENTRY_LIST_FAILURE],
            call: (api) => entriesApiMethods.subscribeEntryList(api, listType, onlyBookmarked)
        },
        listType,
        onlyBookmarked,
    };
}


/**
 * Creates action for unsubscribing from entries.
 * @function
 * @param {Array<string>} entryIds array of entryIds to unsubscribe from
 * @returns {object} action
 */
export function unsubscribeEntries(entryIds) {
    return ({
        type: 'apiCall',
        apiCall: {
            key: 'unsubscribeEntries', // should not be blocked by subscribe event
            types: [entriesActionTypes.UNSUBSCRIBE_ENTRIES_REQUEST,
                entriesActionTypes.UNSUBSCRIBE_ENTRIES_SUCCESS,
                entriesActionTypes.UNSUBSCRIBE_ENTRIES_FAILURE],
            call: (api) => entriesApiMethods.unsubscribeEntries(api, entryIds)
        }
    });
}


/**
 * Creates action for unsubscribing from (the previously subscribed) list of entries.
 * @function
 * @returns {object} action
 */
export function unsubscribeEntryList() {
    return ({
        type: 'apiCall',
        apiCall: {
            key: 'unsubscribeEntryList', // should not be blocked by subscribe event
            types: [entriesActionTypes.UNSUBSCRIBE_ENTRY_LIST_REQUEST,
                entriesActionTypes.UNSUBSCRIBE_ENTRY_LIST_SUCCESS,
                entriesActionTypes.UNSUBSCRIBE_ENTRY_LIST_FAILURE],
            call: (api) => entriesApiMethods.unsubscribeEntryList(api)
        }
    });
}


/**
 * Creates action for updating entries feed (entryDict & idList).
 * @function
 * @property {EntryDict} entryDict dictionary of entries
 * @property {(Array<string>|undefined)} idList list of entry-ids ordered/filtered according to subscribed list type. undefined if no list-sub is active
 * @returns {object} action
 */
export function updateEntries(entryDict, idList) {
    return ({
        type: entriesActionTypes.UPDATE_ENTRIES,
        entryDict,
        idList,
    });
}
