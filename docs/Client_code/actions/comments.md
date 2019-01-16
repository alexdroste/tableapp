<a id="changevote"></a>

## changeVote(entryId, commentId, vote) ⇒ <code>object</code>
Creates action for changing a users vote on a comment.

**Kind**: global function  
**Returns**: <code>object</code> - action  

| Param | Type | Description |
| --- | --- | --- |
| entryId | <code>string</code> | entryId |
| commentId | <code>string</code> | commentId |
| vote | <code>number</code> | number representing vote (>0: upvote, 0: no vote, <0: downvote) |

<a id="deletecomment"></a>

## deleteComment(entryId, commentId) ⇒ <code>object</code>
Creates action for deleting a comment.

**Kind**: global function  
**Returns**: <code>object</code> - action  

| Param | Type | Description |
| --- | --- | --- |
| entryId | <code>string</code> | entryId |
| commentId | <code>string</code> | commentId |

<a id="postcomment"></a>

## postComment(entryId, parentId, isAnonymous, content, imageIds) ⇒ <code>object</code>
Creates action for posting a new comment.

**Kind**: global function  
**Returns**: <code>object</code> - action  

| Param | Type | Description |
| --- | --- | --- |
| entryId | <code>string</code> | entryId |
| parentId | <code>string</code> &#124; <code>null</code> | id of parent-comment. '0' or null for toplevel |
| isAnonymous | <code>boolean</code> | true if posting is anonymous, otherwise false |
| content | <code>string</code> | content of comment |
| imageIds | <code>Array.&lt;string&gt;</code> | array of images (by id) to attach |

<a id="subscribecommentsforentry"></a>

## subscribeCommentsForEntry(entryId) ⇒ <code>object</code>
Creates action for subscribing to comments (for an entry).

**Kind**: global function  
**Returns**: <code>object</code> - action  

| Param | Type | Description |
| --- | --- | --- |
| entryId | <code>string</code> | entryId |

<a id="unsubscribecommentsforentry"></a>

## unsubscribeCommentsForEntry() ⇒ <code>object</code>
Creates action for unsubscribing from comments (for last subscribed entry).

**Kind**: global function  
**Returns**: <code>object</code> - action  
<a id="updatecommentdict"></a>

## updateCommentDict(commentDict) ⇒ <code>object</code>
Creates action for updating the comment-dict.

**Kind**: global function  
**Returns**: <code>object</code> - action  

| Param | Type | Description |
| --- | --- | --- |
| commentDict | <code>CommentDict</code> | commentDict-update |

