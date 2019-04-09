"use strict";

const broker = require('../broker');
const db = require('../db').db;
const utils = require('../utils');
var statusCodes = require('http-status-codes');


/**
 * Controller for entries.
 * @module entriesController
 */


/**
 * An entry object.
 * Containing non-general entry infos for a single user.
 * @typedef {object} Entry
 * @property {(string|null)} authorId user-id of author, null if entry was posted anonymously
 * @property {Array<string>} commentAttendingUserIds list of user-ids that attend discussion (comment-section)
 * @property {number} commentCount count of comments
 * @property {(string|null)} content text-content of entry
 * @property {Array<string>} imageIds list of (image-)ids of attached images
 * @property {boolean} isBookmarked indicates if user bookmarked entry
 * @property {boolean} isDeleted indicates if entry is deleted
 * @property {boolean} isFollowing indicates if user is following entry-updates
 * @property {boolean} isLiveAnswered indicates if entry was discussed in live situation 
 * @property {boolean} isOwn indicates if user owns entry
 * @property {number} score score of the entry
 * @property {number} timestamp unix-timestamp in ms indicating submission date
 * @property {number} vote indicates user vote: 0 user did not vote, +1 user upvoted, -1 user downvoted entry
 */


/**
 * Dictionary of entries.
 * 
 * dict[key] = value:
 * * key := id of entry
 * * value := {@link Entry} | null => null if non-existent
 * @typedef {object} EntryDict
 */


/**
 * An entryInfo object.
 * @typedef {object} EntryInfo
 * @property {ObjectID} _id id of entry
 * @property {boolean} [isDeleted] indicates if entry is deleted
 * @property {number} [score] score of entry
 * @property {number} timestamp timestamp in ms of entry submission
 */


// --------- Private ---------

/**
 * Internal method that trigger update handlers.
 * @private
 * @function
 * @param {ObjectID} eventId id of event of updated entry
 * @param {ObjectID} entryId id of entry which has been updated
 */
function _onEntryUpdated(eventId, entryId) {
    broker.handleEntryUpdated(eventId, entryId);
}


// --------- Public ---------

/**
 * Change users bookmark state for a specific entry.
 * @static
 * @async
 * @function
 * @param {ObjectID} eventId id of event
 * @param {ObjectID} entryId id of entry
 * @param {string} userId id of user
 * @param {boolean} bookmark true sets bookmark, false unsets
 * @returns {Promise} indicates success
 * @throws {Error} with message: 'entryId not found' with code NOT_FOUND if supplied entryId (for eventId) does not exist
 */
async function changeUserBookmark(eventId, entryId, userId, bookmark) {
    if (!eventId || !entryId || !userId || typeof bookmark !== 'boolean')
        throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

    const update = {};
    if (bookmark) {
        update.$addToSet = { bookmarks: userId };
    } else {
        update.$pull = { bookmarks: userId };
    }

    const res = await db().collection('entries')
        .updateOne({ _id: entryId, eventId }, update);
        
    if (res.result.ok !== 1)
        throw utils.createError('error changing user bookmark state for entry', statusCodes.INTERNAL_SERVER_ERROR);
    if (res.result.n < 1)
        throw utils.createError('entryId not found', statusCodes.NOT_FOUND);
    if (res.result.nModified > 0)
        _onEntryUpdated(eventId, entryId);
}
exports.changeUserBookmark = changeUserBookmark;


/**
 * Change users follow state for a specific entry.
 * @static
 * @async
 * @function
 * @param {ObjectID} eventId id of event
 * @param {ObjectID} entryId id of entry
 * @param {string} userId id of user
 * @param {boolean} follow true sets follow, false unsets
 * @returns {Promise} indicates success
 * @throws {Error} with message: 'entryId not found' with code NOT_FOUND if supplied entryId (for eventId) does not exist
 */
