<a id="changebookmark"></a>

## changeBookmark(entryId, bookmark) ⇒ <code>object</code>
Creates action for changing bookmarked-state (set/unset) for entry.

**Kind**: global function  
**Returns**: <code>object</code> - action  

| Param | Type | Description |
| --- | --- | --- |
| entryId | <code>string</code> | entryId |
| bookmark | <code>boolean</code> | true sets bookmark, false unsets |

<a id="changefollow"></a>

## changeFollow(entryId, follow) ⇒ <code>object</code>
Creates action for changing follow-state for entry.

**Kind**: global function  
**Returns**: <code>object</code> - action  

| Param | Type | Description |
| --- | --- | --- |
| entryId | <code>string</code> | entryId |
| follow | <code>boolean</code> | true sets follow, false unsets |

<a id="changevote"></a>

## changeVote(entryId, vote) ⇒ <code>object</code>
Creates action for changing user vote for entry.

**Kind**: global function  
**Returns**: <code>object</code> - action  

| Param | Type | Description |
| --- | --- | --- |
| entryId | <code>string</code> | entryId |
| vote | <code>number</code> | number representing vote (>0: upvote, 0: no vote, <0: downvote) |

<a id="deleteentry"></a>

## deleteEntry(entryId) ⇒ <code>object</code>
Creates action for deleting an entry.

**Kind**: global function  
**Returns**: <code>object</code> - action  

| Param | Type | Description |
| --- | --- | --- |
| entryId | <code>string</code> | entryId |

<a id="loadmoreentries"></a>

## loadMoreEntries() ⇒ <code>object</code>
Creates action for loading more entries (into feed).

**Kind**: global function  
**Returns**: <code>object</code> - action  
<a id="readentry"></a>

## readEntry(entryId, isScrollOver) ⇒ <code>object</code>
Creates an action for marking/logging an entry as read by user.

**Kind**: global function  
**Returns**: <code>object</code> - action  

| Param | Type | Description |
| --- | --- | --- |
| entryId | <code>string</code> | id of entry |
| isScrollOver | <code>boolean</code> | true if read-event was triggered while scrolling over entry, false otherwise (focus, click) |

<a id="postentry"></a>

## postEntry(isAnonymous, content, imageIds, extraQuestion) ⇒ <code>object</code>
Creates action for posting a new entry.

**Kind**: global function  
**Returns**: <code>object</code> - action  

| Param | Type | Description |
| --- | --- | --- |
| isAnonymous | <code>boolean</code> | true if posting is anonymous, otherwise false |
| content | <code>string</code> | content of comment |
| imageIds | <code>Array.&lt;string&gt;</code> | array of images (by id) to attach |
| extraQuestion | <code>Array.&lt;string&gt;</code> | array of question to append (prompts) |

<a id="subscribeentries"></a>

## subscribeEntries(entryIds) ⇒ <code>object</code>
Creates action for subscribing to entries.

**Kind**: global function  
**Returns**: <code>object</code> - action  

| Param | Type | Description |
| --- | --- | --- |
| entryIds | <code>Array.&lt;string&gt;</code> | array of entryIds to subscribe to |

<a id="subscribeentrylist"></a>

## subscribeEntryList(listType, onlyBookmarked) ⇒ <code>object</code>
Creates action for subscribing to a list of entries.

**Kind**: global function  
**Returns**: <code>object</code> - action  

| Param | Type | Description |
| --- | --- | --- |
| listType | <code>EntryListTypeEnum</code> | list type |
| onlyBookmarked | <code>boolean</code> | indicates if only bookmarked entries should be included in subscription |

<a id="unsubscribeentries"></a>

## unsubscribeEntries(entryIds) ⇒ <code>object</code>
Creates action for unsubscribing from entries.

**Kind**: global function  
**Returns**: <code>object</code> - action  

| Param | Type | Description |
| --- | --- | --- |
| entryIds | <code>Array.&lt;string&gt;</code> | array of entryIds to unsubscribe from |

<a id="unsubscribeentrylist"></a>

## unsubscribeEntryList() ⇒ <code>object</code>
Creates action for unsubscribing from (the previously subscribed) list of entries.

**Kind**: global function  
**Returns**: <code>object</code> - action  
<a id="updateentries"></a>

## updateEntries() ⇒ <code>object</code>
Creates action for updating entries feed (entryDict & idList).

**Kind**: global function  
**Returns**: <code>object</code> - action  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| entryDict | <code>EntryDict</code> | dictionary of entries |
| idList | <code>Array.&lt;string&gt;</code> &#124; <code>undefined</code> | list of entry-ids ordered/filtered according to subscribed list type. undefined if no list-sub is active |

