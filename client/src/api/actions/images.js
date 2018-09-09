/**
 * @typedef {object} LoadImagesResult
 * @property {ImageDict} imageDict dictionary of images
 * @property {ThumbnailDict} thumbnailDict dictionary of thumbnails 
 */


/**
 * API-call: load images (and/or thumbnails) (by imageIds).
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @param {Array<string>} imageIds array of imageIds to load
 * @param {boolean} onlyThumbnails indicates if only the thumbnails should be queried
 * @returns {Promise<LoadImagesResult>} resolves to object containing image and thumbnaildata
 */
export function loadImages(api, imageIds, onlyThumbnails) {
    return api.request('images/loadImages', { imageIds, onlyThumbnails });
}
