import { isKeyLocked } from '../../reducers/api';
import { BLOCKED_REQUEST } from '../../actiontypes/api';
import * as apiActions from '../../actions/api';


/**
 * Redux middleware for api calls. 
 * 
 * ### API middleware usage:
 * 
 * Dispatch an action with following shape:
 * 
 * ```
 * type: always 'apiCall',
 * apiCall: {
 *    key: 'login',
 *    types: [REQUEST, SUCCESS, FAILURE],
 *    call: (api) => api.login("myemail@web.de", "mypass")
 * },
 * ...rest
 * ```
 * 
 * ### apiCall.key property // parallel execution prevention
 * 
 * Setting key prevents parallel execution (of api calls with same key) 
 * to avoid race conditions.
 * 
 * If a call was blocked, an action with the following shape is dispatched:
 * 
 * ```
 * type: BLOCKED_REQUEST (actionType from api),
 * originalType: REQUEST (as specified in apiCall.types),
 * ...rest
 * ```
 * 
 * ### additional notes
 * 
 * - apiCall.call must return a Promise
 * - SUCCESS action holds response in action.result
 * - FAILURE action holds error-response in action.error
 * @param {object} api api instance
 * @returns {function} redux middleware
 * @see https://stackoverflow.com/a/41309189
 */
export function apiMiddleware(api) {  
    return ({ dispatch, getState }) => next => action => {
        const { apiCall, type, ...rest } = action;
    
        // filter non-api requests
        if (type !== 'apiCall' || !apiCall)
            return next(action);
            
        const [REQUEST, SUCCESS, FAILURE] = apiCall.types;
        if (apiCall.key) {
            // prevent race-conditions by checking if action was already dispatched (key locked)
            if (isKeyLocked(getState().api, apiCall.key))
                return next({...rest, type: BLOCKED_REQUEST, originalType: REQUEST});
            else
                next(apiActions.lockKey(apiCall.key));
        }
        next({...rest, type: REQUEST});
    
        return apiCall.call(api).then(
            (result) => {
                if (apiCall.key)
                    next(apiActions.unlockKey(apiCall.key));
                return next({...rest, result, type: SUCCESS });
            }, (error) => {
                if (apiCall.key)
                    next(apiActions.unlockKey(apiCall.key));
                return next({...rest, error, type: FAILURE });
            });
    };
}