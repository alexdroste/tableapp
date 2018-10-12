"use strict";
var statusCodes = require('http-status-codes');
const utils = require('../utils');


/**
 * Controller for comments.
 */
class CommentsController {
    /**
     * A comment object.
     * Containing non-general comment infos for a single user.
     * @typedef {object} CommentsController~Comment
     * @property {(string|null)} authorId user-id of author, null if comment was posted anonymously
     * @property {string} content text-content of comment
     * @property {Array<string>} imageIds list of (image-)ids of attached images
     * @property {boolean} own indicates if user owns comment
     * @property {(string|null)} parentId (comment-)id of parent comment (id of comment this comment is subordinate), null if comment is a top-level comment 
     * @property {number} score score of the comment
     * @property {number} timestamp unix-timestamp in ms indicating submission date
     * @property {number} vote indicates user vote: 0 user did not vote, +1 user upvoted, -1 user downvoted comment
     */


    /**
     * Dictionary of comments.
     * 
     * dict[key] = value:
     * * key := id of comment
     * * value := {@link CommentsController~Comment}
     * @typedef {object} CommentsController~CommentDict
     */


    /**
     * Initializes comments controller.
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
         * Registered onCommentUpdated callback.
         * @private
         * @type {(CommentsController~onCommentUpdatedCallback|null)}
         */
        this._onCommentUpdatedCallback = null;
    }
    // --------- Private ---------

    /**
     * Internal method that calls onCommentUpdated callback function.
     * @private
     * @function
     * @param {ObjectID} eventId id of event of updated comment
     * @param {ObjectID} entryId id of entry of updated comment
     * @param {ObjectID} commentId id of comment which has been updated
     * @param {boolean} affectsEntryMetadata indicates if update of comment affects metadata of the superordinate entry
     */
    _onCommentUpdated(eventId, entryId, commentId, affectsEntryMetadata) {
        if (!this._onCommentUpdatedCallback)
            return;
        this._onCommentUpdatedCallback(eventId, entryId, commentId, affectsEntryMetadata);
    }
    

    // --------- Public ---------

    // events

    /**
     * Function called when a comment (of an entry) has been updated.
     * @callback CommentsController~onCommentUpdatedCallback
     * @param {ObjectID} eventId id of event of updated comment
     * @param {ObjectID} entryId id of entry of updated comment
     * @param {ObjectID} commentId id of comment which has been updated
     * @param {boolean} affectsEntryMetadata indicates if update of comment affects metadata of the superordinate entry
     */

    
    /**
     * Register callback that is called when a comment (of an entry) has been updated.
     * @function
     * @param {CommentsController~onCommentUpdatedCallback} cb callback when a comment (of an entry) has been updated
     */
    onCommentUpdated(cb) {
        this._onCommentUpdatedCallback = cb;
    }


    // methods

    /**
     * Change a users voting for a specific comment.
     * @async
     * @function
     * @param {ObjectID} eventId id of event
     * @param {ObjectID} entryId id of entry
     * @param {ObjectID} commentId id of comment
     * @param {string} userId id of user
     * @param {number} vote number representing vote (>0: upvote, 0: no vote, <0: downvote)
     * @returns {Promise} indicates success
     * @throws {Error} with message: 'commentId not found' with code NOT_FOUND if supplied commentId (for entryId/eventId) does not exist
     */
    async changeUserVote(eventId, entryId, commentId, userId, vote) { // IMPORTANT: set eventId by users activeEventId, to ensure sufficient rights
        if (!eventId || !entryId || !commentId || !userId || vote == null)
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

        const res = await this._db.collection('comments')
            .updateOne({ _id: commentId, entryId, eventId }, update);
            
        if (res.result.ok !== 1)
            throw utils.createError('error changing uservote for comment', statusCodes.INTERNAL_SERVER_ERROR);
        if (res.result.n < 1)
            throw utils.createError('commentId not found', statusCodes.NOT_FOUND);
        if (res.result.nModified > 0)
            this._onCommentUpdated(eventId, entryId, commentId, false);
    }


    /**
     * Query comments.
     * @async
     * @function
     * @param {ObjectID} eventId id of event
     * @param {ObjectID} entryId id of entry
     * @param {string} userId id of user
     * @param {Array<ObjectID>} [commentIds=[]] array of ObjectIDs to query. Empty array [] means all. Defaults to []
     * @returns {Promise<CommentsController~CommentDict>} resolves to dictionary of comments (for specified user)
     */
    async getComments(eventId, entryId, userId, commentIds = []) {
        if (!eventId || !entryId || !userId || !commentIds)
            throw utils.createError('all params must be set', statusCodes.BAD_REQUEST);

        const match = { eventId, entryId };
        if (commentIds.length > 0)
            match._id = { $in: commentIds };
        const commentArr = await this._db.collection('comments').aggregate([
            { $match: match },
            { $project: {
                authorId: 1, 
                content: 1,
                imageIds: 1,
                own: { $eq:  [ userId, "$postedById" ] },
                parentId: 1,
                score: { $subtract: [ { $size: "$upvotes" }, { $size: "$downvotes" } ] },
                timestamp: 1,
                vote: { $cond: [ { $in: [ userId, "$upvotes" ] }, 1, { 
                    $cond: [ { $in: [ userId, "$downvotes"]}, -1, 0 ] 
                } ] },
            } }
        ]).toArray();

        const commentDict = {};
        commentArr.forEach((comment) => {
            commentDict[comment._id] = comment;
            delete comment._id;
        });
        return commentDict;
    }


    /**
     * Insert new comment into db.
     * @async
     * @function
     * @param {ObjectID} eventId id of event
     * @param {ObjectID} entryId id of entry
     * @param {(ObjectID|null)} parentId id of parent-comment. null for toplevel
     * @param {string} userId id of user
     * @param {boolean} isAnonymous true if posting is anonymous, otherwise false
     * @param {string} content content of comment
     * @param {Array<string>} imageDataArr array of attached images (base64 encoded)
     * @returns {Promise} indicates success
     */
    async postComment(eventId, entryId, parentId, userId, isAnonymous, content, imageDataArr) {
        if (!eventId || !entryId || !userId || isAnonymous == null || !content || !imageDataArr)
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
                throw utils.createError('could not save images for new comments');
            imageIds = Object.values(insertRes.insertedIds);
        }

        const res = await this._db.collection('comments').insertOne({
            authorId: isAnonymous ? null : userId,
            content,
            downvotes: [],
            entryId,
            eventId,
            imageIds,
            parentId: parentId ? parentId : null,
            postedById: userId,
            timestamp: Date.now(),
            upvotes: [],
        });

        if (res.insertedCount < 1)
            throw utils.createError('comment could not be posted');
        
        this._onCommentUpdated(eventId, entryId, res.insertedId, true);
    }
}


module.exports = CommentsController;
