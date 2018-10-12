import { combineReducers } from 'redux';
import * as entriesActionTypes from '../actiontypes/entries';
import * as eventsActionTypes from '../actiontypes/events';
import * as userActionTypes from '../actiontypes/user';
import * as utils from '../utils';


/**
 * An entry object.
 * @typedef {object} Entry
 * @property {(string|null)} authorId user-id of author, null if entry was posted anonymously
 * @property {boolean} bookmark indicates if user bookmarked entry
 * @property {Array<string>} commentAttendingUserIds list of user-ids that attend discussion (comment-section)
 * @property {number} commentCount count of comments
 * @property {string} content text-content of entry
 * @property {boolean} follow indicates if user is following entry-updates
 * @property {Array<string>} imageIds list of (image-)ids of attached images
 * @property {boolean} liveAnswered indicates if entry was discussed in live situation
 * @property {boolean} own indicates if user owns entry
 * @property {number} score score of the entry
 * @property {number} timestamp unix-timestamp in ms indicating submission date
 * @property {number} vote indicates user vote: 0 user did not vote, +1 user upvoted, -1 user downvoted entry
 */


/**
 * Dictionary of entries.
 * 
 * dict[key] = value:
 * * key := id of entry
 * * value := {@link Entry}
 * @typedef {object} EntryDict
 */


/**
 * Enum for list types.
 * @enum {number}
 * @property {number} RECENT
 * @property {number} TOP_LATELY
 * @property {number} TOP_RATED
 */
export const EntryListTypeEnum = Object.freeze({
    RECENT: 0,
    TOP_LATELY: 1,
    TOP_RATED: 2,
});


/**
 * Shape of entries reducers state.
 * Default values are the initial state.
 * @typedef {object} EntriesState
 * @property {EntryDict} [entryDict={}] dictionary of entries
 * @property {Array<string>} [idList=[]] list of entry-ids ordered/filtered according to subscribed list type
 * @property {boolean} [listOnlyBookmarked=false] indicates if only bookmarked entries should be listed (filter for idList)
 * @property {boolean} [listSubcribed=false] indicates if list subscription is active
 * @property {EntryListTypeEnum} [listType=EntryListTypeEnum.RECENT] subscribed/configured list type
 * @property {boolean} [moreEntriesToLoad=true] indicates if more entries can be load, false if client already subscribed to all available entries in list
 */
const initialState = {
    entryDict: {},
    idList: [],
    listOnlyBookmarked: false,
    listSubscribed: false,
    listType: EntryListTypeEnum.RECENT,
    moreEntriesToLoad: true,
    // recentlyUpdatedIds: [],
};


const entryDict = (state = initialState.entryDict, action) => {
    switch (action.type) {
        case entriesActionTypes.LOAD_MORE_ENTRIES_SUCCESS:
        case entriesActionTypes.SUBSCRIBE_ENTRIES_SUCCESS:
        case entriesActionTypes.UPDATE_ENTRIES:
            const updateDict = action.result ? action.result.entryDict : action.entryDict;
            if (Object.keys(updateDict).length === 0)
                return state;
            const newDict = {
                ...state,
                ...updateDict
            };
            utils.removeNulledPropertiesFromObject(newDict);
            return newDict;
        // TODO clear obsolete entries on SUBSCRIBE_ENTRY_LIST_REQUEST / (& unsubscribe)
        // reset
        case eventsActionTypes.SWITCH_ACTIVE_EVENT_REQUEST:
        case userActionTypes.CONTINUE_SESSION_REQUEST:
        case userActionTypes.LOGIN_REQUEST:
        case userActionTypes.LOGOUT_SUCCESS:
            return initialState.entryDict;
        default:
            return state;
    }
};


const idList = (state = initialState.idList, action) => {
    switch (action.type) {
        case entriesActionTypes.LOAD_MORE_ENTRIES_SUCCESS:
            return action.result.idList;
        case entriesActionTypes.UPDATE_ENTRIES:
            if (action.idList === undefined)
                return state;
            return action.idList;
        // reset
        case entriesActionTypes.SUBSCRIBE_ENTRY_LIST_REQUEST:
        case entriesActionTypes.UNSUBSCRIBE_ENTRY_LIST_REQUEST:
        case eventsActionTypes.SWITCH_ACTIVE_EVENT_REQUEST:
        case userActionTypes.CONTINUE_SESSION_REQUEST:
        case userActionTypes.LOGIN_REQUEST:
        case userActionTypes.LOGOUT_SUCCESS:
            return initialState.idList;
        default:
            return state;
    }
};


const listOnlyBookmarked = (state = initialState.listOnlyBookmarked, action) => {
    switch (action.type) {
        case entriesActionTypes.SUBSCRIBE_ENTRY_LIST_REQUEST:
            return action.onlyBookmarked;
        // reset
        case entriesActionTypes.UNSUBSCRIBE_ENTRY_LIST_REQUEST:
        case eventsActionTypes.SWITCH_ACTIVE_EVENT_REQUEST:
        case userActionTypes.CONTINUE_SESSION_REQUEST:
        case userActionTypes.LOGIN_REQUEST:
        case userActionTypes.LOGOUT_SUCCESS:
            return initialState.listOnlyBookmarked;
        default:
            return state;
    }
};


