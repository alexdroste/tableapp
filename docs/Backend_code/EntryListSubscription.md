<a id="entrylistsubscription"></a>

## EntryListSubscription
Manages subscriptions for entry-lists.

**Kind**: global class  

* [EntryListSubscription](#entrylistsubscription)
    * [new EntryListSubscription(entriesController, type, eventId, userId, onlyBookmarked)](#new95entrylistsubscription95new)
    * _instance_
        * [._entriesController](#entrylistsubscription4395entriescontroller) : <code>EntriesController</code> ℗
        * [._type](#entrylistsubscription4395type) : <code>EntryListTypeEnum</code> ℗
        * [._eventId](#entrylistsubscription4395eventid) : <code>ObjectID</code> ℗
        * [._userId](#entrylistsubscription4395userid) : <code>string</code> ℗
        * [._onlyBookmarked](#entrylistsubscription4395onlybookmarked) : <code>boolean</code> ℗
        * [._list](#entrylistsubscription4395list) : <code>Array.&lt;EntriesController~EntryInfo&gt;</code> ℗
        * [._filter](#entrylistsubscription4395filter) : <code>SearchFilter</code> ℗
        * [._includeScore](#entrylistsubscription4395includescore) : <code>boolean</code> ℗
        * [._sort](#entrylistsubscription4395sort) : <code>object</code> ℗
        * [._sortList()](#entrylistsubscription4395sortlist) ℗
        * [._createLessFilter(list, testKey, compareKeyAcc, initialVal)](#entrylistsubscription4395createlessfilter) ⇒ [<code>SearchFilter</code>](#entrylistsubscription4646searchfilter) ℗
        * [.getIdList()](#entrylistsubscription43getidlist) ⇒ <code>Array.&lt;ObjectID&gt;</code>
        * [.getMoreEntries(limit)](#entrylistsubscription43getmoreentries) ⇒ [<code>Promise.&lt;GetMoreEntriesResult&gt;</code>](#entrylistsubscription4646getmoreentriesresult)
        * [.isIdInList(entryId)](#entrylistsubscription43isidinlist) ⇒ <code>boolean</code>
        * [.updateEntry(entryInfo)](#entrylistsubscription43updateentry) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * _inner_
        * [~SearchFilter](#entrylistsubscription4646searchfilter) : <code>object</code>
        * [~GetMoreEntriesResult](#entrylistsubscription4646getmoreentriesresult) : <code>object</code>

<a id="new95entrylistsubscription95new"></a>

### new EntryListSubscription(entriesController, type, eventId, userId, onlyBookmarked)
Creates an EntryListSubscription instance.


| Param | Type | Description |
| --- | --- | --- |
| entriesController | <code>EntriesController</code> | instance of EntriesController |
| type | <code>EntryListTypeEnum</code> | list type |
| eventId | <code>ObjectID</code> | id of event |
| userId | <code>string</code> | id of user |
| onlyBookmarked | <code>boolean</code> | indicates if only bookmarked entries should be included in subscription |

<a id="entrylistsubscription4395entriescontroller"></a>

### entryListSubscription._entriesController : <code>EntriesController</code> ℗
Instance of EntriesController that is beeing used.

**Kind**: instance property of [<code>EntryListSubscription</code>](#entrylistsubscription)  
**Access**: private  
<a id="entrylistsubscription4395type"></a>

### entryListSubscription._type : <code>EntryListTypeEnum</code> ℗
Type of list subscription.

**Kind**: instance property of [<code>EntryListSubscription</code>](#entrylistsubscription)  
**Access**: private  
<a id="entrylistsubscription4395eventid"></a>

### entryListSubscription._eventId : <code>ObjectID</code> ℗
Id of event.

**Kind**: instance property of [<code>EntryListSubscription</code>](#entrylistsubscription)  
**Access**: private  
<a id="entrylistsubscription4395userid"></a>

### entryListSubscription._userId : <code>string</code> ℗
Id of user.

**Kind**: instance property of [<code>EntryListSubscription</code>](#entrylistsubscription)  
**Access**: private  
<a id="entrylistsubscription4395onlybookmarked"></a>

### entryListSubscription._onlyBookmarked : <code>boolean</code> ℗
Indicates if only bookmarked entries should be included in subscription.

**Kind**: instance property of [<code>EntryListSubscription</code>](#entrylistsubscription)  
**Access**: private  
<a id="entrylistsubscription4395list"></a>

### entryListSubscription._list : <code>Array.&lt;EntriesController~EntryInfo&gt;</code> ℗
Internal list of entry infos.
Entry infos are objects with neccessary properties (e.g. timestamp)
to perform certain operations regarding list subscriptions.

**Kind**: instance property of [<code>EntryListSubscription</code>](#entrylistsubscription)  
**Access**: private  
<a id="entrylistsubscription4395filter"></a>

### entryListSubscription._filter : <code>SearchFilter</code> ℗
Internal search filter.

**Kind**: instance property of [<code>EntryListSubscription</code>](#entrylistsubscription)  
**Access**: private  
<a id="entrylistsubscription4395includescore"></a>

### entryListSubscription._includeScore : <code>boolean</code> ℗
Indicates if search results from internal search (entry) requests 
should contain a score property.

**Kind**: instance property of [<code>EntryListSubscription</code>](#entrylistsubscription)  
**Access**: private  
<a id="entrylistsubscription4395sort"></a>

### entryListSubscription._sort : <code>object</code> ℗
Object that describes sorting behaviour of entries.

E.g. `{ score: -1, timestamp: -1 }` will sort for score (descending)
first and timestamp (descending) after.

**Kind**: instance property of [<code>EntryListSubscription</code>](#entrylistsubscription)  
**Access**: private  
<a id="entrylistsubscription4395sortlist"></a>

### entryListSubscription._sortList() ℗
(Re-)sorts internal entry infos list based on list type.

**Kind**: instance method of [<code>EntryListSubscription</code>](#entrylistsubscription)  
**Access**: private  
<a id="entrylistsubscription4395createlessfilter"></a>

### entryListSubscription._createLessFilter(list, testKey, compareKeyAcc, initialVal) ⇒ <code>SearchFilter</code> ℗
Creates a less filter based on testKey and compareKeyAcc.

**Kind**: instance method of [<code>EntryListSubscription</code>](#entrylistsubscription)  
**Returns**: [<code>SearchFilter</code>](#entrylistsubscription4646searchfilter) - less filter  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| list | <code>Array.&lt;object&gt;</code> | array of objects to create less filter for |
| testKey | <code>string</code> | key to test for in objects |
| compareKeyAcc | <code>string</code> | key to minimize and to compare against (must also be a key in initialVal) |
| initialVal | <code>object</code> | initial filter to start with |

<a id="entrylistsubscription43getidlist"></a>

### entryListSubscription.getIdList() ⇒ <code>Array.&lt;ObjectID&gt;</code>
Returns list of entry-ids that are subscribed according to list type
and filter. Order of ids is based on configured sorting.

**Kind**: instance method of [<code>EntryListSubscription</code>](#entrylistsubscription)  
**Returns**: <code>Array.&lt;ObjectID&gt;</code> - array of entry-ids  
<a id="entrylistsubscription43getmoreentries"></a>

### entryListSubscription.getMoreEntries(limit) ⇒ <code>Promise.&lt;GetMoreEntriesResult&gt;</code>
Retrieve next x (:= limit) entries according to the internal search filter.

**Kind**: instance method of [<code>EntryListSubscription</code>](#entrylistsubscription)  
**Returns**: [<code>Promise.&lt;GetMoreEntriesResult&gt;</code>](#entrylistsubscription4646getmoreentriesresult) - resolves to an object containing addedEntryIds and hasMoreEntriesToLoad  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| limit | <code>number</code> | <code>15</code> | limtis the number of entries to receive (x := limit) |

<a id="entrylistsubscription43isidinlist"></a>

### entryListSubscription.isIdInList(entryId) ⇒ <code>boolean</code>
Checks if entry with specified id is subscribed by this instance.

**Kind**: instance method of [<code>EntryListSubscription</code>](#entrylistsubscription)  
**Returns**: <code>boolean</code> - indicates if entry is subscribed  

| Param | Type | Description |
| --- | --- | --- |
| entryId | <code>ObjectID</code> | id of entry to check |

<a id="entrylistsubscription43updateentry"></a>

### entryListSubscription.updateEntry(entryInfo) ⇒ <code>Promise.&lt;boolean&gt;</code>
Update a single entry by supplied entryInfo.

**Kind**: instance method of [<code>EntryListSubscription</code>](#entrylistsubscription)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - true indicates update merged, false update ignored/not relevant for this subscription  

| Param | Type | Description |
| --- | --- | --- |
| entryInfo | <code>EntriesController~EntryInfo</code> | entryInfo of updated entry |

<a id="entrylistsubscription4646searchfilter"></a>

### EntryListSubscription~SearchFilter : <code>object</code>
Represents a search filter.

**Kind**: inner typedef of [<code>EntryListSubscription</code>](#entrylistsubscription)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| bookmarkForUser | <code>string</code> &#124; <code>undefined</code> | id of user, only include entries if bookmarked by this user |
| excludeDeletedEntries | <code>boolean</code> | indicates whether deleted entries should be ignored |
| excludedEntryIds | <code>Array.&lt;ObjectID&gt;</code> | entries to exclude |
| maxScore | <code>number</code> | maximum score to include |
| maxTimestamp | <code>number</code> | maximum (entry-)timestamp to include |
| minTimestamp | <code>number</code> | minimum (entry-)timestamp to include |

<a id="entrylistsubscription4646getmoreentriesresult"></a>

### EntryListSubscription~GetMoreEntriesResult : <code>object</code>
Result of getMoreEntries call.

**Kind**: inner typedef of [<code>EntryListSubscription</code>](#entrylistsubscription)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| addedEntryIds | <code>Array.&lt;ObjectID&gt;</code> | array of entry-ids that were found |
| hasMoreEntriesToLoad | <code>boolean</code> | indicates if more entries can be received by calling the function again |

