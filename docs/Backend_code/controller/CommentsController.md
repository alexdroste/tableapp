<a id="commentscontroller"></a>

## CommentsController
Controller for comments.

**Kind**: global class  

* [CommentsController](#commentscontroller)
    * [new CommentsController(dbConnection)](#new95commentscontroller95new)
    * _instance_
        * [._db](#commentscontroller4395db) : <code>object</code> ℗
        * [._onCommentUpdatedCallback](#commentscontroller4395oncommentupdatedcallback) : [<code>onCommentUpdatedCallback</code>](#commentscontroller4646oncommentupdatedcallback) &#124; <code>null</code> ℗
        * [._onCommentUpdated(eventId, entryId, commentId, affectsEntryMetadata)](#commentscontroller4395oncommentupdated) ℗
        * [.onCommentUpdated(cb)](#commentscontroller43oncommentupdated)
        * [.changeUserVote(eventId, entryId, commentId, userId, vote)](#commentscontroller43changeuservote) ⇒ <code>Promise</code>
        * [.getComments(eventId, entryId, userId, [commentIds])](#commentscontroller43getcomments) ⇒ [<code>Promise.&lt;CommentDict&gt;</code>](#commentscontroller4646commentdict)
        * [.postComment(eventId, entryId, parentId, userId, isAnonymous, content, imageDataArr)](#commentscontroller43postcomment) ⇒ <code>Promise</code>
    * _inner_
        * [~Comment](#commentscontroller4646comment) : <code>object</code>
        * [~CommentDict](#commentscontroller4646commentdict) : <code>object</code>
        * [~onCommentUpdatedCallback](#commentscontroller4646oncommentupdatedcallback) : <code>function</code>

<a id="new95commentscontroller95new"></a>

### new CommentsController(dbConnection)
Initializes comments controller.


| Param | Type | Description |
| --- | --- | --- |
| dbConnection | <code>object</code> | mongodb database connection |

<a id="commentscontroller4395db"></a>

### commentsController._db : <code>object</code> ℗
Database connection that is beeing used.

**Kind**: instance property of [<code>CommentsController</code>](#commentscontroller)  
**Access**: private  
<a id="commentscontroller4395oncommentupdatedcallback"></a>

### commentsController._onCommentUpdatedCallback : <code>onCommentUpdatedCallback</code> &#124; <code>null</code> ℗
Registered onCommentUpdated callback.

**Kind**: instance property of [<code>CommentsController</code>](#commentscontroller)  
**Access**: private  
<a id="commentscontroller4395oncommentupdated"></a>

### commentsController._onCommentUpdated(eventId, entryId, commentId, affectsEntryMetadata) ℗
Internal method that calls onCommentUpdated callback function.

**Kind**: instance method of [<code>CommentsController</code>](#commentscontroller)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event of updated comment |
| entryId | <code>ObjectID</code> | id of entry of updated comment |
| commentId | <code>ObjectID</code> | id of comment which has been updated |
| affectsEntryMetadata | <code>boolean</code> | indicates if update of comment affects metadata of the superordinate entry |

<a id="commentscontroller43oncommentupdated"></a>

### commentsController.onCommentUpdated(cb)
Register callback that is called when a comment (of an entry) has been updated.

**Kind**: instance method of [<code>CommentsController</code>](#commentscontroller)  

| Param | Type | Description |
| --- | --- | --- |
| cb | [<code>onCommentUpdatedCallback</code>](#commentscontroller4646oncommentupdatedcallback) | callback when a comment (of an entry) has been updated |

<a id="commentscontroller43changeuservote"></a>

### commentsController.changeUserVote(eventId, entryId, commentId, userId, vote) ⇒ <code>Promise</code>
Change a users voting for a specific comment.

**Kind**: instance method of [<code>CommentsController</code>](#commentscontroller)  
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

<a id="commentscontroller43getcomments"></a>

### commentsController.getComments(eventId, entryId, userId, [commentIds]) ⇒ <code>Promise.&lt;CommentDict&gt;</code>
Query comments.

**Kind**: instance method of [<code>CommentsController</code>](#commentscontroller)  
**Returns**: [<code>Promise.&lt;CommentDict&gt;</code>](#commentscontroller4646commentdict) - resolves to dictionary of comments (for specified user)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| eventId | <code>ObjectID</code> |  | id of event |
| entryId | <code>ObjectID</code> |  | id of entry |
| userId | <code>string</code> |  | id of user |
| [commentIds] | <code>Array.&lt;ObjectID&gt;</code> | <code>[]</code> | array of ObjectIDs to query. Empty array [] means all. Defaults to [] |

<a id="commentscontroller43postcomment"></a>

### commentsController.postComment(eventId, entryId, parentId, userId, isAnonymous, content, imageDataArr) ⇒ <code>Promise</code>
Insert new comment into db.

**Kind**: instance method of [<code>CommentsController</code>](#commentscontroller)  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| entryId | <code>ObjectID</code> | id of entry |
| parentId | <code>ObjectID</code> &#124; <code>null</code> | id of parent-comment. null for toplevel |
| userId | <code>string</code> | id of user |
| isAnonymous | <code>boolean</code> | true if posting is anonymous, otherwise false |
| content | <code>string</code> | content of comment |
| imageDataArr | <code>Array.&lt;string&gt;</code> | array of attached images (base64 encoded) |

<a id="commentscontroller4646comment"></a>

### CommentsController~Comment : <code>object</code>
A comment object.
Containing non-general comment infos for a single user.

**Kind**: inner typedef of [<code>CommentsController</code>](#commentscontroller)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| authorId | <code>string</code> &#124; <code>null</code> | user-id of author, null if comment was posted anonymously |
| content | <code>string</code> | text-content of comment |
| imageIds | <code>Array.&lt;string&gt;</code> | list of (image-)ids of attached images |
| parentId | <code>string</code> &#124; <code>null</code> | (comment-)id of parent comment (id of comment this comment is subordinate), null if comment is a top-level comment |
| score | <code>number</code> | score of the comment |
| timestamp | <code>number</code> | unix-timestamp in ms indicating submission date |
| vote | <code>number</code> | indicates user vote: 0 user did not vote, +1 user upvoted, -1 user downvoted comment |

<a id="commentscontroller4646commentdict"></a>

### CommentsController~CommentDict : <code>object</code>
Dictionary of comments.

dict[key] = value:
* key := id of comment
* value := [Comment](#commentscontroller4646comment)

**Kind**: inner typedef of [<code>CommentsController</code>](#commentscontroller)  
<a id="commentscontroller4646oncommentupdatedcallback"></a>

### CommentsController~onCommentUpdatedCallback : <code>function</code>
Function called when a comment (of an entry) has been updated.

**Kind**: inner typedef of [<code>CommentsController</code>](#commentscontroller)  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event of updated comment |
| entryId | <code>ObjectID</code> | id of entry of updated comment |
| commentId | <code>ObjectID</code> | id of comment which has been updated |
| affectsEntryMetadata | <code>boolean</code> | indicates if update of comment affects metadata of the superordinate entry |