async function changeUserFollow(eventId, entryId, userId, follow) {
    if (!eventId || !entryId || !userId || typeof follow !== 'boolean')
        throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

    const update = {};
    if (follow) {
        update.$addToSet = { following: userId };
    } else {
        update.$pull = { following: userId };
    }

    const res = await db().collection('entries')
        .updateOne({ _id: entryId, eventId }, update);
        
    if (res.result.ok !== 1)
        throw utils.createError('error changing user follow state for entry', statusCodes.INTERNAL_SERVER_ERROR);
    if (res.result.n < 1)
        throw utils.createError('entryId not found', statusCodes.NOT_FOUND);
    if (res.result.nModified > 0)
        _onEntryUpdated(eventId, entryId);
}
exports.changeUserFollow = changeUserFollow;


/**
 * Change a users voting for a specific entry.
 * @static
 * @async
 * @function
 * @param {ObjectID} eventId id of event
 * @param {ObjectID} entryId id of entry
 * @param {string} userId id of user
 * @param {number} vote number representing vote (>0: upvote, 0: no vote, <0: downvote)
 * @returns {Promise} indicates success
 * @throws {Error} with message: 'entryId not found' with code NOT_FOUND if supplied entryId (for eventId) does not exist
 */
async function changeUserVote(eventId, entryId, userId, vote) { // IMPORTANT: set eventId by users activeEventId, to ensure sufficient rights
    if (!eventId || !entryId || !userId || vote == null)
        throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

    const update = {};
    if (vote > 0) {
        update.$addToSet = { upvotes: userId };
        update.$pull = { downvotes: userId };
    } else if (vote < 0) {
        update.$addToSet = { downvotes: userId };
        update.$pull = { upvotes: userId };
    } else {
        update.$pull = { upvotes: userId, downvotes: userId };
    }

    const res = await db().collection('entries')
        .updateOne({ _id: entryId, eventId }, update);
        
    if (res.result.ok !== 1)
        throw utils.createError('error changing uservote for entry', statusCodes.INTERNAL_SERVER_ERROR);
    if (res.result.n < 1)
        throw utils.createError('entryId not found', statusCodes.NOT_FOUND);
    if (res.result.nModified > 0)
        _onEntryUpdated(eventId, entryId);
}
exports.changeUserVote = changeUserVote;


/**
 * Mark an entry as deleted.
 * @static
 * @async
 * @function
 * @param {ObjectID} eventId id of event
 * @param {ObjectID} entryId id of entry
 * @returns {Promise} indicates success
 * @throws {Error} with message: 'entryId not found' with code NOT_FOUND if supplied entryId (for eventId) does not exist
 */
async function deleteEntry(eventId, entryId) {
    if (!eventId || !entryId)
        throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

    const res = await db().collection('entries')
        .updateOne({ _id: entryId, eventId }, 
            { $set: { 
                isDeleted: true 
            }});
        
    if (res.result.ok !== 1)
        throw utils.createError('error changing isDeleted for entry', statusCodes.INTERNAL_SERVER_ERROR);
    if (res.result.n < 1)
        throw utils.createError('entryId not found', statusCodes.NOT_FOUND);
    if (res.result.nModified > 0)
        _onEntryUpdated(eventId, entryId);
}
exports.deleteEntry = deleteEntry;


/**
 * Retrieves entry info containing _id, isDeleted, score & timestamp
 * @static
 * @async
 * @function
 * @param {ObjectID} eventId id of event
 * @param {ObjectID} entryId id of entry
 * @returns {Promise<EntriesController~EntryInfo>} resolve to object containing entries _id, isDeleted, score & timestamp
 * @throws {Error} with message: 'entryId not found' with code NOT_FOUND if supplied entryId (for eventId) does not exist
 */
async function getEntryInfo(eventId, entryId) {
    if (!eventId || !entryId)
        throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

    const entriesArr = await db().collection('entries').aggregate([
        { $match: { eventId, _id: entryId } },
        { $project: {
            isDeleted: 1,
            score: { $subtract: [ { $size: "$upvotes" }, { $size: "$downvotes" } ] },
            timestamp: 1,
        } },
    ]).toArray();
    
    if (entriesArr.length < 1)
        throw utils.createError('entryId not found', statusCodes.NOT_FOUND);
    
    return entriesArr[0];
}
exports.getEntryInfo = getEntryInfo;


