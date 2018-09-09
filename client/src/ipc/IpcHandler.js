import { setupListeners } from './bindings';


/**
 * Represents communication channel to/from the electron main-process.
 */
export class IpcHandler {
    /**
     * Initializes IpcHandler instance. Must be called after creation.
     * @function
     * @param {dispatchAction} dispatch  function to dispatch an action to the store
     */
    initialize(dispatch) {
        if (!window.ipc)
            return;
        this._dispatch = dispatch;
        setupListeners(this, this._dispatch);
    }


    /**
     * Sends message to the main-process.
     * @param {string} event event-identifier
     * @param {object} [data={}] data to send
     */
    sendMessage(event, data = {}) {
        if (!window.ipc) {
            console.log("ERROR: ipc unset, electron context missing");
            return
        }
        window.ipc.send(event, data);
    }


    /**
     * Callback for ipc-event.
     * @callback IpcHandler~eventListenerCallback
     * @param {*} eventData attached event-data
     */


    /**
     * Registers a callback for a specific ipc-event.
     * @param {string} event event-identifier
     * @param {IpcHandler~eventListenerCallback} cb callback for ipc-event
     */
    on(event, cb) {
        window.ipc.on(event, cb);
    }
}