/**
 * Controller for images.
 */
class ImagesController {
    /**
     * Initializes images controller.
     * @param {object} dbConnection mongodb database connection
     */
    constructor(dbConnection) {
        /**
         * Database connection that is beeing used.
         * @private
         * @type {object}
         */
        this._db = dbConnection;      
    }


    // methods

    /**
     * Dictionary of images.
     * 
     * dict[key] = value:
     * * key := id of image 
     * * value := image-data (base64)
     * @typedef {object} ImagesController~ImageDict
     */


    /**
     * Dictionary of thumbnails.
     * 
     * dict[key] = value:
     * * key := id of image 
     * * value := thumbnail-data (base64)
     * @typedef {object} ImagesController~ThumbnailDict
     */


    /**
     * Result of getImages call.
     * @typedef {object} ImagesController~GetImagesResult
     * @property {ImagesController~ImageDict} imageDict dictionary of images
     * @property {ImagesController~ThumbnailDict} thumbnailDict dictionary of thumbnails 
     */


    /**
     * Retrieve image- and/or thumbnail-data from specified images by their ids.
     * @async
     * @function
     * @param {Array<ObjectID>} imageIds array of ids of images to retrieve
     * @param {boolean} [onlyThumbnails=false] indicates if only the thumbnails should be queried
     * @returns {Promise<ImagesController~GetImagesResult>} resolves to an object containing an imageDict and thumbnailDict property, if onlyThumbnails is set imageDict will be an empty object
     */
    async getImages(imageIds, onlyThumbnails = false) {
        if (!imageIds)
            throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

        const project = { _id: 1, thumbnail: 1 };
        if (!onlyThumbnails)
            project.data = 1;

        const imagesArr = await this._db.collection('images')
            .find({ _id: { $in: imageIds } })
            .project(project)
            .toArray();

        const imageDict = {};
        const thumbnailDict = {};
        imagesArr.forEach((img) => {
            thumbnailDict[img._id] = img.thumbnail;
            if (!onlyThumbnails)
                imageDict[img._id] = img.data;
        });
        return {
            imageDict,
            thumbnailDict,
        };
    }
}


module.exports = ImagesController;
