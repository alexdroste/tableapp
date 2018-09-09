import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import throttle from 'lodash/throttle';
import { apiMiddleware } from './api/redux/middleware';
import { ipcMiddleware } from './ipc/middleware';
import reducers from './reducers/index';
import { loadState, saveState } from './localStorage';
import { config } from './config';


/**
 * Store-function to dispatch an action.
 * @callback dispatchAction
 * @param {object} action action to dispatch
 */


/**
 * Store-function to retrieve current app-state.
 * @callback getStateOfStore
 * @returns {object} returns object in the shape of the root-reducer with current app-state
 */


/**
 * Initializes and configures redux store.
 * 
 * Applied middlewares:
 * * thunk
 * * ipcMiddleware
 * * apiMiddleware
 * * logger (only in development)
 * 
 * Sets up saveState routine for saving parts of state in localStorage.
 * @function
 * @param {ApiConnection} api api connection instance
 * @param {IpcHandler} ipc ipc handler instance
 * @returns {object} fully initialized (redux-)store
 */
export const configureStore = (api, ipc) => {
    const preloadedState = loadState();

    const middlewares = [
        thunk,
        ipcMiddleware(ipc),
        apiMiddleware(api),
    ];

    // debug extras
    if (process.env.NODE_ENV !== 'production') {
        middlewares.push(createLogger());
    }

    const store = createStore(
        reducers,
        preloadedState,
        applyMiddleware(...middlewares)
    );

    // save state to local storage handler
    store.subscribe(throttle(() => {
        saveState({
            user: {
                sessionToken: store.getState().user.sessionToken,
            },
        });
    }, config.saveStateDebounceTime));

    return store;
};
