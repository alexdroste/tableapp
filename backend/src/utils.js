const config = require('./config');
const statusCodes = require('http-status-codes');
const jwt = require('jsonwebtoken');
const Jimp = require('jimp');


/**
 * Creates a new Error object with a custom statusCode attribute
 * @function
 * @param {string} msg error-message
 * @param {(number|string)} [statusCode=500] statusCode property, defaults to internal server error (500)
 * @returns {Error} error object with additional property .statusCode
 */
function createError(msg, statusCode = statusCodes.INTERNAL_SERVER_ERROR) {
    const err = new Error(msg);
    err.statusCode = statusCode;
    return err;
};
module.exports.createError = createError;


/**
 * A sessionTokens payload.
 * @typedef {object} SessionTokenPayload
 * @property {string} dn users DN
 * @property {number} iat timestamp token was issued
 * @property {number} exp timestamp when token expires
 */


/**
 * Creates a sessionToken.
 * @function
 * @param {string} dn dn of user
 * @returns {string} signed jwt (JSON Web Token), containing payload (see {@link SessionTokenPayload})
 */
function createSessionToken(dn) {
    const options = {
        algorithm: 'HS512',
        expiresIn: config.sessionToken.validFor,
    };
    return jwt.sign({
        dn
    }, config.sessionToken.privateKey, options);
}
module.exports.createSessionToken = createSessionToken;


/**
 * Creates a thumbnail (as base64) from a full image (as base64).
 * @async
 * @function
 * @param {string} base64Image full image as base64 to create thumbnail from
 * @returns {Promise<string>} Resolves to base64 thumbnail
 */
async function createThumbnailFromBase64Image(base64Image) {
    async function imageToBase64(img) {
        return new Promise((resolve, reject) => {
            img.getBase64(Jimp.MIME_PNG, (err, data) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    }

    const img = await Jimp.read(Buffer.from(base64Image.replace(/^data:image\/png;base64,/, ""), 'base64'));
    img.cover(80, 80);
    return await imageToBase64(img);
}
module.exports.createThumbnailFromBase64Image = createThumbnailFromBase64Image;


/**
 * Filters and returns new array without falsy elements like null, undefined or "".
 * @function
 * @param {Array} arr array to filter
 * @returns {Array} new filtered array
 */
function filterArrayForNulledEntries(arr) {
    return arr.filter(element => element);
}
module.exports.filterArrayForNulledEntries = filterArrayForNulledEntries;


/**
 * Compare function interface.
 * @callback compareFunction
 * @param {*} a 
 * @param {*} b
 * @returns {number} <0: a comes before b, 0: a and b are of equal value, >0: b comes before a
 */


/**
 * In-place insertion-sort.
 * @function
 * @param {Array} array array to sort
 * @param {compareFunction} compareFunc function to compare elements in array, >0 means b comes before a
 */
function insertionSort(array, compareFunc) {
    for(var i = 0; i < array.length; i++) {
        var temp = array[i];
        var j = i - 1;
        while (j >= 0 && compareFunc(array[j], temp) > 0) {
            array[j + 1] = array[j];
            j--;
        }
        array[j + 1] = temp;
    }
    return array;
}
module.exports.insertionSort = insertionSort;


/**
 * Determines if current instance runs in development mode. (NODE_ENV)
 * @function
 * @returns {boolean} true if NODE_ENV is not set to 'production'
 */
function isAppInDevelopmentMode() {
    return process.env.NODE_ENV !== "production";
}
module.exports.isAppInDevelopmentMode = isAppInDevelopmentMode;


/**
 * Removes nulled properties from an object.
 * @function
 * @param {object} obj 
 */
function removeNulledPropertiesFromObject(obj) {
    Object.keys(obj).forEach((key) => (obj[key] == null) && delete obj[key]);
};
module.exports.removeNulledPropertiesFromObject = removeNulledPropertiesFromObject;


/**
 * Verifies and decodes sessionToken.
 * @function
 * @param {string} sessionToken signed jwt
 * @returns {SessionTokenPayload} decoded sessionToken (payload)
 * @throws {Error} with message 'jwt expired' if token expired
 * @throws {Error} with message 'jwt malformed' if supplied sessionToken is not a jwt
 */
function verifySessionToken(sessionToken) {
    const options = {
        algorithms: ['HS512'],
    };
    return jwt.verify(sessionToken, config.sessionToken.privateKey, options);
}
module.exports.verifySessionToken = verifySessionToken;