const listSubscribed = (state = initialState.listSubscribed, action) => {
    switch (action.type) {
        case entriesActionTypes.SUBSCRIBE_ENTRY_LIST_REQUEST:
            return true;
        case entriesActionTypes.UNSUBSCRIBE_ENTRY_LIST_REQUEST:
            return false;
        // reset
        case eventsActionTypes.SWITCH_ACTIVE_EVENT_REQUEST:
        case userActionTypes.CONTINUE_SESSION_REQUEST:
        case userActionTypes.LOGIN_REQUEST:
        case userActionTypes.LOGOUT_SUCCESS:
            return initialState.listSubscribed;
        default:
            return state;
    }
};


const listType = (state = initialState.listType, action) => {
    switch (action.type) {
        case entriesActionTypes.SUBSCRIBE_ENTRY_LIST_REQUEST:
            return action.listType;
        // reset
        case entriesActionTypes.UNSUBSCRIBE_ENTRY_LIST_REQUEST:
        case eventsActionTypes.SWITCH_ACTIVE_EVENT_REQUEST:
        case userActionTypes.CONTINUE_SESSION_REQUEST:
        case userActionTypes.LOGIN_REQUEST:
        case userActionTypes.LOGOUT_SUCCESS:
            return initialState.listType;
        default:
            return state;
    }
};


const moreEntriesToLoad = (state = initialState.moreEntriesToLoad, action) => {
    switch (action.type) {
        case entriesActionTypes.LOAD_MORE_ENTRIES_SUCCESS:
            return action.result.hasMoreEntriesToLoad;
        // reset
        case entriesActionTypes.SUBSCRIBE_ENTRY_LIST_REQUEST:
        case entriesActionTypes.UNSUBSCRIBE_ENTRY_LIST_REQUEST:
        case eventsActionTypes.SWITCH_ACTIVE_EVENT_REQUEST:
        case userActionTypes.CONTINUE_SESSION_REQUEST:
        case userActionTypes.LOGIN_REQUEST:
        case userActionTypes.LOGOUT_SUCCESS:
            return initialState.moreEntriesToLoad;
        default:
            return state;
    }
};


// const recentlyUpdatedIds = (state = initialState.recentlyUpdatedIds, action) => {
//     switch (action.type) {
//         case entriesActionTypes.SUBSCRIBE_ENTRIES_REQUEST:
//             return true;        
//         case entriesActionTypes.LOAD_MORE_ENTRIES_SUCCESS:
//             return action.result.hasMoreEntriesToLoad;
//         // reset
//         case eventsActionTypes.SWITCH_ACTIVE_EVENT_REQUEST:
//         case userActionTypes.CONTINUE_SESSION_REQUEST:
//         case userActionTypes.LOGIN_REQUEST:
//             return initialState.moreEntriesToLoad;
//         default:
//             return state;
//     }
// };


/**
 * entries-reducer
 * @function
 * @param {EntriesState} state
 * @param {object} action
 */
export const entries = combineReducers({
    entryDict,
    idList,
    listOnlyBookmarked,
    listSubscribed,
    listType,
    moreEntriesToLoad,
});


// selectors

/**
 * Selector to select an entry by its id from entries-state.
 * @function
 * @param {EntriesState} state entries-state
 * @param {string} entryId id of entry
 * @returns {(Entry|null)} entry with specified id
 */
export const getEntry = (state, entryId) => 
    state.entryDict[entryId] || null;


/**
 * Selector to retrieve whole entry dictionary from entries-state.
 * @function
 * @param {EntriesState} state entries-state
 * @returns {EntryDict} dictionary of entries
 */
export const getEntryDict = (state) =>
    state.entryDict;


// let sortedKeyListCache = {};
// export const getSortedKeyList = (state) => {
//     if (sortedKeyListCache.lastDict !== state.entryDict) {
//         const dict = state.entryDict;
//         // TODO hardcoded for entriesOrder = RECENT
//         sortedKeyListCache.cachedList = Object.keys(dict).sort((a, b) => {
//             return dict[b].timestamp - dict[a].timestamp;
//         });
//         sortedKeyListCache.lastDict = dict;
//     }
//     return sortedKeyListCache.cachedList;
// }


/**
 * Selector to select list of entry-ids from entries-state.
 * @function
 * @param {EntriesState} state entries-state
 * @returns {Array<string>} list of entry-ids ordered/filtered according to subscribed list type
 */
export const getIdList = (state) =>
    state.idList;


/**
 * Selector to select list type from entries-state.
 * @function
 * @param {EntriesState} state entries-state
 * @returns {EntryListTypeEnum} selected/configured list type
 */
export const getListType = (state) =>
    state.listType;


/**
 * Selector to select state of "only-bookmarked" filter from entries-state.
 * @function
 * @param {EntriesState} state entries-state
 * @returns {boolean} indicates if only bookmarked entries should be listed (filter for idList)
 */
export const hasListOnlyBookmarked = (state) =>
    state.listOnlyBookmarked;


/**
 * Selector to select state if more entries can be load from server from entries-state.
 * @function
 * @param {EntriesState} state entries-state
 * @returns {boolean} indicates if more entries can be load, false if client already subscribed to all available entries in list
 */
export const hasMoreEntriesToLoad = (state) => 
    state.moreEntriesToLoad;


/**
 * Selector to select state if list subscription is active from entries-state.
 * @function
 * @param {EntriesState} state entries-state
 * @returns {boolean} indicates if list subscription is active
 */
export const isListSubscribed = (state) =>
    state.listSubscribed;
