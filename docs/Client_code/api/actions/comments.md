<a id="changevote"></a>

## changeVote(api, entryId, commentId, vote) ⇒ <code>Promise</code>
API-call: change vote for comment.

**Kind**: global function  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiConnection</code> | ApiConnection instance |
| entryId | <code>string</code> | entryId |
| commentId | <code>string</code> | commentId |
| vote | <code>number</code> | number representing vote (>0: upvote, 0: no vote, <0: downvote) |

<a id="postcomment"></a>

## postComment(api, entryId, parentId, isAnonymous, content, imageDataArr) ⇒ <code>Promise</code>
API-call: post new comment.

**Kind**: global function  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiConnection</code> | ApiConnection instance |
| entryId | <code>string</code> | entryId |
| parentId | <code>string</code> &#124; <code>null</code> | id of parent-comment. '0' or null for toplevel |
| isAnonymous | <code>boolean</code> | true if posting is anonymous, otherwise false |
| content | <code>string</code> | content of comment |
| imageDataArr | <code>Array.&lt;string&gt;</code> | array of attached images (base64 encoded) |

<a id="subscribecommentsforentry"></a>

## subscribeCommentsForEntry(api, entryId) ⇒ <code>Promise.&lt;SubscribeCommentsForEntryResult&gt;</code>
API-call: subscribe to comments for an entry.

**Kind**: global function  
**Returns**: [<code>Promise.&lt;SubscribeCommentsForEntryResult&gt;</code>](#subscribecommentsforentryresult) - resolves to object containing CommentDict (for entryId)  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiConnection</code> | ApiConnection instance |
| entryId | <code>string</code> | entryId |

<a id="unsubscribecommentsforentry"></a>

## unsubscribeCommentsForEntry(api) ⇒ <code>Promise</code>
API-call: unsubscribe from comments for last subscribed entry.

**Kind**: global function  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiConnection</code> | ApiConnection instance |

<a id="subscribecommentsforentryresult"></a>

## SubscribeCommentsForEntryResult : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| commentDict | <code>CommentDict</code> | CommentDict (for entryId) |