/**
 * Retrieves infos for entries in specified range (filter & sort).
 * @static
 * @async
 * @function
 * @param {ObjectID} eventId id of event
 * @param {object} sort sorting-options for key supports "timestamp" & "score", e.g. { score: -1, timestamp: -1 }
 * @param {EntryListSubscription~SearchFilter} filter search-filter (see SearchFilter docs for possible properties)
 * @param {boolean} includeScore if true, resulting entries in array will contain score prop
 * @param {number} limit limits returned array range
 * @returns {Promise<Array<EntriesController~EntryInfo>>} resolves to object array containing entries: _id, timestamp & score (optional)
 */
async function getEntriesInfoRange(eventId, sort, filter, includeScore, limit) {
    if (!eventId || !sort || !filter || !limit)
        throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

    const match = { eventId };
    if (filter.bookmarkForUser)
        match.bookmarks = { $eq: filter.bookmarkForUser }; // single array element equals value
    if (filter.excludeDeletedEntries)
        match.isDeleted = false;
    if (filter.excludedEntryIds)
        match._id = { $nin: filter.excludedEntryIds };
    if (filter.maxTimestamp)
        match.timestamp = { $lte: filter.maxTimestamp };
    if (filter.minTimestamp)
        match.timestamp = { $gte: filter.minTimestamp, ...match.timestamp };
    if (filter.maxScore)
        match.score = { $lte: filter.maxScore };

    const project = { timestamp: 1 };
    if (includeScore)
        project.score = { $subtract: [ { $size: "$upvotes" }, { $size: "$downvotes" } ] };            

    const entriesArr = await db().collection('entries').aggregate([
        { $match: match },
        { $project: project },
        { $sort: sort },
        { $limit: limit },
    ]).toArray();
    
    return entriesArr;
}
exports.getEntriesInfoRange = getEntriesInfoRange;


/**
 * Query entries.
 * 
 * If an entry is deleted (isDeleted == true), its authorId & content props
 * will be returned as 'null' and imageIds will be '[]'.
 * @static
 * @async
 * @function
 * @param {ObjectID} eventId id of event
 * @param {string} userId id of user
 * @param {Array<ObjectID>} entryIds array of entry-ids to query
 * @returns {Promise<EntriesController~EntryDict>} resolves to dictionary of entries (for specified user)
 */
async function getEntries(eventId, userId, entryIds) {
    if (!eventId || !userId || !entryIds)
        throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);
    
    const entriesArr = await db().collection('entries').aggregate([
        { $match: { eventId, _id: { $in: entryIds } } },
        { $project: {
            authorId: 1, 
            content: 1,
            extraQuestions: 1, // extra-code for prompts
            imageIds: 1,
            isDeleted: 1,
            isBookmarked: { $in: [ userId, "$bookmarks" ] },
            isFollowing: { $in: [ userId, "$following" ] },
            isLiveAnswered: 1,
            isOwn: { $eq:  [ userId, "$postedById" ] },
            score: { $subtract: [ { $size: "$upvotes" }, { $size: "$downvotes" } ] },
            timestamp: 1,
            vote: { $cond: [ { $in: [ userId, "$upvotes" ] }, 1, { 
                $cond: [ { $in: [ userId, "$downvotes"]}, -1, 0 ] 
            } ] },
        } }
    ]).toArray();

    // query authorIds of comments + comment-count for each entry
    // and DO NOT INCLUDE deleted entries
    const commentsArr = await db().collection('comments').aggregate([
        { $match: { 
            eventId, 
            entryId: { $in: entryIds },
            isDeleted: false
        } },
        { $group : {
            _id: "$entryId",
            authorIds: { $push: "$authorId" },
            count: { $sum: 1 }
        } }
    ]).toArray();

    // dict of comment-infos (authorIds & count) with entryId as key
    const comments = {};
    commentsArr.forEach((comment) => {
        comments[comment._id] = comment;
        delete comment._id;
    });

    const entryDict = {};
    // make sure that missing entryIds are null objects
    entryIds.forEach(id => {
        entryDict[id] = null;
    });
    entriesArr.forEach((entry) => {
        // hide content & authorId if entry is deleted
        if (entry.isDeleted) {
            entry.authorId = null;
            entry.content = null;
            entry.extraQuestions = []; // extra-code for prompts
            entry.imageIds = [];
        }
        // properly set commentAttendingUserIds & commentCount
        if (comments[entry._id]) {
            entry.commentAttendingUserIds = 
                utils.filterArrayForNulledEntries(comments[entry._id].authorIds) || [];
            entry.commentCount = comments[entry._id].count;
        } else {
            entry.commentAttendingUserIds = [];
            entry.commentCount = 0;
        }
        entryDict[entry._id] = entry;
        delete entry._id;
    });
    return entryDict;
}
exports.getEntries = getEntries;


