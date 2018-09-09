import io from 'socket.io-client';
import callbackTimeout from 'callback-timeout';
import { ApiConnectionStateEnum } from './ApiConnectionStateEnum';
import { getConnectionState } from '../reducers/api';
import { getSessionToken } from '../reducers/user';
import { setupListeners } from './redux/bindings';
import * as apiActions from '../actions/api';
import * as userActions from '../actions/user';
import { config } from '../config';
import { privateDecrypt } from 'crypto';


/**
 * Represents connection to (WebSocket-)API.
 * You must call `initialize()` method after construction.
 */
export class ApiConnection {
    // methods
    /**
     * Initializes ApiConnection instance. Must be called after instance creation.
     * @function
     * @param {string} url url socketAPI is listening on
     * @param {dispatchAction} dispatch function to dispatch an action to the store
     * @param {getStateOfStore} getState function to retrieve current app-state from store
     */
    initialize(url, dispatch, getState) {
        this._url = url;
        this._dispatch = dispatch;
        this._getState = getState;
        this._socket = io(url);
        // following line causes dispatch of ApiConnectionState: TEMPORARILY_DISCONNECTED
        // followed by ApiConnectionState: DISCONNECTED (after API_DISCONNECT_TIMEOUT)
        // in order to provide first (initial) connect attempt with a timeout
        this._transitionToDisconnectedState();
        
        // general listeners
        this._socket.on('connect', this._handleConnect);
        this._socket.on('connect_error', this._handleConnectError);
        this._socket.on('disconnect', this._handleDisconnect);

        // other listeners (redux bindings)
        setupListeners(this, this._dispatch);
    }

    
    /**
     * Dispatches changeConnectionState actions to transition from TEMPORARILY_DISCONNECTED
     * to DISCONNECTED after API_DISCONNECT_TIMEOUT.
     * @private
     * @function
     */
    _transitionToDisconnectedState() {
        this._dispatch(apiActions.changeConnectionState(ApiConnectionStateEnum.TEMPORARILY_DISCONNECTED));                        
        setTimeout(() => {
            if (getConnectionState(this._getState().api) === ApiConnectionStateEnum.TEMPORARILY_DISCONNECTED)
                this._dispatch(apiActions.changeConnectionState(ApiConnectionStateEnum.DISCONNECTED));                
        }, config.api.disconnectTimeout);
    }


    /**
     * Define connection state.
     * Handles connectionState transition by dispatching corresponding actions (redux).
     * @private
     * @function
     * @param {boolean} isConnected true sets state to CONNECTED, false transitions to DISCONNECTED
     */
    _changeIsConnected(isConnected) {
        if (isConnected) {
            this._dispatch(apiActions.changeConnectionState(ApiConnectionStateEnum.CONNECTED));
            return;
        }
        if (getConnectionState(this._getState().api) === ApiConnectionStateEnum.CONNECTED)
            this._transitionToDisconnectedState();
    }


    /**
     * Performs an api-request with the specified data-object.
     * @function
     * @param {string} event event-identifier
     * @param {object} [data={}] data to send
     * @returns {Promise<*>} resolves to response-data
     */
    request(event, data = {}) {
        return new Promise((resolve, reject) => {
            if (!this._socket) return reject('No socket connection.');

            // https://github.com/jasonpincin/callback-timeout
            return this._socket.emit(event, data, callbackTimeout((err, result) => {
                // this function is the optional callback that you can use with socket.io in every request.
                if (err) {
                    console.error(err);
                    return reject(err);
                }

                return resolve(result);
            }, config.api.requestTimeout, 'Api request timed out. Did not receive acknowledge callback.'));
        });
    }


    /**
     * Callback for api-event.
     * @callback ApiConnection~eventListenerCallback
     * @param {*} eventData attached event-data
     */


    /**
     * Registers a callback for a specific api-event.
     * @function
     * @param {string} event event-identifier
     * @param {ApiConnection~eventListenerCallback} cb callback for api-event
     */
    on(event, cb) {
        this._socket.on(event, cb);
    }


    // handlers
    /**
     * Eventhandler for connected event.
     * @private
     * @function
     */
    _handleConnect = () => {
        console.log("api: socket connected");
        this._changeIsConnected(true);

        // authenticate
        const sessionToken = getSessionToken(this._getState().user);
        if (sessionToken)
            this._dispatch(userActions.continueSession(sessionToken));
    }


    /**
     * Eventhandler for connect error event.
     * @private
     * @function
     * @param {string} reason reason for connect failed
     */
    _handleConnectError = (reason) => {
        console.log("api: socket connect error - " + reason);
        this._changeIsConnected(false);
    }


    /**
     * Eventhandler for socket disconnect event.
     * @private
     * @function
     * @param {string} reason disconnect-reason
     */
    _handleDisconnect = (reason) => {
        console.log('api: socket disconnected - ' + reason);
        this._changeIsConnected(false);
    }
}