<a id="client"></a>

## Client
Class representing a single client connection.

**Kind**: global class  

* [Client](#client)
    * [new Client(socket, controller, broker)](#new95client95new)
    * _instance_
        * [.connectTimestamp](#client43connecttimestamp) : <code>number</code>
        * [.id](#client43id) : <code>number</code>
        * [.ip](#client43ip) : <code>string</code>
        * [.userAgent](#client43useragent) : <code>string</code>
        * [._socket](#client4395socket) : <code>SocketIoConnection</code> ℗
        * [._controller](#client4395controller) : <code>Controller</code> ℗
        * [._broker](#client4395broker) : <code>ClientBroker</code> ℗
        * [.activeEventId](#client43activeeventid) : <code>ObjectID</code> &#124; <code>null</code>
        * [.commentsSubscribedForEntryId](#client43commentssubscribedforentryid) : <code>ObjectID</code> &#124; <code>null</code>
        * [.entriesSubscription](#client43entriessubscription)
            * [.listSubscription](#client43entriessubscription46listsubscription) : <code>EntryListSubscription</code> &#124; <code>null</code>
            * [.subscribedIds](#client43entriessubscription46subscribedids) : <code>Array.&lt;ObjectID&gt;</code>
        * [.permissionLevel](#client43permissionlevel) : <code>PermissionLevelEnum</code>
        * [.subscribedFullEventDict](#client43subscribedfulleventdict) : <code>boolean</code>
        * [.userId](#client43userid) : <code>string</code> &#124; <code>null</code>
        * [._init()](#client4395init) ℗
        * [._handleDisconnect()](#client4395handledisconnect) ℗
        * [._setupAfterAuthentication(loginData)](#client4395setupafterauthentication) ⇒ <code>Promise</code> ℗
        * [._handleChangeVoteForComment(data, cb)](#client4395handlechangevoteforcomment) ⇒ <code>Promise</code> ℗
        * [._handlePostComment(data, cb)](#client4395handlepostcomment) ⇒ <code>Promise</code> ℗
        * [._handleSubscribeCommentsForEntry(data, cb)](#client4395handlesubscribecommentsforentry) ⇒ <code>Promise</code> ℗
        * [._handleUnsubscribeCommentsForEntry(data, cb)](#client4395handleunsubscribecommentsforentry) ⇒ <code>Promise</code> ℗
        * [._handleBroadcastNewImage(data, cb)](#client4395handlebroadcastnewimage) ⇒ <code>Promise</code> ℗
        * [._handleChangeBookmark(data, cb)](#client4395handlechangebookmark) ⇒ <code>Promise</code> ℗
        * [._handleChangeFollow(data, cb)](#client4395handlechangefollow) ⇒ <code>Promise</code> ℗
        * [._handleChangeVote(data, cb)](#client4395handlechangevote) ⇒ <code>Promise</code> ℗
        * [._handleLoadMoreEntries(data, cb)](#client4395handleloadmoreentries) ⇒ <code>Promise</code> ℗
        * [._handlePostEntry(data, cb)](#client4395handlepostentry) ⇒ <code>Promise</code> ℗
        * [._handleSubscribeEntries(data, cb)](#client4395handlesubscribeentries) ⇒ <code>Promise</code> ℗
        * [._handleSubscribeEntryList(data, cb)](#client4395handlesubscribeentrylist) ℗
        * [._handleUnsubscribeEntries(data, cb)](#client4395handleunsubscribeentries) ℗
        * [._handleUnsubscribeEntryList(data, cb)](#client4395handleunsubscribeentrylist) ℗
        * [._handleSubscribeFullEventDict(data, cb)](#client4395handlesubscribefulleventdict) ⇒ <code>Promise</code> ℗
        * [._handleUnsubscribeFullEventDict(data, cb)](#client4395handleunsubscribefulleventdict) ℗
        * [._handleJoinEvent(data, cb)](#client4395handlejoinevent) ⇒ <code>Promise</code> ℗
        * [._handleLeaveEvent(data, cb)](#client4395handleleaveevent) ⇒ <code>Promise</code> ℗
        * [._handleSwitchActiveEvent(data, cb)](#client4395handleswitchactiveevent) ⇒ <code>Promise</code> ℗
        * [._switchActiveEvent(newEventId)](#client4395switchactiveevent) ⇒ <code>Promise</code> ℗
        * [._handleLoadImages(data, cb)](#client4395handleloadimages) ⇒ <code>Promise</code> ℗
        * [._handleContinueSession(data, cb)](#client4395handlecontinuesession) ⇒ <code>Promise</code> ℗
        * [._handleLogin(data, cb)](#client4395handlelogin) ⇒ <code>Promise</code> ℗
        * [._handleLogout(data, cb)](#client4395handlelogout) ℗
        * [.on(event, requiresAuthentication, requiresActiveEvent, handler)](#client43on)
        * [.emitUpdateCommentDict(commentDict)](#client43emitupdatecommentdict)
        * [.updateComment(entryId, commentId)](#client43updatecomment) ⇒ <code>Promise</code>
        * [.emitUpdateEntries(entryDict, [idList])](#client43emitupdateentries)
        * [.updateEntry(entryInfo)](#client43updateentry) ⇒ <code>Promise</code>
        * [.emitUpdateRoleList(roleList)](#client43emitupdaterolelist)
        * [.emitUpdateUserDict(userDict)](#client43emitupdateuserdict)
        * [.emitUpdateEventDict(eventDict)](#client43emitupdateeventdict)
        * [.updateEventDict(eventIds)](#client43updateeventdict) ⇒ <code>Promise</code>
        * [.emitUpdateEventScreenshotIds(imageIds)](#client43emitupdateeventscreenshotids)
    * _inner_
        * [~messageAcknowledgementCallback](#client4646messageacknowledgementcallback) : <code>function</code>
        * [~eventHandler](#client4646eventhandler) : <code>function</code>

<a id="new95client95new"></a>

### new Client(socket, controller, broker)
Creates a Client instance.


| Param | Type | Description |
| --- | --- | --- |
| socket | <code>SocketIoConnection</code> | socket connection to client |
| controller | <code>Controller</code> | controller object containing initialized controllers |
| broker | <code>ClientBroker</code> | reference to parent ClientBroker instance |

<a id="client43connecttimestamp"></a>

### client.connectTimestamp : <code>number</code>
Timestamp of connect-event.

**Kind**: instance property of [<code>Client</code>](#client)  
<a id="client43id"></a>

### client.id : <code>number</code>
Internal (process-unique) id for a client.

**Kind**: instance property of [<code>Client</code>](#client)  
<a id="client43ip"></a>

### client.ip : <code>string</code>
IP-Address of connected client.

**Kind**: instance property of [<code>Client</code>](#client)  
<a id="client43useragent"></a>

### client.userAgent : <code>string</code>
User-Agent of connected client.

**Kind**: instance property of [<code>Client</code>](#client)  
<a id="client4395socket"></a>

### client._socket : <code>SocketIoConnection</code> ℗
Open socket connection to client.

**Kind**: instance property of [<code>Client</code>](#client)  
**Access**: private  
<a id="client4395controller"></a>

### client._controller : <code>Controller</code> ℗
Controller object containing initialized controllers.

**Kind**: instance property of [<code>Client</code>](#client)  
**Access**: private  
<a id="client4395broker"></a>

### client._broker : <code>ClientBroker</code> ℗
Reference to parent ClientBroker instance that manages this instance.

**Kind**: instance property of [<code>Client</code>](#client)  
**Access**: private  
<a id="client43activeeventid"></a>

### client.activeEventId : <code>ObjectID</code> &#124; <code>null</code>
Id of active event.

**Kind**: instance property of [<code>Client</code>](#client)  
<a id="client43commentssubscribedforentryid"></a>

### client.commentsSubscribedForEntryId : <code>ObjectID</code> &#124; <code>null</code>
Id of entry client subscribed comments of.
Null indicates that no comments(-updates/-data) are subscribed.

**Kind**: instance property of [<code>Client</code>](#client)  
<a id="client43entriessubscription"></a>

### client.entriesSubscription
Infos about clients subscribed entries.

**Kind**: instance property of [<code>Client</code>](#client)  

* [.entriesSubscription](#client43entriessubscription)
    * [.listSubscription](#client43entriessubscription46listsubscription) : <code>EntryListSubscription</code> &#124; <code>null</code>
    * [.subscribedIds](#client43entriessubscription46subscribedids) : <code>Array.&lt;ObjectID&gt;</code>

<a id="client43entriessubscription46listsubscription"></a>

#### entriesSubscription.listSubscription : <code>EntryListSubscription</code> &#124; <code>null</code>
List subscription instance.
Null indicates that no list subscription is active.

**Kind**: static property of [<code>entriesSubscription</code>](#client43entriessubscription)  
<a id="client43entriessubscription46subscribedids"></a>

#### entriesSubscription.subscribedIds : <code>Array.&lt;ObjectID&gt;</code>
List of subscribed entryIds.

**Kind**: static property of [<code>entriesSubscription</code>](#client43entriessubscription)  
<a id="client43permissionlevel"></a>

### client.permissionLevel : <code>PermissionLevelEnum</code>
Permissionlevel of user for active event. 
Defaults to NOT_A_USER.

**Kind**: instance property of [<code>Client</code>](#client)  
<a id="client43subscribedfulleventdict"></a>

### client.subscribedFullEventDict : <code>boolean</code>
Indicates if client subcribed to full EventDict.
Defaults to false.

**Kind**: instance property of [<code>Client</code>](#client)  
<a id="client43userid"></a>

### client.userId : <code>string</code> &#124; <code>null</code>
Id of authenticated user.

**Kind**: instance property of [<code>Client</code>](#client)  
<a id="client4395init"></a>

### client._init() ℗
Initializes / resets client-state properties.

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  
<a id="client4395handledisconnect"></a>

### client._handleDisconnect() ℗
Eventhandler for socket disconnect event.

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  
<a id="client4395setupafterauthentication"></a>

### client._setupAfterAuthentication(loginData) ⇒ <code>Promise</code> ℗
Initializes instance-state by users login-data.

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| loginData | <code>UserController~LoginData</code> | loginData object |

<a id="client4395handlechangevoteforcomment"></a>

### client._handleChangeVoteForComment(data, cb) ⇒ <code>Promise</code> ℗
Eventhandler for vote change on comment.

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> |  |
| data.entryId | <code>string</code> | entryId (as string) |
| data.commentId | <code>string</code> | commentId (as string) |
| data.vote | <code>number</code> | number representing vote (>0: upvote, 0: no vote, <0: downvote) |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client4395handlepostcomment"></a>

### client._handlePostComment(data, cb) ⇒ <code>Promise</code> ℗
Eventhandler for new comment posted.

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> |  |
| data.content | <code>string</code> | content of comment |
| data.entryId | <code>string</code> | entryId (as string) |
| data.imageDataArr | <code>Array.&lt;string&gt;</code> | array of attached images (base64 encoded) |
| data.isAnonymous | <code>boolean</code> | true if posting is anonymous, otherwise false |
| data.parentId | <code>string</code> &#124; <code>null</code> | id of parent-comment (as string). null for toplevel |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client4395handlesubscribecommentsforentry"></a>

### client._handleSubscribeCommentsForEntry(data, cb) ⇒ <code>Promise</code> ℗
Eventhandler for comment subscription request (for entry).

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> |  |
| data.entryId | <code>string</code> | entryId (as string) |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client4395handleunsubscribecommentsforentry"></a>

### client._handleUnsubscribeCommentsForEntry(data, cb) ⇒ <code>Promise</code> ℗
Eventhandler for comment unsubscription request.

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | empty object |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client4395handlebroadcastnewimage"></a>

### client._handleBroadcastNewImage(data, cb) ⇒ <code>Promise</code> ℗
Eventhandler for image/screenshot broadcast.

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>string</code> | base64 image-data of full image |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client4395handlechangebookmark"></a>

### client._handleChangeBookmark(data, cb) ⇒ <code>Promise</code> ℗
Eventhandler for bookmark changed (for entry).

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>string</code> |  |
| data.entryId | <code>string</code> | id of entry (as string) |
| data.bookmark | <code>boolean</code> | true sets bookmark, false unsets |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client4395handlechangefollow"></a>

### client._handleChangeFollow(data, cb) ⇒ <code>Promise</code> ℗
Eventhandler for follow-state changed (for entry).

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>string</code> |  |
| data.entryId | <code>string</code> | id of entry (as string) |
| data.follow | <code>boolean</code> | true sets follow, false unsets |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client4395handlechangevote"></a>

### client._handleChangeVote(data, cb) ⇒ <code>Promise</code> ℗
Eventhandler for vote change on entry.

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> |  |
| data.entryId | <code>string</code> | entryId (as string) |
| data.vote | <code>number</code> | number representing vote (>0: upvote, 0: no vote, <0: downvote) |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client4395handleloadmoreentries"></a>

### client._handleLoadMoreEntries(data, cb) ⇒ <code>Promise</code> ℗
Eventhandler for load more entries request (depends on active list subscription).

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | empty object |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client4395handlepostentry"></a>

### client._handlePostEntry(data, cb) ⇒ <code>Promise</code> ℗
Eventhandler for new entry posted.

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> |  |
| data.content | <code>string</code> | content of comment |
| data.imageDataArr | <code>Array.&lt;string&gt;</code> | array of attached images (base64 encoded) |
| data.isAnonymous | <code>boolean</code> | true if posting is anonymous, otherwise false |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client4395handlesubscribeentries"></a>

### client._handleSubscribeEntries(data, cb) ⇒ <code>Promise</code> ℗
Eventhandler for subscribe to entries request (by ids).

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> |  |
| data.entryIds | <code>Array.&lt;string&gt;</code> | array of entryIds (as strings) |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client4395handlesubscribeentrylist"></a>

### client._handleSubscribeEntryList(data, cb) ℗
Eventhandler for subscribe to entry-list request.

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> |  |
| data.listType | <code>EntryListTypeEnum</code> | list type |
| data.onlyBookmarked | <code>boolean</code> | indicates if only bookmarked entries should be included in subscription |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client4395handleunsubscribeentries"></a>

### client._handleUnsubscribeEntries(data, cb) ℗
Eventhandler for unsubscribe from (previously subscribed) entries request (by ids).

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> |  |
| data.entryIds | <code>Array.&lt;string&gt;</code> | array of entryIds (as strings) |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client4395handleunsubscribeentrylist"></a>

### client._handleUnsubscribeEntryList(data, cb) ℗
Eventhandler for unsubscribe from (previously subscribed) entry-list request.

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | empty object |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client4395handlesubscribefulleventdict"></a>

### client._handleSubscribeFullEventDict(data, cb) ⇒ <code>Promise</code> ℗
Eventhandler for subscribe to full EventDict request.

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | empty object |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client4395handleunsubscribefulleventdict"></a>

### client._handleUnsubscribeFullEventDict(data, cb) ℗
Eventhandler for unsubscribe from full EventDict request.

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | empty object |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client4395handlejoinevent"></a>

### client._handleJoinEvent(data, cb) ⇒ <code>Promise</code> ℗
Eventhandler for join-event request.

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> |  |
| data.eventId | <code>string</code> | eventId (as string) |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client4395handleleaveevent"></a>

### client._handleLeaveEvent(data, cb) ⇒ <code>Promise</code> ℗
Eventhandler for leave-event request.

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> |  |
| data.eventId | <code>string</code> | eventId (as string) |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client4395handleswitchactiveevent"></a>

### client._handleSwitchActiveEvent(data, cb) ⇒ <code>Promise</code> ℗
Eventhandler for switch-active-event request.

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> |  |
| data.eventId | <code>string</code> | eventId (as string) |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client4395switchactiveevent"></a>

### client._switchActiveEvent(newEventId) ⇒ <code>Promise</code> ℗
Performs switch of active event. Initializes corresponding client context.

**Kind**: instance method of [<code>Client</code>](#client)  
**Returns**: <code>Promise</code> - indicates success  
**Access**: private  
**Todo**

- [ ] reorganize position of this function


| Param | Type | Description |
| --- | --- | --- |
| newEventId | <code>ObjectID</code> | id of event to switch to |

<a id="client4395handleloadimages"></a>

### client._handleLoadImages(data, cb) ⇒ <code>Promise</code> ℗
Eventhandler for load images request.

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> |  |
| data.imageIds | <code>Array.&lt;string&gt;</code> | array of ids of images (as string) to retrieve |
| data.onlyThumbnails | <code>boolean</code> | indicates if only the thumbnails should be queried |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client4395handlecontinuesession"></a>

### client._handleContinueSession(data, cb) ⇒ <code>Promise</code> ℗
Eventhandler for continue session request.

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> |  |
| data.sessionToken | <code>string</code> | sessionToken |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client4395handlelogin"></a>

### client._handleLogin(data, cb) ⇒ <code>Promise</code> ℗
Eventhandler for login request.

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> |  |
| data.email | <code>string</code> | email of user |
| data.password | <code>string</code> | password of user |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client4395handlelogout"></a>

### client._handleLogout(data, cb) ℗
Eventhandler for logout request.

**Kind**: instance method of [<code>Client</code>](#client)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | empty object |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

<a id="client43on"></a>

### client.on(event, requiresAuthentication, requiresActiveEvent, handler)
Registers an event-handler. Calls event handler with current context (this).

**Kind**: instance method of [<code>Client</code>](#client)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | event-identifier |
| requiresAuthentication | <code>boolean</code> | true if event-handler requries authentication |
| requiresActiveEvent | <code>boolean</code> | true if event-handler requires an event to be active |
| handler | [<code>eventHandler</code>](#client4646eventhandler) | event-handler |

<a id="client43emitupdatecommentdict"></a>

### client.emitUpdateCommentDict(commentDict)
Sends specified CommentDict to client.

**Kind**: instance method of [<code>Client</code>](#client)  

| Param | Type | Description |
| --- | --- | --- |
| commentDict | <code>CommentsController~CommentDict</code> | CommentDict to send |

<a id="client43updatecomment"></a>

### client.updateComment(entryId, commentId) ⇒ <code>Promise</code>
Sends a specified comment by its id to client.
Should get called when subscribed comment got updated.

**Kind**: instance method of [<code>Client</code>](#client)  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| entryId | <code>ObjectID</code> | id of entry of updated comment |
| commentId | <code>ObjectID</code> | id of comment which has been updated |

<a id="client43emitupdateentries"></a>

### client.emitUpdateEntries(entryDict, [idList])
Sends specified EntryDict (and optional corresponding idList from list subscription) to client.

**Kind**: instance method of [<code>Client</code>](#client)  

| Param | Type | Description |
| --- | --- | --- |
| entryDict | <code>EntriesController~EntryDict</code> | EntryDict to send |
| [idList] | <code>Array.&lt;ObjectID&gt;</code> | updated id list for list subscription (optional) |

<a id="client43updateentry"></a>

### client.updateEntry(entryInfo) ⇒ <code>Promise</code>
Checks if client subscribed to entry (specified by EntryInfo), 
updates list subscription and sends entry-update to client if neccessary.

**Kind**: instance method of [<code>Client</code>](#client)  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| entryInfo | <code>EntriesController~EntryInfo</code> | EntryInfo of entry to update |

<a id="client43emitupdaterolelist"></a>

### client.emitUpdateRoleList(roleList)
Sends a specified RoleList to client.

**Kind**: instance method of [<code>Client</code>](#client)  

| Param | Type | Description |
| --- | --- | --- |
| roleList | <code>EventsController~RoleList</code> | role-list to send |

<a id="client43emitupdateuserdict"></a>

### client.emitUpdateUserDict(userDict)
Sends a specified UserDict to client.

**Kind**: instance method of [<code>Client</code>](#client)  

| Param | Type | Description |
| --- | --- | --- |
| userDict | <code>EventsController~UserDict</code> | UserDict to send |

<a id="client43emitupdateeventdict"></a>

### client.emitUpdateEventDict(eventDict)
Sends a specified EventDict to client.

**Kind**: instance method of [<code>Client</code>](#client)  

| Param | Type | Description |
| --- | --- | --- |
| eventDict | <code>EventsController~EventDict</code> | EventDict to send |

<a id="client43updateeventdict"></a>

### client.updateEventDict(eventIds) ⇒ <code>Promise</code>
Retrieves event-data for specified eventIds 
and sends an EventDict-update to the client.

**Kind**: instance method of [<code>Client</code>](#client)  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| eventIds | <code>Array.&lt;ObjectID&gt;</code> | array of eventIds that got updated  and need to be updated on the client |

<a id="client43emitupdateeventscreenshotids"></a>

### client.emitUpdateEventScreenshotIds(imageIds)
Sends specified imageIds (as available event-screenshots for the active event)
to the client.

**Kind**: instance method of [<code>Client</code>](#client)  

| Param | Type | Description |
| --- | --- | --- |
| imageIds | <code>Array.&lt;ObjectID&gt;</code> | array of imageIds for screenshots of active event |

<a id="client4646messageacknowledgementcallback"></a>

### Client~messageAcknowledgementCallback : <code>function</code>
Socket message callback function.

**Kind**: inner typedef of [<code>Client</code>](#client)  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>\*</code> | error object, message / null or undefined for "no error" |
| result | <code>\*</code> | data to send back to client |

<a id="client4646eventhandler"></a>

### Client~eventHandler : <code>function</code>
Handler for client-event.

**Kind**: inner typedef of [<code>Client</code>](#client)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | event-data |
| cb | [<code>messageAcknowledgementCallback</code>](#client4646messageacknowledgementcallback) | data-handled callback |

