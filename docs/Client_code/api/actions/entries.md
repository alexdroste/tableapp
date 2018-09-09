<a id="changebookmark"></a>

## changeBookmark(api, entryId, bookmark) ⇒ <code>Promise</code>
API-call: change bookmark (set/unset) for entry.

**Kind**: global function  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiConnection</code> | ApiConnection instance |
| entryId | <code>string</code> | entryId |
| bookmark | <code>boolean</code> | true sets bookmark, false unsets |

<a id="changefollow"></a>

## changeFollow(api, entryId, follow) ⇒ <code>Promise</code>
API-call: change follow-state for entry.

**Kind**: global function  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiConnection</code> | ApiConnection instance |
| entryId | <code>string</code> | entryId |
| follow | <code>boolean</code> | true sets follow, false unsets |

<a id="changevote"></a>

## changeVote(api, entryId, vote) ⇒ <code>Promise</code>
API-call: change vote for entry.

**Kind**: global function  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiConnection</code> | ApiConnection instance |
| entryId | <code>string</code> | entryId |
| vote | <code>number</code> | number representing vote (>0: upvote, 0: no vote, <0: downvote) |

<a id="loadmoreentries"></a>

## loadMoreEntries(api) ⇒ <code>Promise.&lt;LoadMoreEntriesResult&gt;</code>
API-call: requests more entries (depending on active list subscription).

**Kind**: global function  
**Returns**: [<code>Promise.&lt;LoadMoreEntriesResult&gt;</code>](#loadmoreentriesresult) - resolves to object containing more entries  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiConnection</code> | ApiConnection instance |

<a id="postentry"></a>

## postEntry(api, isAnonymous, content, imageDataArr) ⇒ <code>Promise</code>
API-call: post new entry.

**Kind**: global function  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiConnection</code> | ApiConnection instance |
| isAnonymous | <code>boolean</code> | true if posting is anonymous, otherwise false |
| content | <code>string</code> | content of comment |
| imageDataArr | <code>Array.&lt;string&gt;</code> | array of attached images (base64 encoded) |

<a id="subscribeentries"></a>

## subscribeEntries(api, entryIds) ⇒ <code>Promise.&lt;SubscribeEntriesResult&gt;</code>
API-call: subscribe to entries (by ids).

**Kind**: global function  
**Returns**: [<code>Promise.&lt;SubscribeEntriesResult&gt;</code>](#subscribeentriesresult) - resolves to object containing EntryDict  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiConnection</code> | ApiConnection instance |
| entryIds | <code>Array.&lt;string&gt;</code> | array of entryIds to subscribe to |

<a id="subscribeentrylist"></a>

## subscribeEntryList(api, listType, onlyBookmarked) ⇒ <code>Promise</code>
API-call: subscribe to entry-list (by type).

**Kind**: global function  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiConnection</code> | ApiConnection instance |
| listType | <code>EntryListTypeEnum</code> | list type |
| onlyBookmarked | <code>boolean</code> | indicates if only bookmarked entries should be included in subscription |

<a id="unsubscribeentries"></a>

## unsubscribeEntries(api, entryIds) ⇒ <code>Promise</code>
API-call: unsubscribe from (previously subscribed) entries (by ids).

**Kind**: global function  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiConnection</code> | ApiConnection instance |
| entryIds | <code>Array.&lt;string&gt;</code> | array of entryIds to unsubscribe from |

<a id="unsubscribeentrylist"></a>

## unsubscribeEntryList(api) ⇒ <code>Promise</code>
API-call: unsubscribe from (previously subscribed) entry-list.

**Kind**: global function  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiConnection</code> | ApiConnection instance |

<a id="loadmoreentriesresult"></a>

## LoadMoreEntriesResult : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| entryDict | <code>EntryDict</code> | dictionary of entries |
| idList | <code>Array.&lt;string&gt;</code> | list of entry-ids ordered/filtered according to subscribed list type |
| moreEntriesToLoad | <code>boolean</code> | indicates if more entries can be load, false if client already subscribed to all available entries in list |

<a id="subscribeentriesresult"></a>

## SubscribeEntriesResult : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| entryDict | <code>EntryDict</code> | EntryDict |

