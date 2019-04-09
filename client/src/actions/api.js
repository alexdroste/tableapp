import * as apiActionTypes from '../actiontypes/api';
import { getConnectionState } from '../reducers/api';


/**
 * Creates action for api connection-state change.
 * @function
 * @param {ApiConnectionStateEnum} connectionState state to change to
 * @returns {object} action
 */
export function changeConnectionState(connectionState) {
    return (dispatch, getState) => {
        // block dispatch if state would not change
        if (getConnectionState(getState().api) === connectionState)
            return;

        dispatch({
            type: apiActionTypes.CONNECTION_STATE_CHANGED,
            connectionState
        });
    };
}


/**
 * Creates action for locking a key. 
 * @function
 * @see apiMiddleware 
 * @param {string} key key to lock
 * @returns {object} action
 */
export function lockKey(key) {
    return {
        type: apiActionTypes.LOCK_KEY,
        key
    };
}


/**
 * Creates action for unlocking a previously locked key. 
 * @function
 * @see apiMiddleware 
 * @param {string} key key to unlock
 * @returns {object} action
 */
export function unlockKey(key) {
    return {
        type: apiActionTypes.UNLOCK_KEY,
        key
    };
}
