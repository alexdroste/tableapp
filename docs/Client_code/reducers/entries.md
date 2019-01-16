<a id="entrylisttypeenum"></a>

## EntryListTypeEnum : <code>enum</code>
Enum for list types.

**Kind**: global enum  
**Properties**

| Name | Type |
| --- | --- |
| RECENT | <code>number</code> | 
| TOP_LATELY | <code>number</code> | 
| TOP_RATED | <code>number</code> | 

<a id="entries"></a>

## entries(state, action)
entries-reducer

**Kind**: global function  

| Param | Type |
| --- | --- |
| state | [<code>EntriesState</code>](#entriesstate) | 
| action | <code>object</code> | 

<a id="getentry"></a>

## getEntry(state, entryId) ⇒ <code>Entry</code> &#124; <code>null</code>
Selector to select an entry by its id from entries-state.

**Kind**: global function  
**Returns**: [<code>Entry</code>](#entry) &#124; <code>null</code> - entry with specified id  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EntriesState</code>](#entriesstate) | entries-state |
| entryId | <code>string</code> | id of entry |

<a id="getentrydict"></a>

## getEntryDict(state) ⇒ <code>EntryDict</code>
Selector to retrieve whole entry dictionary from entries-state.

**Kind**: global function  
**Returns**: [<code>EntryDict</code>](#entrydict) - dictionary of entries  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EntriesState</code>](#entriesstate) | entries-state |

<a id="getidlist"></a>

## getIdList(state) ⇒ <code>Array.&lt;string&gt;</code>
Selector to select list of entry-ids from entries-state.

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - list of entry-ids ordered/filtered according to subscribed list type  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EntriesState</code>](#entriesstate) | entries-state |

<a id="getlisttype"></a>

## getListType(state) ⇒ <code>EntryListTypeEnum</code>
Selector to select list type from entries-state.

**Kind**: global function  
**Returns**: [<code>EntryListTypeEnum</code>](#entrylisttypeenum) - selected/configured list type  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EntriesState</code>](#entriesstate) | entries-state |

<a id="haslistonlybookmarked"></a>

## hasListOnlyBookmarked(state) ⇒ <code>boolean</code>
Selector to select state of "only-bookmarked" filter from entries-state.

**Kind**: global function  
**Returns**: <code>boolean</code> - indicates if only bookmarked entries should be listed (filter for idList)  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EntriesState</code>](#entriesstate) | entries-state |

<a id="hasmoreentriestoload"></a>

## hasMoreEntriesToLoad(state) ⇒ <code>boolean</code>
Selector to select state if more entries can be load from server from entries-state.

**Kind**: global function  
**Returns**: <code>boolean</code> - indicates if more entries can be load, false if client already subscribed to all available entries in list  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EntriesState</code>](#entriesstate) | entries-state |

<a id="islistsubscribed"></a>

## isListSubscribed(state) ⇒ <code>boolean</code>
Selector to select state if list subscription is active from entries-state.

**Kind**: global function  
**Returns**: <code>boolean</code> - indicates if list subscription is active  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EntriesState</code>](#entriesstate) | entries-state |

<a id="entry"></a>

## Entry : <code>object</code>
An entry object.

**Kind**: global typedef  
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

<a id="entrydict"></a>

## EntryDict : <code>object</code>
Dictionary of entries.

dict[key] = value:
* key := id of entry
* value := [Entry](#entry)

**Kind**: global typedef  
<a id="entriesstate"></a>

## EntriesState : <code>object</code>
Shape of entries reducers state.
Default values are the initial state.

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [entryDict] | [<code>EntryDict</code>](#entrydict) | <code>{}</code> | dictionary of entries |
| [idList] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | list of entry-ids ordered/filtered according to subscribed list type |
| [listOnlyBookmarked] | <code>boolean</code> | <code>false</code> | indicates if only bookmarked entries should be listed (filter for idList) |
| [listSubcribed] | <code>boolean</code> | <code>false</code> | indicates if list subscription is active |
| [listType] | [<code>EntryListTypeEnum</code>](#entrylisttypeenum) | <code>EntryListTypeEnum.RECENT</code> | subscribed/configured list type |
| [moreEntriesToLoad] | <code>boolean</code> | <code>true</code> | indicates if more entries can be load, false if client already subscribed to all available entries in list |

