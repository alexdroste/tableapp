/**
 * Redux middleware for ipc messages. 
 * 
 * ### API middleware usage:
 * 
 * Dispatch an action with following shape:
 * 
 * ```
 * type: can be anything,
 * ipcCall: (ipc) => resizeWindow(ipc, width, height),
 * ...rest
 * ```
 * 
 * @param {object} ipc ipc handler instance
 * @returns {function} redux middleware
 * @see https://stackoverflow.com/a/41309189
 */
export function ipcMiddleware(ipc) {  
    return ({ dispatch, getState }) => next => action => {
        const { ipcCall, ...rest } = action;

        if (ipcCall)
            ipcCall(ipc);
    
        return next({...rest});
    };
}