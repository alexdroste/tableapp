// Load custom configuration
let custom = {};
try { custom = require('./config.custom.js').config } 
catch (e) { console.log('Using default configuration. No overrides were defined.'); }
const {api, desktopApp, ...rest} = custom;


/**
 * Configuration values.
 */
export const config = {
    /**
     * API config values.
     */
    api: {
        /**
         * Timeout in ms for api disconnect.
         * Defaults to 15000.
         * @type {number}
         */
        disconnectTimeout: 15000,
        /**
         * Timeout in ms for a single api request.
         * Defaults to 30000.
         * @type {number}
         */
        requestTimeout: 30000,
        /**
         * URL to Websocket-API.
         * Defaults to localhost:4898.
         * @type {string}
         */
        socketUrl: 'http://localhost:4898',
        ...api
    },
    /**
     * Config values used in desktop app.
     */
    desktopApp: {
        /** 
         * Interval in ms for capturing screenshots during broadcast. 
         * Defaults to 15000.
         * @type {number}
         */
        broadcastImageInterval: 15000,
        /** 
         * Max. width or height of captured screenshot in px. 
         * If screenshot is too large, it will be scaled down til width and height
         * are less or equal to the specified value.
         * Defaults to 1200.
         * @type {number}
         */
        screenshotMaxRes: 1200, // 1200px width or height
        ...desktopApp
    },
    /**
     * Base-URL of client. Needs to end with a slash.
     * Defaults to localhost:3000.
     * @type {string}
     */
    baseUrl: 'http://localhost:3000/',
    /**
     * Maximum resolution (width or height) in px for an attached image.
     * Larger pictures get resized to this value.
     * Defaults to 1200.
     * @type {number}
     */
    inputImageMaxRes: 1200,
    /**
     * Time intervall in ms that state-save operations 
     * (save state to localStorage) can be performed at max rate.  
     * Defaults to 500.
     * @type {number}
     */
    saveStateDebounceTime: 500,
    ...rest
};
