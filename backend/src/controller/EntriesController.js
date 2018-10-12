"use strict";
const statusCodes = require('http-status-codes');
const utils = require('../utils');


/**
 * Controller for entries.
 */
class EntriesController {
    /**
     * An entry object.
     * Containing non-general entry infos for a single user.
     * @typedef {object} EntriesController~Entry
     * @property {(string|null)} authorId user-id of author, null if entry was posted anonymously
     * @property {boolean} bookmark indicates if user bookmarked entry
     * @property {Array<string>} commentAttendingUserIds list of user-ids that attend discussion (comment-section)
     * @property {number} commentCount count of comments
     * @property {string} content text-content of entry
     * @property {boolean} follow indicates if user is following entry-updates
     * @property {Array<string>} imageIds list of (image-)ids of attached images
     * @property {boolean} liveAnswered indicates if entry was discussed in live situation 
     * @property {boolean} own indicates if user owns entry
     * @property {number} score score of the entry
     * @property {number} timestamp unix-timestamp in ms indicating submission date
     * @property {number} vote indicates user vote: 0 user did not vote, +1 user upvoted, -1 user downvoted entry
     */


    /**
     * Dictionary of entries.
     * 
     * dict[key] = value:
     * * key := id of entry
     * * value := {@link EntriesController~Entry}
     * @typedef {object} EntriesController~EntryDict
     */


    /**
     * An entryInfo object.
     * @typedef {object} EntriesController~EntryInfo
     * @property {ObjectID} _id id of entry
     * @property {number} [score] score of entry
     * @property {number} timestamp timestamp in ms of entry submission
     */


