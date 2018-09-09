// Load custom configuration
let custom = {};
try { custom = require('./config.custom.js') } 
catch (e) { console.log('Default configuration loaded.'); }


/**
 * Configuration values.
 */
const config = {
    /** 
     * Interval in ms for capturing screenshots in Broadcast module. 
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
    ...custom
};

module.exports = config;