/**
 * Returns whether a user has set a bookmark on a specific entry.
 * @static
 * @async
 * @function
 * @param {ObjectID} eventId id of event
 * @param {ObjectID} entryId id of entry
 * @param {string} userId id of user
 * @returns {Promise<boolean>} true if user bookmark is set
 * @throws {Error} with message: 'entryId not found' with code NOT_FOUND if supplied entryId (for eventId) does not exist
 */
async function hasUserBookmarkSetForEntry(eventId, entryId, userId) {
    if (!eventId || !entryId || !userId)
        throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

    const entriesArr = await db().collection('entries').aggregate([
        { $match: { eventId, _id: entryId } },
        { $project: {
            _id: 0,
            isBookmarked: { $in: [ userId, "$bookmarks" ] },
        } },
    ]).toArray();
    
    if (entriesArr.length < 1)
        throw utils.createError('entryId not found', statusCodes.NOT_FOUND);
    
    return entriesArr[0].isBookmarked;
}
exports.hasUserBookmarkSetForEntry = hasUserBookmarkSetForEntry;


/**
 * Insert new entry into db.
 * @static
 * @async
 * @function
 * @param {ObjectID} eventId id of event
 * @param {string} userId id of user
 * @param {boolean} isAnonymous true if posting is anonymous, otherwise false
 * @param {string} content content of entry
 * @param {Array<string>} imageDataArr array of attached images (base64 encoded)
 * @param {Array<string>} extraQuestions array of extra questions to attach (prompts)
 * @returns {Promise<ObjectID>} resolves to ObjectID of inserted entry
 */
async function postEntry(eventId, userId, isAnonymous, content, imageDataArr, extraQuestions = []) { // extra-code for prompts
    if (!eventId || !userId || isAnonymous == null || !content || !imageDataArr)
        throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);
    
    let imageIds = [];
    if (imageDataArr.length) {
        const images = [];
        for (let i = 0; i < imageDataArr.length; ++i)
            images.push({
                data: imageDataArr[i],
                thumbnail: await utils.createThumbnailFromBase64Image(imageDataArr[i])
            });
        const insertRes = await db().collection('images').insertMany(images);
        if (insertRes.result.ok !== 1)
            throw utils.createError('could not save images for new entry');
        imageIds = Object.values(insertRes.insertedIds);
    }

    const res = await db().collection('entries').insertOne({
        authorId: isAnonymous ? null : userId,
        bookmarks: [],
        content,
        downvotes: [],
        eventId,
        extraQuestions, // extra-code for prompts
        following: [],
        imageIds,
        isDeleted: false,
        isLiveAnswered: false,
        postedById: userId,
        timestamp: Date.now(),
        upvotes: [],
    });

    if (res.insertedCount < 1)
        throw utils.createError('entry could not be posted');
    
    _onEntryUpdated(eventId, res.insertedId);
    return res.insertedId;
}
exports.postEntry = postEntry;
