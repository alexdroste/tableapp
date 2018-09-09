const childProcess = require('child_process');
const path = require('path');


/**
 * Retrieve quartz windowId of active window.
 * Relies on external binary. 
 * @async
 * @function
 * @returns {Promise<string>} windowId of active window
 */
function getActiveWindowID() {
    return new Promise((resolve, reject) => {
        const getIdProcess = childProcess
            .spawn(path.join(__dirname, "bin", "getActiveWindowID").replace('app.asar', 'app.asar.unpacked'));

        let activeWindowId = null;

        getIdProcess.stdout.on('data', (data) => {
            activeWindowId = data.toString().trim();
        });

        getIdProcess.on('close', () => {
            if (!activeWindowId)
                return reject();
            return resolve(activeWindowId);
        });
    });
}


/**
 * Performs a screencapture of window with windowId on darwin / mac.
 * Relies on external binary.
 * @async
 * @function
 * @param {string} windowId id of (quartz) window to capture
 * @param {string} output specify output path
 * @returns {Promise}
 */
function captureWindow(windowId, output) {
    return new Promise((resolve, reject) => {
        const cmd = "screencapture";
        const args = [
            "-x", // silently
            "-o", // no shadow
            "-l", // window with specific id
            windowId,
            output
        ];

        const captureProcess = childProcess.spawn(cmd, args);

        captureProcess.on('close', (error) => {
            resolve();
        });

        captureProcess.stderr.on('data', (data) => {
            reject(data.toString());
        })
    });
}


/**
 * Creates screencapture of active window on darwin / mac.
 * Relies on external binary.
 * @name capture
 * @async
 * @function
 * @param {string} output specify output path
 * @returns {Promise}
 */
module.exports = async function(output) {
    const activeWindowId = await getActiveWindowID();
    await captureWindow(activeWindowId, output);
};