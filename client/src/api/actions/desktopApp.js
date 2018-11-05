/**
 * API-call: broadcast new image data.
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @param {string} imageData base64 image-data of full image
 * @returns {Promise} indicates success
 */
export function broadcastNewImage(api, imageData) {
    return api.request('desktopApp/broadcastNewImage', { imageData });
}
