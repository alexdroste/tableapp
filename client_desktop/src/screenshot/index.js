const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const darwin = require('./darwin');
const config = require('../config');


/**
 * Generates uuid.
 * @function
 * @returns {string} uuid
 */
function uniqueId() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}


/**
 * Converts a jimp image to base64.
 * @async
 * @function
 * @param {JimpImage} img image returned by jimp
 * @returns {Promise<string>} resolves to base64 image
 */
async function imageToBase64(img) {
    return new Promise((resolve, reject) => {
        img.getBase64(Jimp.MIME_PNG, (err, data) => {
            if (err)
                reject(err);
            resolve(data);
        });
    });
}
module.exports.imageToBase64 = imageToBase64;
    

/**
 * Performs a screencapture of the active window.
 * @async
 * @function
 * @returns {Promise<JimpImage>} resolves to a jimp image
 */
async function capture() {
    const output = path.join(__dirname, uniqueId() + ".png").replace('app.asar', 'app.asar.unpacked');

    try {
        switch (process.platform) {
            case "darwin":
                await darwin(output);
                break;
            default:
                console.log("unsupported platform");
                break;
        }

        const img = await Jimp.read(output);
        // limit max height/width to screenshotMaxRes (e.g. 1200px) but keep aspect ratio
        if (img.bitmap.width > config.screenshotMaxRes || img.bitmap.height > config.screenshotMaxRes) {
            if (img.bitmap.width > img.bitmap.height)
                img.resize(config.screenshotMaxRes, Jimp.AUTO);
            else
                img.resize(Jimp.AUTO, config.screenshotMaxRes);
        }
        img.rgba(false);
        img.filterType(Jimp.PNG_FILTER_AUTO);
        fs.unlinkSync(output);
        return img;
    } catch (err) {
        console.error('could not perform screen capture:', err);
        return null;
    }
};
module.exports.capture = capture;
