import { combineReducers } from 'redux';
import { ApiConnectionStateEnum } from '../api/ApiConnectionStateEnum';
import * as apiActionTypes from '../actiontypes/api';


/**
 * Shape of api reducers state.
 * Default values are the initial state.
 * @typedef {object} ApiState
 * @property {ApiConnectionStateEnum} [connectionState=ApiConnectionStateEnum.DISCONNECTED] indicates connection state to api (backend)
 * @property {Array<string>} [lockedActionKeys=[]] keys of api-actions that are currently pending / awaiting an answer that should not be executed twice
 */
const initialState = {
    connectionState: ApiConnectionStateEnum.DISCONNECTED,
    lockedActionKeys: [],
}


const connectionState = (state = initialState.connectionState, action) => {
    switch (action.type) {
        case apiActionTypes.CONNECTION_STATE_CHANGED:
            return action.connectionState;
        default:
            return state;
    }
};


const lockedActionKeys = (state = initialState.lockedActionKeys, action) => {
    switch (action.type) {
        case apiActionTypes.LOCK_KEY: // => add key to state
            if (state.indexOf(action.key) !== -1) // already includes key
                return state;
            return [
                ...state.slice(),
                action.key
            ];

        case apiActionTypes.UNLOCK_KEY: // => remove key from state
            const indexOfKey = state.indexOf(action.key);
            if (indexOfKey === -1) // does not include key
                return state;
            return [
                ...state.slice(0, indexOfKey),
                ...state.slice(indexOfKey + 1)
            ];
        
        // reset
        case apiActionTypes.CONNECTION_STATE_CHANGED:
            return initialState.lockedActionKeys;
        default:
            return state;
    }
};


/**
 * api-reducer
 * @function
 * @param {ApiState} state
 * @param {object} action
 */
export const api = combineReducers({
    connectionState,
    lockedActionKeys
});


// selectors
/**
 * Selector to select api connection state from api-state.
 * @function
 * @param {ApiState} state api-state
 * @returns {ApiConnectionStateEnum} indicates connection state to api (backend)
 */
export const getConnectionState = (state) =>
    state.connectionState;


/**
 * Selector to check if an action key is currently locked, selects from api-state.
 * @function
 * @param {ApiState} state api-state
 * @returns {boolean} indicates that an action key is currently locked, that means that the same request was made before but did not receive an answer until now and another request should not be made until an answer is received or a timeout kicked in
 */
export const isKeyLocked = (state, key) =>
    state.lockedActionKeys.indexOf(key) !== -1;

