const Jimp = require('jimp');
const screenshot = require('./screenshot/index');
const config = require('./config');


/**
 * Broadcast class can be used to schedule interval based screenshots.
 */
class Broadcast {
    constructor() {
        /**
         * Id of interval started by start function.
         * @private
         * @type {(number|null)}
         */
        this._interval = null;
        /**
         * Image data of previous processed image.
         * @private
         * @type {(JimpImage|null)}
         */
        this._lastImg = null;
        /**
         * Registered onNewImage callback.
         * @private
         * @type {(Broadcast~onNewImageCallback|null)}
         */
        this._onNewImageCallback = null;
    }


    /**
     * Async internal method that calls onNewImage callback function,
     * converting the JimpImage to base64.
     * @private
     * @async
     * @function
     * @param {JimpImage} img 
     * @returns {Promise}
     */
    async _onNewImage(img) {
        try {
            if (!this._onNewImageCallback)
                return;
            this._onNewImageCallback(await screenshot.imageToBase64(img));
        } catch (err) {
            console.error(err);
        }
    }


    /**
     * Function called when new image was captured.
     * @callback Broadcast~onNewImageCallback
     * @param {string} img image as base64
     */

    /**
     * Register callback for new image.
     * @function
     * @param {Broadcast~onNewImageCallback} cb callback if new image was created
     */
    onNewImage(cb) {
        this._onNewImageCallback = cb;
    }


    /**
     * Starts interval based screencapture.
     * Checks for differences between pictures and omits duplicates.
     * @function
     */
    start() {
        this.stop();
        this._interval = setInterval(async () => {
            try { 
                // do screenshot and compare with last one
                const img = await screenshot.capture();

                if (this._lastImg) {
                    // const distance = Jimp.distance(img, this._lastImg); // perceived distance
                    const diff = Jimp.diff(img, this._lastImg);         // pixel difference

                    // TODO tune tresholds
                    if (/*distance < 0.15 ||*/ diff.percent < 0.025) {
                        // if images match do nothing
                        return;
                    }
                }

                this._lastImg = img;
                this._onNewImage(img);
            } catch (err) {
                console.error(err);
            }
        }, config.broadcastImageInterval);
    };


    /**
     * Stops interval based screencapture.
     * @function
     */
    stop() {
        clearInterval(this._interval);
        this._interval = null;
    }
}


module.exports = Broadcast;