    /**
     * Initializes entries controller.
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
         * Registered onEntryUpdated callback.
         * @private
         * @type {(EntriesController~onEntryUpdatedCallback|null)}
         */
        this._onEntryUpdatedCallback = null;
    }
    // --------- Private ---------

    /**
     * Internal method that calls onEntryUpdated callback function.
     * @private
     * @function
     * @param {ObjectID} eventId id of event of updated entry
     * @param {ObjectID} entryId id of entry which has been updated
     */
    _onEntryUpdated(eventId, entryId) {
        if (!this._onEntryUpdatedCallback)
            return;
        this._onEntryUpdatedCallback(eventId, entryId);
    }
    

    // --------- Public ---------

    // events

    /**
     * Function called when an entry (of an event) has been updated.
     * @callback EntriesController~onEntryUpdatedCallback
     * @param {ObjectID} eventId id of event of updated entry
     * @param {ObjectID} entryId id of entry which has been updated
     */

    
    /**
     * Register callback that is called when an entry (of an event) has been updated.
     * @function
     * @param {EntriesController~onEntryUpdatedCallback} cb callback when an entry (of an event) has been updated
     */
    onEntryUpdated(cb) {
        this._onEntryUpdatedCallback = cb;
    }


    // methods

    /**
     * Change users bookmark state for a specific entry.
     * @async
     * @function
     * @param {ObjectID} eventId id of event
     * @param {ObjectID} entryId id of entry
     * @param {string} userId id of user
     * @param {boolean} bookmark true sets bookmark, false unsets
     * @returns {Promise} indicates success
     * @throws {Error} with message: 'entryId not found' with code NOT_FOUND if supplied entryId (for eventId) does not exist
     */
    async changeUserBookmark(eventId, entryId, userId, bookmark) {
        if (!eventId || !entryId || !userId || typeof bookmark !== 'boolean')
            throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

        const update = {};
        if (bookmark) {
            update.$addToSet = { bookmarks: userId };
        } else {
            update.$pull = { bookmarks: userId };
        }

        const res = await this._db.collection('entries')
            .updateOne({ _id: entryId, eventId }, update);
            
        if (res.result.ok !== 1)
            throw utils.createError('error changing user bookmark state for entry', statusCodes.INTERNAL_SERVER_ERROR);
        if (res.result.n < 1)
            throw utils.createError('entryId not found', statusCodes.NOT_FOUND);
        if (res.result.nModified > 0)
            this._onEntryUpdated(eventId, entryId);
    }


    /**
     * Change users follow state for a specific entry.
     * @async
     * @function
     * @param {ObjectID} eventId id of event
     * @param {ObjectID} entryId id of entry
     * @param {string} userId id of user
     * @param {boolean} follow true sets follow, false unsets
     * @returns {Promise} indicates success
     * @throws {Error} with message: 'entryId not found' with code NOT_FOUND if supplied entryId (for eventId) does not exist
     */
    async changeUserFollow(eventId, entryId, userId, follow) {
        if (!eventId || !entryId || !userId || typeof follow !== 'boolean')
            throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

        const update = {};
        if (follow) {
            update.$addToSet = { following: userId };
        } else {
            update.$pull = { following: userId };
        }

        const res = await this._db.collection('entries')
            .updateOne({ _id: entryId, eventId }, update);
            
        if (res.result.ok !== 1)
            throw utils.createError('error changing user follow state for entry', statusCodes.INTERNAL_SERVER_ERROR);
        if (res.result.n < 1)
            throw utils.createError('entryId not found', statusCodes.NOT_FOUND);
        if (res.result.nModified > 0)
            this._onEntryUpdated(eventId, entryId);
    }


    /**
     * Change a users voting for a specific entry.
     * @async
     * @function
     * @param {ObjectID} eventId id of event
     * @param {ObjectID} entryId id of entry
     * @param {string} userId id of user
     * @param {number} vote number representing vote (>0: upvote, 0: no vote, <0: downvote)
     * @returns {Promise} indicates success
     * @throws {Error} with message: 'entryId not found' with code NOT_FOUND if supplied entryId (for eventId) does not exist
     */
    async changeUserVote(eventId, entryId, userId, vote) { // IMPORTANT: set eventId by users activeEventId, to ensure sufficient rights
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

        const res = await this._db.collection('entries')
            .updateOne({ _id: entryId, eventId }, update);
            
        if (res.result.ok !== 1)
            throw utils.createError('error changing uservote for entry', statusCodes.INTERNAL_SERVER_ERROR);
        if (res.result.n < 1)
            throw utils.createError('entryId not found', statusCodes.NOT_FOUND);
        if (res.result.nModified > 0)
            this._onEntryUpdated(eventId, entryId);
    }


    /**
     * Retrieves entry info containing _id, score & timestamp
     * @async
     * @function
     * @param {ObjectID} eventId id of event
     * @param {ObjectID} entryId id of entry
     * @returns {Promise<EntriesController~EntryInfo>} resolve to object containing entries _id, score & timestamp
     * @throws {Error} with message: 'entryId not found' with code NOT_FOUND if supplied entryId (for eventId) does not exist
     */
    async getEntryInfo(eventId, entryId) {
        if (!eventId || !entryId)
            throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

        const entriesArr = await this._db.collection('entries').aggregate([
            { $match: { eventId, _id: entryId } },
            { $project: {
                score: { $subtract: [ { $size: "$upvotes" }, { $size: "$downvotes" } ] },
                timestamp: 1,
            } },
        ]).toArray();
        
        if (entriesArr.length < 1)
            throw utils.createError('entryId not found', statusCodes.NOT_FOUND);
        
        return entriesArr[0];
    }


    /**
     * Retrieves infos for entries in specified range (filter & sort).
     * @async
     * @function
     * @param {ObjectID} eventId id of event
     * @param {object} sort sorting-options for key supports "timestamp" & "score", e.g. { score: -1, timestamp: -1 }
     * @param {object} filter filter-options support: "bookmarkForUser", "minTimestamp", "maxTimestamp", "maxScore" & "excludedEntryIds"
     * @param {boolean} includeScore if true, resulting entries in array will contain score prop
     * @param {number} limit limits returned array range
     * @returns {Promise<Array<EntriesController~EntryInfo>>} resolves to object array containing entries: _id, timestamp & score (optional)
     */
    async getEntriesInfoRange(eventId, sort, filter, includeScore, limit) {
        if (!eventId || !sort || !filter || !limit)
            throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

        const match = { eventId };
        if (filter.bookmarkForUser)
            match.bookmarks = { $eq: filter.bookmarkForUser }; // single array element equals value
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

        const entriesArr = await this._db.collection('entries').aggregate([
            { $match: match },
            { $project: project },
            { $sort: sort },
            { $limit: limit },
        ]).toArray();
        
        return entriesArr;
    }


    /**
     * Query entries.
     * @async
     * @function
     * @param {ObjectID} eventId id of event
     * @param {string} userId id of user
     * @param {Array<ObjectID>} entryIds array of entry-ids to query
     * @returns {Promise<EntriesController~EntryDict>} resolves to dictionary of entries (for specified user)
     */
    async getEntries(eventId, userId, entryIds) {
        if (!eventId || !userId || !entryIds)
            throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);
        
        const entriesArr = await this._db.collection('entries').aggregate([
            { $match: { eventId, _id: { $in: entryIds } } },
            { $project: {
                authorId: 1, 
                bookmark: { $in: [ userId, "$bookmarks" ] },
                content: 1,
                follow: { $in: [ userId, "$following" ] },
                imageIds: 1,
                liveAnswered: 1,
                own: { $eq:  [ userId, "$postedById" ] },
                score: { $subtract: [ { $size: "$upvotes" }, { $size: "$downvotes" } ] },
                timestamp: 1,
                vote: { $cond: [ { $in: [ userId, "$upvotes" ] }, 1, { 
                    $cond: [ { $in: [ userId, "$downvotes"]}, -1, 0 ] 
                } ] },
            } }
        ]).toArray();

        const commentsArr = await this._db.collection('comments').aggregate([
            { $match: { eventId, entryId: { $in: entryIds } } },
            { $group : {
                _id: "$entryId",
                authorIds: { $push: "$authorId" },
                count: { $sum: 1 }
            } }
        ]).toArray();

        const comments = {};
        commentsArr.forEach((comment) => {
            comments[comment._id] = comment;
            delete comment._id;
        });

        const entryDict = {};
        entriesArr.forEach((entry) => {
            if (comments[entry._id]) {
                entry.commentAttendingUserIds = 
                    utils.filterArrayForNulledEntries(comments[entry._id].authorIds) || [];
                entry.commentCount = comments[entry._id].count;
            } else {
                entry.commentCount = 0;
            }
            entryDict[entry._id] = entry;
            delete entry._id;
        });
        return entryDict;
    }


    /**
     * Returns whether a user has set a bookmark on a specific entry.
     * @async
     * @function
     * @param {ObjectID} eventId id of event
     * @param {ObjectID} entryId id of entry
     * @param {string} userId id of user
     * @returns {Promise<boolean>} true if user bookmark is set
     * @throws {Error} with message: 'entryId not found' with code NOT_FOUND if supplied entryId (for eventId) does not exist
     */
    async hasUserBookmarkSetForEntry(eventId, entryId, userId) {
        if (!eventId || !entryId || !userId)
            throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

        const entriesArr = await this._db.collection('entries').aggregate([
            { $match: { eventId, _id: entryId } },
            { $project: {
                _id: 0,
                bookmark: { $in: [ userId, "$bookmarks" ] },
            } },
        ]).toArray();
        
        if (entriesArr.length < 1)
            throw utils.createError('entryId not found', statusCodes.NOT_FOUND);
        
        return entriesArr[0].bookmark;
    }


    /**
     * Insert new entry into db.
     * @async
     * @function
     * @param {ObjectID} eventId id of event
     * @param {string} userId id of user
     * @param {boolean} isAnonymous true if posting is anonymous, otherwise false
     * @param {string} content content of entry
     * @param {Array<string>} imageDataArr array of attached images (base64 encoded)
     * @returns {Promise} indicates success
     */
    async postEntry(eventId, userId, isAnonymous, content, imageDataArr) {
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
            const insertRes = await this._db.collection('images').insertMany(images);
            if (insertRes.result.ok !== 1)
                throw utils.createError('could not save images for new entry');
            imageIds = Object.values(insertRes.insertedIds);
        }

        const res = await this._db.collection('entries').insertOne({
            authorId: isAnonymous ? null : userId,
            bookmarks: [],
            content,
            downvotes: [],
            eventId,
            following: [],
            imageIds,
            liveAnswered: false,
            postedById: userId,
            timestamp: Date.now(),
            upvotes: [],
        });

        if (res.insertedCount < 1)
            throw utils.createError('entry could not be posted');
        
        this._onEntryUpdated(eventId, res.insertedId);
    }
}


module.exports = EntriesController;
