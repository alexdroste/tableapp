/**
 * API-call: change vote for comment.
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @param {string} entryId entryId 
 * @param {string} commentId commentId
 * @param {number} vote number representing vote (>0: upvote, 0: no vote, <0: downvote)
 * @returns {Promise} indicates success
 */
export function changeVote(api, entryId, commentId, vote) {
    return api.request('comments/changeVote', { entryId, commentId, vote });
}


/**
 * API-call: delete comment.
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @param {string} entryId entryId 
 * @param {string} commentId commentId
 * @returns {Promise} indicates success
 */
export function deleteComment(api, entryId, commentId) {
    return api.request('comments/deleteComment', { entryId, commentId });
}


/**
 * API-call: post new comment.
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @param {string} entryId entryId
 * @param {(string|null)} parentId id of parent-comment. '0' or null for toplevel
 * @param {boolean} isAnonymous true if posting is anonymous, otherwise false
 * @param {string} content content of comment
 * @param {Array<string>} imageDataArr array of attached images (base64 encoded)
 * @returns {Promise} indicates success
 */
export function postComment(api, entryId, parentId, isAnonymous, content, imageDataArr) {
    return api.request('comments/postComment', { 
        content,
        entryId,
        imageDataArr,
        isAnonymous,
        parentId: parentId === '0' ? null : parentId,
    });
}


/**
 * @typedef {object} SubscribeCommentsForEntryResult
 * @property {CommentDict} commentDict CommentDict (for entryId)
 */


/**
 * API-call: subscribe to comments for an entry.
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @param {string} entryId entryId
 * @returns {Promise<SubscribeCommentsForEntryResult>} resolves to object containing CommentDict (for entryId)
 */
export function subscribeCommentsForEntry(api, entryId) {
    return api.request('comments/subscribeCommentsForEntry', { entryId });
}


/**
 * API-call: unsubscribe from comments for last subscribed entry.
 * @async
 * @function
 * @param {ApiConnection} api ApiConnection instance 
 * @returns {Promise} indicates success
 */
export function unsubscribeCommentsForEntry(api) {
    return api.request('comments/unsubscribeCommentsForEntry');
}

