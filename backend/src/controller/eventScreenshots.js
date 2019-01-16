"use strict";

const broker = require('../broker');
const config = require('../config');
const db = require('../db').db;
const statusCodes = require('http-status-codes');
const utils = require('../utils');


/**
 * Controller for user-data.
 * @module eventScreenshotscontroller
 */


// --------- Private ---------

/**
 * Internal method that triggers update handlers.
 * @private
 * @function
 * @param {ObjectID} eventId id of event which screenshots have been updated
 */
function _onEventScreenshotsUpdated(eventId) {
    broker.handleEventScreenshotsUpdated(eventId);
}


// --------- Public ---------

/**
 * Adds a screenshot for an event.
 * Thumbnails are generated automagically.
 * @static
 * @async
 * @function
 * @param {ObjectID} eventId id of event
 * @param {string} imageData base64 image-data of full image
 * @returns {Promise} indicates success
 */
async function addImageForEvent(eventId, imageData) {
    if (!eventId || !imageData)
        throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

    const insertRes = await db().collection('images').insertOne({
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

    const esArr = await db().collection('eventscreenshots')
        .find({ _id: eventId })
        .toArray();
    
    if (esArr.length) {
        doc.imageIds = esArr[0].imageIds;
    }

    doc.imageIds.push(insertRes.insertedId);
    if (doc.imageIds.length > config.eventScreenshots.saveLastCount) {
        const del = doc.imageIds.splice(0, 1);
        const delRes = await db().collection('images').deleteOne({_id: del[0]});
        if (delRes.deletedCount < 1)
            console.error('DATA CORRUPTION: could not delete image with id', del[0]);
    }

    const res = await db().collection('eventscreenshots').updateOne(
        { _id: eventId },
        { $set: doc },
        { upsert: true },
    );
    if (res.result.ok !== 1 || res.result.n < 1)
        throw utils.createError('DATA CORRUPTION: could not update eventscreenshots, new imageId: ' + insertRes.insertedId.toString(), statusCodes.INTERNAL_SERVER_ERROR);
    _onEventScreenshotsUpdated(eventId);
}
exports.addImageForEvent = addImageForEvent;


/**
 * Retrieve (image-)ids of screenshots for a specified event.
 * @static
 * @async
 * @function
 * @param {ObjectID} eventId id of event
 * @returns {Promise<Array<ObjectID>>} resolves to array of image-ids
 */
async function getScreenshotIdsForEvent(eventId) {
    if (!eventId)
        throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

    const esArr = await db().collection('eventscreenshots')
        .find({ _id: eventId })
        .toArray();

    if (esArr.length < 1)
        return [];

    if (esArr[0].lastUpdate < Date.now() - 1000 * 60 * config.eventScreenshots.keepForMinutesAfterLastUpdate) {
        const delRes = await db().collection('eventscreenshots')
            .deleteOne({ _id: eventId });
        if (delRes.deletedCount < 1)
            console.error('DATA CORRUPTION: could not delete eventscreenshots entry with id', esArr[0]._id);
        const delImagesRes = await db().collection('images')
            .deleteMany({ _id: { $in: esArr[0].imageIds }});
        if (delImagesRes.deletedCount !== esArr[0].imageIds.length)
            console.error('DATA CORRUPTION: could not delete images', esArr[0].imageIds);
        return [];
    }
    return esArr[0].imageIds;
}
exports.getScreenshotIdsForEvent = getScreenshotIdsForEvent;


// async getThumbnailsForEvent(eventId) {
//     try {
//         if (!eventId)
//             throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

//         const esArr = await db().collection('eventscreenshots')
//             .find({ _id: eventId })
//             .toArray();

//         if (esArr.length < 1)
//             throw utils.createError('could not find eventscreenshots for eventId', statusCodes.NOT_FOUND);

//         const imgArr = await db().collection('images')
//             .find({ _id: { $in: esArr[0].imageIds } })
//             .project({ thumbnail: 1 })
//             .toArray();

//         return imgArr.map((elem) => elem.thumbnail);
//     } catch (err) {
//         console.error(err);
//         throw err;
//     }
// }
