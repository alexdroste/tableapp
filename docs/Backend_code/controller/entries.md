<a id="module95entriescontroller"></a>

## entriesController
Controller for entries.


* [entriesController](#module95entriescontroller)
    * _static_
        * [.changeUserBookmark(eventId, entryId, userId, bookmark)](#module95entriescontroller46changeuserbookmark) ⇒ <code>Promise</code>
        * [.changeUserFollow(eventId, entryId, userId, follow)](#module95entriescontroller46changeuserfollow) ⇒ <code>Promise</code>
        * [.changeUserVote(eventId, entryId, userId, vote)](#module95entriescontroller46changeuservote) ⇒ <code>Promise</code>
        * [.deleteEntry(eventId, entryId)](#module95entriescontroller46deleteentry) ⇒ <code>Promise</code>
        * [.getEntryInfo(eventId, entryId)](#module95entriescontroller46getentryinfo) ⇒ <code>Promise.&lt;EntriesController~EntryInfo&gt;</code>
        * [.getEntriesInfoRange(eventId, sort, filter, includeScore, limit)](#module95entriescontroller46getentriesinforange) ⇒ <code>Promise.&lt;Array.&lt;EntriesController~EntryInfo&gt;&gt;</code>
        * [.getEntries(eventId, userId, entryIds)](#module95entriescontroller46getentries) ⇒ <code>Promise.&lt;EntriesController~EntryDict&gt;</code>
        * [.hasUserBookmarkSetForEntry(eventId, entryId, userId)](#module95entriescontroller46hasuserbookmarksetforentry) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * [.postEntry(eventId, userId, isAnonymous, content, imageDataArr, extraQuestions)](#module95entriescontroller46postentry) ⇒ <code>Promise.&lt;ObjectID&gt;</code>
    * _inner_
        * [~_onEntryUpdated(eventId, entryId)](#module95entriescontroller464695onentryupdated) ℗
        * [~Entry](#module95entriescontroller4646entry) : <code>object</code>
        * [~EntryDict](#module95entriescontroller4646entrydict) : <code>object</code>
        * [~EntryInfo](#module95entriescontroller4646entryinfo) : <code>object</code>

<a id="module95entriescontroller46changeuserbookmark"></a>

### entriesController.changeUserBookmark(eventId, entryId, userId, bookmark) ⇒ <code>Promise</code>
Change users bookmark state for a specific entry.

**Kind**: static method of [<code>entriesController</code>](#module95entriescontroller)  
**Returns**: <code>Promise</code> - indicates success  
**Throws**:

- <code>Error</code> with message: 'entryId not found' with code NOT_FOUND if supplied entryId (for eventId) does not exist


| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| entryId | <code>ObjectID</code> | id of entry |
| userId | <code>string</code> | id of user |
| bookmark | <code>boolean</code> | true sets bookmark, false unsets |

<a id="module95entriescontroller46changeuserfollow"></a>

### entriesController.changeUserFollow(eventId, entryId, userId, follow) ⇒ <code>Promise</code>
Change users follow state for a specific entry.

**Kind**: static method of [<code>entriesController</code>](#module95entriescontroller)  
**Returns**: <code>Promise</code> - indicates success  
**Throws**:

- <code>Error</code> with message: 'entryId not found' with code NOT_FOUND if supplied entryId (for eventId) does not exist


| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| entryId | <code>ObjectID</code> | id of entry |
| userId | <code>string</code> | id of user |
| follow | <code>boolean</code> | true sets follow, false unsets |

<a id="module95entriescontroller46changeuservote"></a>

### entriesController.changeUserVote(eventId, entryId, userId, vote) ⇒ <code>Promise</code>
Change a users voting for a specific entry.

**Kind**: static method of [<code>entriesController</code>](#module95entriescontroller)  
**Returns**: <code>Promise</code> - indicates success  
**Throws**:

- <code>Error</code> with message: 'entryId not found' with code NOT_FOUND if supplied entryId (for eventId) does not exist


| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| entryId | <code>ObjectID</code> | id of entry |
| userId | <code>string</code> | id of user |
| vote | <code>number</code> | number representing vote (>0: upvote, 0: no vote, <0: downvote) |

<a id="module95entriescontroller46deleteentry"></a>

### entriesController.deleteEntry(eventId, entryId) ⇒ <code>Promise</code>
Mark an entry as deleted.

**Kind**: static method of [<code>entriesController</code>](#module95entriescontroller)  
**Returns**: <code>Promise</code> - indicates success  
**Throws**:

- <code>Error</code> with message: 'entryId not found' with code NOT_FOUND if supplied entryId (for eventId) does not exist


| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| entryId | <code>ObjectID</code> | id of entry |

<a id="module95entriescontroller46getentryinfo"></a>

### entriesController.getEntryInfo(eventId, entryId) ⇒ <code>Promise.&lt;EntriesController~EntryInfo&gt;</code>
Retrieves entry info containing _id, isDeleted, score & timestamp

**Kind**: static method of [<code>entriesController</code>](#module95entriescontroller)  
**Returns**: <code>Promise.&lt;EntriesController~EntryInfo&gt;</code> - resolve to object containing entries _id, isDeleted, score & timestamp  
**Throws**:

- <code>Error</code> with message: 'entryId not found' with code NOT_FOUND if supplied entryId (for eventId) does not exist


| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| entryId | <code>ObjectID</code> | id of entry |

<a id="module95entriescontroller46getentriesinforange"></a>

### entriesController.getEntriesInfoRange(eventId, sort, filter, includeScore, limit) ⇒ <code>Promise.&lt;Array.&lt;EntriesController~EntryInfo&gt;&gt;</code>
Retrieves infos for entries in specified range (filter & sort).

**Kind**: static method of [<code>entriesController</code>](#module95entriescontroller)  
**Returns**: <code>Promise.&lt;Array.&lt;EntriesController~EntryInfo&gt;&gt;</code> - resolves to object array containing entries: _id, timestamp & score (optional)  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| sort | <code>object</code> | sorting-options for key supports "timestamp" & "score", e.g. { score: -1, timestamp: -1 } |
| filter | <code>EntryListSubscription~SearchFilter</code> | search-filter (see SearchFilter docs for possible properties) |
| includeScore | <code>boolean</code> | if true, resulting entries in array will contain score prop |
| limit | <code>number</code> | limits returned array range |

<a id="module95entriescontroller46getentries"></a>

### entriesController.getEntries(eventId, userId, entryIds) ⇒ <code>Promise.&lt;EntriesController~EntryDict&gt;</code>
Query entries.

If an entry is deleted (isDeleted == true), its authorId & content props
will be returned as 'null' and imageIds will be '[]'.

**Kind**: static method of [<code>entriesController</code>](#module95entriescontroller)  
**Returns**: <code>Promise.&lt;EntriesController~EntryDict&gt;</code> - resolves to dictionary of entries (for specified user)  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| userId | <code>string</code> | id of user |
| entryIds | <code>Array.&lt;ObjectID&gt;</code> | array of entry-ids to query |

<a id="module95entriescontroller46hasuserbookmarksetforentry"></a>

### entriesController.hasUserBookmarkSetForEntry(eventId, entryId, userId) ⇒ <code>Promise.&lt;boolean&gt;</code>
Returns whether a user has set a bookmark on a specific entry.

**Kind**: static method of [<code>entriesController</code>](#module95entriescontroller)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - true if user bookmark is set  
**Throws**:

- <code>Error</code> with message: 'entryId not found' with code NOT_FOUND if supplied entryId (for eventId) does not exist


| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| entryId | <code>ObjectID</code> | id of entry |
| userId | <code>string</code> | id of user |

<a id="module95entriescontroller46postentry"></a>

### entriesController.postEntry(eventId, userId, isAnonymous, content, imageDataArr, extraQuestions) ⇒ <code>Promise.&lt;ObjectID&gt;</code>
Insert new entry into db.

**Kind**: static method of [<code>entriesController</code>](#module95entriescontroller)  
**Returns**: <code>Promise.&lt;ObjectID&gt;</code> - resolves to ObjectID of inserted entry  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| userId | <code>string</code> | id of user |
| isAnonymous | <code>boolean</code> | true if posting is anonymous, otherwise false |
| content | <code>string</code> | content of entry |
| imageDataArr | <code>Array.&lt;string&gt;</code> | array of attached images (base64 encoded) |
| extraQuestions | <code>Array.&lt;string&gt;</code> | array of extra questions to attach (prompts) |

<a id="module95entriescontroller464695onentryupdated"></a>

### entriesController~_onEntryUpdated(eventId, entryId) ℗
Internal method that trigger update handlers.

**Kind**: inner method of [<code>entriesController</code>](#module95entriescontroller)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event of updated entry |
| entryId | <code>ObjectID</code> | id of entry which has been updated |

<a id="module95entriescontroller4646entry"></a>

### entriesController~Entry : <code>object</code>
An entry object.
Containing non-general entry infos for a single user.

**Kind**: inner typedef of [<code>entriesController</code>](#module95entriescontroller)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| authorId | <code>string</code> &#124; <code>null</code> | user-id of author, null if entry was posted anonymously |
| commentAttendingUserIds | <code>Array.&lt;string&gt;</code> | list of user-ids that attend discussion (comment-section) |
| commentCount | <code>number</code> | count of comments |
| content | <code>string</code> &#124; <code>null</code> | text-content of entry |
| imageIds | <code>Array.&lt;string&gt;</code> | list of (image-)ids of attached images |
| isBookmarked | <code>boolean</code> | indicates if user bookmarked entry |
| isDeleted | <code>boolean</code> | indicates if entry is deleted |
| isFollowing | <code>boolean</code> | indicates if user is following entry-updates |
| isLiveAnswered | <code>boolean</code> | indicates if entry was discussed in live situation |
| isOwn | <code>boolean</code> | indicates if user owns entry |
| score | <code>number</code> | score of the entry |
| timestamp | <code>number</code> | unix-timestamp in ms indicating submission date |
| vote | <code>number</code> | indicates user vote: 0 user did not vote, +1 user upvoted, -1 user downvoted entry |

<a id="module95entriescontroller4646entrydict"></a>

### entriesController~EntryDict : <code>object</code>
Dictionary of entries.

dict[key] = value:
* key := id of entry
* value := [Entry](Entry)

**Kind**: inner typedef of [<code>entriesController</code>](#module95entriescontroller)  
<a id="module95entriescontroller4646entryinfo"></a>

### entriesController~EntryInfo : <code>object</code>
An entryInfo object.

**Kind**: inner typedef of [<code>entriesController</code>](#module95entriescontroller)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| _id | <code>ObjectID</code> | id of entry |
| [isDeleted] | <code>boolean</code> | indicates if entry is deleted |
| [score] | <code>number</code> | score of entry |
| timestamp | <code>number</code> | timestamp in ms of entry submission |

