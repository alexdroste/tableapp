import { combineReducers } from 'redux';
import * as commentsActionTypes from '../actiontypes/comments';
import * as eventsActionTypes from '../actiontypes/events';
import * as userActionTypes from '../actiontypes/user';


/**
 * A comment object.
 * @typedef {object} Comment
 * @property {(string|null)} authorId user-id of author, null if comment was posted anonymously
 * @property {string} content text-content of comment
 * @property {Array<string>} imageIds list of (image-)ids of attached images
 * @property {boolean} isDeleted indicates if comment is deleted
 * @property {boolean} isOwn indicates if user owns comment
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
 * * value := {@link Comment}
 * @typedef {object} CommentDict
 */


/**
 * A graph representing the hiearchy of comments by its ids.
 * 
 * The graph is an object with the following shape (graph[key] = value):
 * * key := id of parent-comment
 * * value := Array<string> of comment-ids that are direct children of its parent comment
 * 
 * Important: the top-level comments have parentId `"0"`.
 * @typedef {object} CommentsViewGraph
 */


/**
 * Shape of comments reducers state.
 * Default values are the initial state.
 * @typedef {object} CommentsState
 * @property {CommentDict} [commentDict={}] dictionary of comments
 * @property {boolean} [initialLoadPending=true] indicates if initial load of comments is pending
 * @property {(string|null)} [subscribedEntryId=null] id of entry which comments are loaded/subscribed
 */
const initialState = {
    commentDict: {},
    initialLoadPending: true,
    subscribedEntryId: null,
};


export const commentDict = (state = initialState.commentDict, action) => {
    switch (action.type) {
        case commentsActionTypes.SUBSCRIBE_COMMENTS_FOR_ENTRY_SUCCESS:
            return action.result; // contains CommentDict
        case commentsActionTypes.UPDATE_COMMENT_DICT:
            return {
                ...state,
                ...action.commentDict,
            };
        // TODO commented out as a quick fix:
        // if commented in UserPostForm wont display comment to answer to
        // cause it got deleted just a sec before when CommentsView unmounts
        // case commentsActionTypes.UNSUBSCRIBE_COMMENTS_FOR_ENTRY_REQUEST:
        //     return {};
        // reset
        case eventsActionTypes.SWITCH_ACTIVE_EVENT_REQUEST:
        case userActionTypes.CONTINUE_SESSION_REQUEST:
        case userActionTypes.LOGIN_REQUEST:
        case userActionTypes.LOGOUT_SUCCESS:
            return initialState.commentDict;
        default:
            return state;
    }
};


export const initialLoadPending = (state = initialState.initialLoadPending, action) => {
    switch (action.type) {
        case commentsActionTypes.SUBSCRIBE_COMMENTS_FOR_ENTRY_REQUEST:
        case commentsActionTypes.UNSUBSCRIBE_COMMENTS_FOR_ENTRY_REQUEST:
            return true;
        case commentsActionTypes.SUBSCRIBE_COMMENTS_FOR_ENTRY_SUCCESS:
            return false;
        // reset
        case eventsActionTypes.SWITCH_ACTIVE_EVENT_REQUEST:
        case userActionTypes.CONTINUE_SESSION_REQUEST:
        case userActionTypes.LOGIN_REQUEST:
        case userActionTypes.LOGOUT_SUCCESS:
            return initialState.initialLoadPending;
        default:
            return state;
    }
};


export const subscribedEntryId = (state = initialState.subscribedEntryId, action) => {
    switch (action.type) {
        case commentsActionTypes.SUBSCRIBE_COMMENTS_FOR_ENTRY_REQUEST:
            return action.entryId;
        case commentsActionTypes.UNSUBSCRIBE_COMMENTS_FOR_ENTRY_REQUEST:
            return null;
        // reset
        case eventsActionTypes.SWITCH_ACTIVE_EVENT_REQUEST:
        case userActionTypes.CONTINUE_SESSION_REQUEST:
        case userActionTypes.LOGIN_REQUEST:
        case userActionTypes.LOGOUT_SUCCESS:
            return initialState.subscribedEntryId;
        default:
            return state;
    }
};


/**
 * comments-reducer
 * @function
 * @param {CommentsState} state
 * @param {object} action
 */
export const comments = combineReducers({
    commentDict,
    initialLoadPending,
    subscribedEntryId,
});


// selectors

/**
 * Selector to select state if initial load of comments is pending from comments-state.
 * @function
 * @param {CommentsState} state comments-state
 * @returns {boolean} indicates if initial load of comments is pending
 */
export const isInitialLoadPending = (state) =>
    state.initialLoadPending;


/**
 * Selector to select a comment by its id from comments-state.
 * @function
 * @param {CommentsState} state comments-state
 * @param {string} commentId id of comment
 * @returns {(Comment|null)} comment with specified id
 */
export const getComment = (state, commentId) =>
    state.commentDict[commentId] || null;


let commentsViewCache = {};
/**
 * Selector to retrieve comments hiearchy-graph from comments-state.
 * Graph gets generated by this function. 
 * Graph gets cached and is only re-generated if commentDict in state changes. 
 * @function
 * @param {CommentsState} state comments-state
 * @returns {CommentsViewGraph} comments hierachy-graph
 */
export const getCommentsView = (state) => {
    if (commentsViewCache.view && commentsViewCache.lastDict === state.commentDict) {
        return commentsViewCache.view;
    }
    commentsViewCache.lastDict = state.commentDict;
    const view = {};
    Object.keys(state.commentDict).forEach((commentId) => {
        let pId = state.commentDict[commentId].parentId;
        if (pId == null)
            pId = '0'; // root
        if (!view[pId])
            view[pId] = [];
        view[pId].push(commentId);
    });
    // TODO only for timestamp ascending sorting atm
    Object.keys(view).forEach((pId) => {
        view[pId].sort((a, b) => (
            state.commentDict[a].timestamp - state.commentDict[b].timestamp
        ));
    });
    commentsViewCache.view = view;
    // console.log(view);
    return view;
};
