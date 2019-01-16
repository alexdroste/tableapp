<a id="module95commentscontroller"></a>

## commentsController
Controller for comments.


* [commentsController](#module95commentscontroller)
    * _static_
        * [.changeUserVote(eventId, entryId, commentId, userId, vote)](#module95commentscontroller46changeuservote) ⇒ <code>Promise</code>
        * [.deleteComment(eventId, entryId, commentId)](#module95commentscontroller46deletecomment) ⇒ <code>Promise</code>
        * [.getComments(eventId, entryId, userId, [commentIds])](#module95commentscontroller46getcomments) ⇒ <code>Promise.&lt;CommentsController~CommentDict&gt;</code>
        * [.postComment(eventId, entryId, parentId, userId, isAnonymous, content, imageDataArr)](#module95commentscontroller46postcomment) ⇒ <code>Promise</code> &#124; <code>Promise.&lt;ObjectID&gt;</code>
    * _inner_
        * [~_onCommentUpdated(eventId, entryId, commentId, affectsEntryMetadata)](#module95commentscontroller464695oncommentupdated) ℗
        * [~Comment](#module95commentscontroller4646comment) : <code>object</code>
        * [~CommentDict](#module95commentscontroller4646commentdict) : <code>object</code>

<a id="module95commentscontroller46changeuservote"></a>

### commentsController.changeUserVote(eventId, entryId, commentId, userId, vote) ⇒ <code>Promise</code>
Change a users voting for a specific comment.

**Kind**: static method of [<code>commentsController</code>](#module95commentscontroller)  
**Returns**: <code>Promise</code> - indicates success  
**Throws**:

- <code>Error</code> with message: 'commentId not found' with code NOT_FOUND if supplied commentId (for entryId/eventId) does not exist


| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| entryId | <code>ObjectID</code> | id of entry |
| commentId | <code>ObjectID</code> | id of comment |
| userId | <code>string</code> | id of user |
| vote | <code>number</code> | number representing vote (>0: upvote, 0: no vote, <0: downvote) |

<a id="module95commentscontroller46deletecomment"></a>

### commentsController.deleteComment(eventId, entryId, commentId) ⇒ <code>Promise</code>
Mark a comment as deleted.

**Kind**: static method of [<code>commentsController</code>](#module95commentscontroller)  
**Returns**: <code>Promise</code> - indicates success  
**Throws**:

- <code>Error</code> with message: 'commentId not found' with code NOT_FOUND if supplied commentId (for entryId/eventId) does not exist


| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| entryId | <code>ObjectID</code> | id of entry |
| commentId | <code>ObjectID</code> | id of comment |

<a id="module95commentscontroller46getcomments"></a>

### commentsController.getComments(eventId, entryId, userId, [commentIds]) ⇒ <code>Promise.&lt;CommentsController~CommentDict&gt;</code>
Query comments.

If a comment is deleted (isDeleted == true), its authorId & content props
will be returned as 'null' and imageIds will be '[]'.

**Kind**: static method of [<code>commentsController</code>](#module95commentscontroller)  
**Returns**: <code>Promise.&lt;CommentsController~CommentDict&gt;</code> - resolves to dictionary of comments (for specified user)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| eventId | <code>ObjectID</code> |  | id of event |
| entryId | <code>ObjectID</code> |  | id of entry |
| userId | <code>string</code> |  | id of user |
| [commentIds] | <code>Array.&lt;ObjectID&gt;</code> | <code>[]</code> | array of ObjectIDs to query. Empty array [] means all. Defaults to [] |

<a id="module95commentscontroller46postcomment"></a>

### commentsController.postComment(eventId, entryId, parentId, userId, isAnonymous, content, imageDataArr) ⇒ <code>Promise</code> &#124; <code>Promise.&lt;ObjectID&gt;</code>
Insert new comment into db.

**Kind**: static method of [<code>commentsController</code>](#module95commentscontroller)  
**Returns**: <code>Promise</code> - indicates success<code>Promise.&lt;ObjectID&gt;</code> - resolves to ObjectID of inserted Comment  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| entryId | <code>ObjectID</code> | id of entry |
| parentId | <code>ObjectID</code> &#124; <code>null</code> | id of parent-comment. null for toplevel |
| userId | <code>string</code> | id of user |
| isAnonymous | <code>boolean</code> | true if posting is anonymous, otherwise false |
| content | <code>string</code> | content of comment |
| imageDataArr | <code>Array.&lt;string&gt;</code> | array of attached images (base64 encoded) |

<a id="module95commentscontroller464695oncommentupdated"></a>

### commentsController~_onCommentUpdated(eventId, entryId, commentId, affectsEntryMetadata) ℗
Internal method that calls triggers update handlers.

**Kind**: inner method of [<code>commentsController</code>](#module95commentscontroller)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event of updated comment |
| entryId | <code>ObjectID</code> | id of entry of updated comment |
| commentId | <code>ObjectID</code> | id of comment which has been updated |
| affectsEntryMetadata | <code>boolean</code> | indicates if update of comment affects metadata of the superordinate entry |

<a id="module95commentscontroller4646comment"></a>

### commentsController~Comment : <code>object</code>
A comment object.
Containing non-general comment infos for a single user.

**Kind**: inner typedef of [<code>commentsController</code>](#module95commentscontroller)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| authorId | <code>string</code> &#124; <code>null</code> | user-id of author, null if comment was posted anonymously |
| content | <code>string</code> | text-content of comment |
| imageIds | <code>Array.&lt;string&gt;</code> | list of (image-)ids of attached images |
| isDeleted | <code>boolean</code> | indicates if comment is deleted |
| isOwn | <code>boolean</code> | indicates if user owns comment |
| parentId | <code>string</code> &#124; <code>null</code> | (comment-)id of parent comment (id of comment this comment is subordinate), null if comment is a top-level comment |
| score | <code>number</code> | score of the comment |
| timestamp | <code>number</code> | unix-timestamp in ms indicating submission date |
| vote | <code>number</code> | indicates user vote: 0 user did not vote, +1 user upvoted, -1 user downvoted comment |

<a id="module95commentscontroller4646commentdict"></a>

### commentsController~CommentDict : <code>object</code>
Dictionary of comments.

dict[key] = value:
* key := id of comment
* value := [Comment](Comment)

**Kind**: inner typedef of [<code>commentsController</code>](#module95commentscontroller)  
