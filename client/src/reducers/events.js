import { combineReducers } from 'redux';
import * as eventsActionTypes from '../actiontypes/events';
import * as userActionTypes from '../actiontypes/user';
import * as utils from '../utils';
import { PermissionLevelEnum } from '../PermissionLevelEnum';


/**
 * An event object.
 * @typedef {object} TableEvent
 * @property {boolean} isArchived indicates if event is archived
 * @property {string} name title/name of event
 * @property {PermissionLevelEnum} permissionLevel permission level of user
 */


/**
 * Dictionary of TableEvents.
 * 
 * dict[key] = value:
 * * key := id of event
 * * value := {@link TableEvent}
 * @typedef {object} EventDict
 */


/**
 * Shape of events reducers state.
 * Default values are the initial state.
 * @typedef {object} EventsState
 * @property {object} activeEvent
 * @property {(string|null)} [activeEvent.id=null] id of active event
 * @property {boolean} [activeEvent.switchPending=false] indicates if event switch is pending
 * @property {boolean} [initialDictUpdatePending=true] indicates if initial update of eventDict is pending
 * @property {EventDict} [eventDict={}]
 * @property {boolean} [subscribedFullDict=false] indicates if client subscribed to full event dictionary (all available events)
 */
const initialState = {
    activeEvent: {
        id: null,
        switchPending: false,
    },
    initialDictUpdatePending: true,
    eventDict: {},
    subscribedFullDict: false,
};


const activeEvent = (state = initialState.activeEvent, action) => {
    switch (action.type) {
        case userActionTypes.CONTINUE_SESSION_SUCCESS:
        case userActionTypes.LOGIN_SUCCESS:
            return {
                id: action.result.activeEventId,
                switchPending: false,
            };
        case eventsActionTypes.SWITCH_ACTIVE_EVENT_REQUEST:
            return {
                id: null,
                switchPending: true,
            };
        case eventsActionTypes.SWITCH_ACTIVE_EVENT_SUCCESS:
            return {
                id: action.eventId,
                switchPending: false,
            };
        case eventsActionTypes.SWITCH_ACTIVE_EVENT_FAILURE:
            return {
                id: null,
                switchPending: null,
            };
        case eventsActionTypes.LEAVE_EVENT_REQUEST:
            if (action.eventId !== state.id)
                return state;
            return {
                ...state,
                id: null,
            };
        // reset
        case userActionTypes.CONTINUE_SESSION_REQUEST:
        case userActionTypes.LOGIN_REQUEST:
            return initialState.activeEvent;
        default:
            return state;
    }
};


const initialDictUpdatePending = (state = initialState.initialDictUpdatePending, action) => {
    switch (action.type) {
        case eventsActionTypes.SUBSCRIBE_FULL_EVENT_DICT_REQUEST:
            return true;
        case eventsActionTypes.UPDATE_EVENT_DICT:
            return false;
        // reset
        case userActionTypes.CONTINUE_SESSION_REQUEST:
        case userActionTypes.LOGIN_REQUEST:
            return initialState.initialDictUpdatePending;
        default:
            return state;
    }
};


const eventDict = (state = initialState.eventDict, action) => {
    switch (action.type) {
        case eventsActionTypes.UPDATE_EVENT_DICT:
            // Attention! no deep merge, only shallow merge
            // => NO partial updates allowed!!!
            return {
                ...state,
                ...action.eventDict,
            };
        default:
            return state;
    }
};


const subscribedFullDict = (state = initialState.subscribedFullDict, action) => {
    switch (action.type) {
        case eventsActionTypes.SUBSCRIBE_FULL_EVENT_DICT_REQUEST:
            return true;
        case eventsActionTypes.UNSUBSCRIBE_FULL_EVENT_DICT_REQUEST:
            return false;
        default:
            return state;
    }
};


/**
 * events-reducer
 * @function
 * @param {EventsState} state
 * @param {object} action
 */
export const events = combineReducers({
    activeEvent,
    initialDictUpdatePending,
    eventDict,
    subscribedFullDict,
});


// selectors

/**
 * Selector to get state whether initial update for dictionary is pending from events-state.
 * @function
 * @param {EventsState} state events-state
 * @returns {boolean} indicates whether initial update for dicitionary is pending
 */
export const isInitialDictUpdatePending = (state) =>
    state.initialDictUpdatePending;


/**
 * Selector to get state whether event switch is pending from events-state.
 * @function
 * @param {EventsState} state events-state
 * @returns {boolean} indicates whether event switch is pending
 */
export const isSwitchActiveEventPending = (state) =>
    state.activeEvent.switchPending;


/**
 * Selector to select active event id from events-state.
 * @function
 * @param {EventsState} state events-state
 * @returns {(string|null)} id of active event, null if no event is active
 */
export const getActiveEventId = (state) => 
    state.activeEvent.id;


/**
 * Selector to select name of active event from events-state.
 * @function
 * @param {EventsState} state events-state
 * @returns {(string|null)} name of active event, null if no event is active
 */
export const getActiveEventName = (state) =>
    state.activeEvent.id ? state.eventDict[state.activeEvent.id].name : null;


/**
 * Selector to select users permission level for the active event from events-state.
 * @function
 * @param {EventsState} state events-state
 * @returns {(PermissionLevelEnum|null)} users pemission level for the active event, null if no event is active
 */
export const getActiveEventUserPermissionLevel = (state) =>
    state.activeEvent.id ? state.eventDict[state.activeEvent.id].permissionLevel : null;


/**
 * Selector to retrieve dictionary of events where user has at least joined from events-state.
 * @function
 * @param {EventsState} state events-state
 * @returns {EventDict} dictionary of events
 */
export const getEventDict = (state) => 
    utils.filterObject(state.eventDict, event => event.permissionLevel >= PermissionLevelEnum.USER);


/**
 * Selector to select a specific event from events-state.
 * @function
 * @param {EventsState} state events-state
 * @param {string} eventId id of event
 * @returns {(TableEvent|null)} event with specified id, null if event with id does not exist locally
 */
export const getEvent = (state, eventId) =>
    state.eventDict[eventId] || null;


/**
 * Selector to retrieve dictionary of all events from events-state.
 * @function
 * @param {EventsState} state events-state
 * @returns {EventDict} dictionary of events
 */
export const getFullEventDict = (state) => 
    state.eventDict;


/**
 * Selector to retrieve dictionary of events where user has not joined from events-state.
 * @function
 * @param {EventsState} state events-state
 * @returns {EventDict} dictionary of events
 */   
export const getUnjoinedEventDict = (state) =>
    utils.filterObject(state.eventDict, event => event.permissionLevel === PermissionLevelEnum.NOT_A_USER);
