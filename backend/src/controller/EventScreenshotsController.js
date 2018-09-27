const statusCodes = require('http-status-codes');
const config = require('../config');
const utils = require('../utils');


/**
 * Controller for event screenshots.
 */
class EventScreenshotsController {
    /**
     * Initializes event screenshots controller.
     * @param {object} dbConnection mongodb database connection
     */
    constructor(dbConnection) {
        /**
         * Database connection that is beeing used.
         * @private
         * @type {object}
         */
        this._db = dbConnection;      

        /**
         * Registered onEventScreenshotsUpdated callback.
         * @private
         * @type {(EventScreenshotsController~onEventScreenshotsUpdatedCallback|null)}
         */
        this._onEventScreenshotsUpdatedCallback = null;
    }


    // --------- Private ---------
    
    /**
     * Internal method that calls onEventScreenshotsUpdated callback function.
     * @private
     * @function
     * @param {ObjectID} eventId id of event which screenshots have been updated
     */
    _onEventScreenshotsUpdated(eventId) {
        if (!this._onEventScreenshotsUpdatedCallback)
            return;

        this._onEventScreenshotsUpdatedCallback(eventId);
    }
    

    // --------- Public ---------

    // events

    /**
     * Function called when an events screenshots have been updated.
     * @callback EventScreenshotsController~onEventScreenshotsUpdatedCallback
     * @param {ObjectID} eventId id of event which screenshots have been updated
     */

    
    /**
     * Register callback for event screenshots have been updated.
     * @function
     * @param {EventScreenshotsController~onEventScreenshotsUpdatedCallback} cb callback when screenshots have been updated
     */
    onEventScreenshotsUpdated(cb) {
        this._onEventScreenshotsUpdatedCallback = cb;
    }


    // methods

    /**
     * Adds a screenshot for an event.
     * Thumbnails are generated automagically.
     * @async
     * @function
     * @param {ObjectID} eventId id of event
     * @param {string} imageData base64 image-data of full image
     * @returns {Promise} indicates success
     */
    async addImageForEvent(eventId, imageData) {
        if (!eventId || !imageData)
            throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

        const insertRes = await this._db.collection('images').insertOne({
            data: imageData,
            thumbnail: await utils.createThumbnailFromBase64Image(imageData)
        });

        if (insertRes.insertedCount < 1)
            throw utils.createError('image could not be saved');
        
        const doc = {
            _id: eventId,
            imageIds: [],
            lastUpdate: Date.now(),
        };

        const esArr = await this._db.collection('eventscreenshots')
            .find({ _id: eventId })
            .toArray();
        
        if (esArr.length) {
            doc.imageIds = esArr[0].imageIds;
        }

        doc.imageIds.push(insertRes.insertedId);
        if (doc.imageIds.length > config.eventScreenshots.saveLastCount) {
            const del = doc.imageIds.splice(0, 1);
            const delRes = await this._db.collection('images').deleteOne({_id: del[0]});
            if (delRes.deletedCount < 1)
                console.error('DATA CORRUPTION: could not delete image with id', del[0]);
        }

        const res = await this._db.collection('eventscreenshots').updateOne(
            { _id: eventId },
            { $set: doc },
            { upsert: true },
        );
        if (res.result.ok !== 1 || res.result.n < 1)
            throw utils.createError('DATA CORRUPTION: could not update eventscreenshots, new imageId: ' + insertRes.insertedId.toString(), statusCodes.INTERNAL_SERVER_ERROR);
        this._onEventScreenshotsUpdated(eventId);
    }


    /**
     * Retrieve (image-)ids of screenshots for a specified event.
     * @async
     * @function
     * @param {ObjectID} eventId id of event
     * @returns {Promise<Array<ObjectID>>} resolves to array of image-ids
     */
    async getScreenshotIdsForEvent(eventId) {
        if (!eventId)
            throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

        const esArr = await this._db.collection('eventscreenshots')
            .find({ _id: eventId })
            .toArray();

        if (esArr.length < 1)
            return [];

        if (esArr[0].lastUpdate < Date.now() - 1000 * 60 * config.eventScreenshots.keepForMinutesAfterLastUpdate) {
            const delRes = await this._db.collection('eventscreenshots')
                .deleteOne({ _id: eventId });
            if (delRes.deletedCount < 1)
                console.error('DATA CORRUPTION: could not delete eventscreenshots entry with id', esArr[0]._id);
            const delImagesRes = await this._db.collection('images')
                .deleteMany({ _id: { $in: esArr[0].imageIds }});
            if (delImagesRes.deletedCount !== esArr[0].imageIds.length)
                console.error('DATA CORRUPTION: could not delete images', esArr[0].imageIds);
            return [];
        }
        return esArr[0].imageIds;
    }


    // async getThumbnailsForEvent(eventId) {
    //     try {
    //         if (!eventId)
    //             throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

    //         const esArr = await this._db.collection('eventscreenshots')
    //             .find({ _id: eventId })
    //             .toArray();

    //         if (esArr.length < 1)
    //             throw utils.createError('could not find eventscreenshots for eventId', statusCodes.NOT_FOUND);

    //         const imgArr = await this._db.collection('images')
    //             .find({ _id: { $in: esArr[0].imageIds } })
    //             .project({ thumbnail: 1 })
    //             .toArray();

    //         return imgArr.map((elem) => elem.thumbnail);
    //     } catch (err) {
    //         console.error(err);
    //         throw err;
    //     }
    // }
}


module.exports = EventScreenshotsController;

