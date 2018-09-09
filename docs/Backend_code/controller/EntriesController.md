<a id="entriescontroller"></a>

## EntriesController
Controller for entries.

**Kind**: global class  

* [EntriesController](#entriescontroller)
    * [new EntriesController(dbConnection)](#new95entriescontroller95new)
    * _instance_
        * [._db](#entriescontroller4395db) : <code>object</code> ℗
        * [._onEntryUpdatedCallback](#entriescontroller4395onentryupdatedcallback) : [<code>onEntryUpdatedCallback</code>](#entriescontroller4646onentryupdatedcallback) &#124; <code>null</code> ℗
        * [._onEntryUpdated(eventId, entryId)](#entriescontroller4395onentryupdated) ℗
        * [.onEntryUpdated(cb)](#entriescontroller43onentryupdated)
        * [.changeUserBookmark(eventId, entryId, userId, bookmark)](#entriescontroller43changeuserbookmark) ⇒ <code>Promise</code>
        * [.changeUserFollow(eventId, entryId, userId, follow)](#entriescontroller43changeuserfollow) ⇒ <code>Promise</code>
        * [.changeUserVote(eventId, entryId, userId, vote)](#entriescontroller43changeuservote) ⇒ <code>Promise</code>
        * [.getEntryInfo(eventId, entryId)](#entriescontroller43getentryinfo) ⇒ [<code>Promise.&lt;EntryInfo&gt;</code>](#entriescontroller4646entryinfo)
        * [.getEntriesInfoRange(eventId, sort, filter, includeScore, limit)](#entriescontroller43getentriesinforange) ⇒ <code>Promise.&lt;Array.&lt;EntriesController~EntryInfo&gt;&gt;</code>
        * [.getEntries(eventId, userId, entryIds)](#entriescontroller43getentries) ⇒ [<code>Promise.&lt;EntryDict&gt;</code>](#entriescontroller4646entrydict)
        * [.hasUserBookmarkSetForEntry(eventId, entryId, userId)](#entriescontroller43hasuserbookmarksetforentry) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * [.postEntry(eventId, userId, isAnonymous, content, imageDataArr)](#entriescontroller43postentry) ⇒ <code>Promise</code>
    * _inner_
        * [~Entry](#entriescontroller4646entry) : <code>object</code>
        * [~EntryDict](#entriescontroller4646entrydict) : <code>object</code>
        * [~EntryInfo](#entriescontroller4646entryinfo) : <code>object</code>
        * [~onEntryUpdatedCallback](#entriescontroller4646onentryupdatedcallback) : <code>function</code>

<a id="new95entriescontroller95new"></a>

### new EntriesController(dbConnection)
Initializes entries controller.


| Param | Type | Description |
| --- | --- | --- |
| dbConnection | <code>object</code> | mongodb database connection |

<a id="entriescontroller4395db"></a>

### entriesController._db : <code>object</code> ℗
Database connection that is beeing used.

**Kind**: instance property of [<code>EntriesController</code>](#entriescontroller)  
**Access**: private  
<a id="entriescontroller4395onentryupdatedcallback"></a>

### entriesController._onEntryUpdatedCallback : <code>onEntryUpdatedCallback</code> &#124; <code>null</code> ℗
Registered onEntryUpdated callback.

**Kind**: instance property of [<code>EntriesController</code>](#entriescontroller)  
**Access**: private  
<a id="entriescontroller4395onentryupdated"></a>

### entriesController._onEntryUpdated(eventId, entryId) ℗
Internal method that calls onEntryUpdated callback function.

**Kind**: instance method of [<code>EntriesController</code>](#entriescontroller)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event of updated entry |
| entryId | <code>ObjectID</code> | id of entry which has been updated |

<a id="entriescontroller43onentryupdated"></a>

### entriesController.onEntryUpdated(cb)
Register callback that is called when an entry (of an event) has been updated.

**Kind**: instance method of [<code>EntriesController</code>](#entriescontroller)  

| Param | Type | Description |
| --- | --- | --- |
| cb | [<code>onEntryUpdatedCallback</code>](#entriescontroller4646onentryupdatedcallback) | callback when an entry (of an event) has been updated |

<a id="entriescontroller43changeuserbookmark"></a>

### entriesController.changeUserBookmark(eventId, entryId, userId, bookmark) ⇒ <code>Promise</code>
Change users bookmark state for a specific entry.

**Kind**: instance method of [<code>EntriesController</code>](#entriescontroller)  
**Returns**: <code>Promise</code> - indicates success  
**Throws**:

- <code>Error</code> with message: 'entryId not found' with statusCode NOT_FOUND if supplied entryId (for eventId) does not exist


| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| entryId | <code>ObjectID</code> | id of entry |
| userId | <code>string</code> | id of user |
| bookmark | <code>boolean</code> | true sets bookmark, false unsets |

<a id="entriescontroller43changeuserfollow"></a>

### entriesController.changeUserFollow(eventId, entryId, userId, follow) ⇒ <code>Promise</code>
Change users follow state for a specific entry.

**Kind**: instance method of [<code>EntriesController</code>](#entriescontroller)  
**Returns**: <code>Promise</code> - indicates success  
**Throws**:

- <code>Error</code> with message: 'entryId not found' with statusCode NOT_FOUND if supplied entryId (for eventId) does not exist


| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| entryId | <code>ObjectID</code> | id of entry |
| userId | <code>string</code> | id of user |
| follow | <code>boolean</code> | true sets follow, false unsets |

<a id="entriescontroller43changeuservote"></a>

### entriesController.changeUserVote(eventId, entryId, userId, vote) ⇒ <code>Promise</code>
Change a users voting for a specific entry.

**Kind**: instance method of [<code>EntriesController</code>](#entriescontroller)  
**Returns**: <code>Promise</code> - indicates success  
**Throws**:

- <code>Error</code> with message: 'entryId not found' with statusCode NOT_FOUND if supplied entryId (for eventId) does not exist


| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| entryId | <code>ObjectID</code> | id of entry |
| userId | <code>string</code> | id of user |
| vote | <code>number</code> | number representing vote (>0: upvote, 0: no vote, <0: downvote) |

<a id="entriescontroller43getentryinfo"></a>

### entriesController.getEntryInfo(eventId, entryId) ⇒ <code>Promise.&lt;EntryInfo&gt;</code>
Retrieves entry info containing _id, score & timestamp

**Kind**: instance method of [<code>EntriesController</code>](#entriescontroller)  
**Returns**: [<code>Promise.&lt;EntryInfo&gt;</code>](#entriescontroller4646entryinfo) - resolve to object containing entries _id, score & timestamp  
**Throws**:

- <code>Error</code> with message: 'entryId not found' with statusCode NOT_FOUND if supplied entryId (for eventId) does not exist


| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| entryId | <code>ObjectID</code> | id of entry |

<a id="entriescontroller43getentriesinforange"></a>

### entriesController.getEntriesInfoRange(eventId, sort, filter, includeScore, limit) ⇒ <code>Promise.&lt;Array.&lt;EntriesController~EntryInfo&gt;&gt;</code>
Retrieves infos for entries in specified range (filter & sort).

**Kind**: instance method of [<code>EntriesController</code>](#entriescontroller)  
**Returns**: <code>Promise.&lt;Array.&lt;EntriesController~EntryInfo&gt;&gt;</code> - resolves to object array containing entries: _id, timestamp & score (optional)  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| sort | <code>object</code> | sorting-options for key supports "timestamp" & "score", e.g. { score: -1, timestamp: -1 } |
| filter | <code>object</code> | filter-options support: "bookmarkForUser", "minTimestamp", "maxTimestamp", "maxScore" & "excludedEntryIds" |
| includeScore | <code>boolean</code> | if true, resulting entries in array will contain score prop |
| limit | <code>number</code> | limits returned array range |

<a id="entriescontroller43getentries"></a>

### entriesController.getEntries(eventId, userId, entryIds) ⇒ <code>Promise.&lt;EntryDict&gt;</code>
Query entries.

**Kind**: instance method of [<code>EntriesController</code>](#entriescontroller)  
**Returns**: [<code>Promise.&lt;EntryDict&gt;</code>](#entriescontroller4646entrydict) - resolves to dictionary of entries (for specified user)  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| userId | <code>string</code> | id of user |
| entryIds | <code>Array.&lt;ObjectID&gt;</code> | array of entry-ids to query |

<a id="entriescontroller43hasuserbookmarksetforentry"></a>

### entriesController.hasUserBookmarkSetForEntry(eventId, entryId, userId) ⇒ <code>Promise.&lt;boolean&gt;</code>
Returns whether a user has set a bookmark on a specific entry.

**Kind**: instance method of [<code>EntriesController</code>](#entriescontroller)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - true if user bookmark is set  
**Throws**:

- <code>Error</code> with message: 'entryId not found' with statusCode NOT_FOUND if supplied entryId (for eventId) does not exist


| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| entryId | <code>ObjectID</code> | id of entry |
| userId | <code>string</code> | id of user |

<a id="entriescontroller43postentry"></a>

### entriesController.postEntry(eventId, userId, isAnonymous, content, imageDataArr) ⇒ <code>Promise</code>
Insert new entry into db.

**Kind**: instance method of [<code>EntriesController</code>](#entriescontroller)  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| userId | <code>string</code> | id of user |
| isAnonymous | <code>boolean</code> | true if posting is anonymous, otherwise false |
| content | <code>string</code> | content of entry |
| imageDataArr | <code>Array.&lt;string&gt;</code> | array of attached images (base64 encoded) |

<a id="entriescontroller4646entry"></a>

### EntriesController~Entry : <code>object</code>
An entry object.
Containing non-general entry infos for a single user.

**Kind**: inner typedef of [<code>EntriesController</code>](#entriescontroller)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| authorId | <code>string</code> &#124; <code>null</code> | user-id of author, null if entry was posted anonymously |
| bookmark | <code>boolean</code> | indicates if user bookmarked entry |
| commentAttendingUserIds | <code>Array.&lt;string&gt;</code> | list of user-ids that attend discussion (comment-section) |
| commentCount | <code>number</code> | count of comments |
| content | <code>string</code> | text-content of entry |
| follow | <code>boolean</code> | indicates if user is following entry-updates |
| imageIds | <code>Array.&lt;string&gt;</code> | list of (image-)ids of attached images |
| liveAnswered | <code>boolean</code> | indicates if entry was discussed in live situation |
| score | <code>number</code> | score of the entry |
| timestamp | <code>number</code> | unix-timestamp in ms indicating submission date |
| vote | <code>number</code> | indicates user vote: 0 user did not vote, +1 user upvoted, -1 user downvoted entry |

<a id="entriescontroller4646entrydict"></a>

### EntriesController~EntryDict : <code>object</code>
Dictionary of entries.

dict[key] = value:
* key := id of entry
* value := [Entry](#entriescontroller4646entry)

**Kind**: inner typedef of [<code>EntriesController</code>](#entriescontroller)  
<a id="entriescontroller4646entryinfo"></a>

### EntriesController~EntryInfo : <code>object</code>
An entryInfo object.

**Kind**: inner typedef of [<code>EntriesController</code>](#entriescontroller)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| _id | <code>ObjectID</code> | id of entry |
| [score] | <code>number</code> | score of entry |
| timestamp | <code>number</code> | timestamp in ms of entry submission |

<a id="entriescontroller4646onentryupdatedcallback"></a>

### EntriesController~onEntryUpdatedCallback : <code>function</code>
Function called when an entry (of an event) has been updated.

**Kind**: inner typedef of [<code>EntriesController</code>](#entriescontroller)  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event of updated entry |
| entryId | <code>ObjectID</code> | id of entry which has been updated |

