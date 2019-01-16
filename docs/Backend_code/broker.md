<a id="module95clientbroker"></a>

## clientBroker
Module that manages client connections, accepts data updates
and distributes updates among connected clients.


* [clientBroker](#module95clientbroker)
    * _static_
        * [.handleConnection(socket)](#module95clientbroker46handleconnection)
        * [.unregisterClient(client)](#module95clientbroker46unregisterclient)
        * [.handleCommentUpdated(eventId, entryId, commentId, affectsEntryMetadata)](#module95clientbroker46handlecommentupdated) ⇒ <code>Promise</code>
        * [.handleEntryUpdated(eventId, entryId)](#module95clientbroker46handleentryupdated) ⇒ <code>Promise</code>
        * [.handleEventUsersUpdated(eventId, userIds)](#module95clientbroker46handleeventusersupdated) ⇒ <code>Promise</code>
        * [.handleEventScreenshotsUpdated(eventId)](#module95clientbroker46handleeventscreenshotsupdated) ⇒ <code>Promise</code>
    * _inner_
        * [~_clients](#module95clientbroker464695clients) : <code>Array.&lt;Client&gt;</code> ℗

<a id="module95clientbroker46handleconnection"></a>

### clientBroker.handleConnection(socket)
Eventhandler for new connection.

**Kind**: static method of [<code>clientBroker</code>](#module95clientbroker)  

| Param | Type | Description |
| --- | --- | --- |
| socket | <code>SocketIoConnection</code> | socket connection to client |

<a id="module95clientbroker46unregisterclient"></a>

### clientBroker.unregisterClient(client)
Unregister a Client instance.
Passed instance will not be managed by this broker after call anymore.

**Kind**: static method of [<code>clientBroker</code>](#module95clientbroker)  

| Param | Type | Description |
| --- | --- | --- |
| client | <code>Client</code> | Client instance to unregister. |

<a id="module95clientbroker46handlecommentupdated"></a>

### clientBroker.handleCommentUpdated(eventId, entryId, commentId, affectsEntryMetadata) ⇒ <code>Promise</code>
Eventhandler for updated comment data.

**Kind**: static method of [<code>clientBroker</code>](#module95clientbroker)  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event of updated comment |
| entryId | <code>ObjectID</code> | id of entry of updated comment |
| commentId | <code>ObjectID</code> | id of comment which has been updated |
| affectsEntryMetadata | <code>boolean</code> | indicates if update of comment affects metadata of the superordinate entry |

<a id="module95clientbroker46handleentryupdated"></a>

### clientBroker.handleEntryUpdated(eventId, entryId) ⇒ <code>Promise</code>
Eventhandler for updated entry data.

**Kind**: static method of [<code>clientBroker</code>](#module95clientbroker)  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event of updated entry |
| entryId | <code>ObjectID</code> | id of entry which has been updated |

<a id="module95clientbroker46handleeventusersupdated"></a>

### clientBroker.handleEventUsersUpdated(eventId, userIds) ⇒ <code>Promise</code>
Eventhandler for updated user data (of event).

**Kind**: static method of [<code>clientBroker</code>](#module95clientbroker)  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event which users have been updated |
| userIds | <code>Array.&lt;string&gt;</code> | array of updated/affected userIds |

<a id="module95clientbroker46handleeventscreenshotsupdated"></a>

### clientBroker.handleEventScreenshotsUpdated(eventId) ⇒ <code>Promise</code>
Eventhandler for updated screenshot data (of event).

**Kind**: static method of [<code>clientBroker</code>](#module95clientbroker)  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event which screenshots have been updated |

<a id="module95clientbroker464695clients"></a>

### clientBroker~_clients : <code>Array.&lt;Client&gt;</code> ℗
Array of managed/connected client instances.

**Kind**: inner property of [<code>clientBroker</code>](#module95clientbroker)  
**Access**: private  
