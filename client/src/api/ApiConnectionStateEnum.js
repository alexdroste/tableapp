/**
 * Enum for connection state to api (backend).
 * @enum {number}
 * @property {number} DISCONNECTED
 * @property {number} TEMPORARILY_DISCONNECTED
 * @property {number} CONNECTED
 */
export const ApiConnectionStateEnum = Object.freeze({
    DISCONNECTED: 0,
    TEMPORARILY_DISCONNECTED: 1,
    CONNECTED: 2
});
