<a id="clientbroker"></a>

## ClientBroker
Class that manages client connections, listens to data updates
and distributes updates among connected clients.

**Kind**: global class  

* [ClientBroker](#clientbroker)
    * [new ClientBroker(io, controller)](#new95clientbroker95new)
    * [._io](#clientbroker4395io) : <code>SocketIO</code> ℗
    * [._controller](#clientbroker4395controller) : <code>Controller</code> ℗
    * [._clients](#clientbroker4395clients) : <code>Array.&lt;Client&gt;</code> ℗
    * [._handleConnection(socket)](#clientbroker4395handleconnection) ℗
    * [._handleCommentUpdated(eventId, entryId, commentId, affectsEntryMetadata)](#clientbroker4395handlecommentupdated) ⇒ <code>Promise</code> ℗
    * [._handleEntryUpdated(eventId, entryId)](#clientbroker4395handleentryupdated) ⇒ <code>Promise</code> ℗
    * [._handleEventUsersUpdated(eventId, userIds)](#clientbroker4395handleeventusersupdated) ⇒ <code>Promise</code> ℗
    * [._handleEventScreenshotsUpdated(eventId)](#clientbroker4395handleeventscreenshotsupdated) ⇒ <code>Promise</code> ℗
    * [.unregisterClient(client)](#clientbroker43unregisterclient)

<a id="new95clientbroker95new"></a>

### new ClientBroker(io, controller)
Creates a ClientBroker instance.


| Param | Type | Description |
| --- | --- | --- |
| io | <code>SocketIO</code> | socket io instance |
| controller | <code>Controller</code> | controller object containing initialized controllers |

<a id="clientbroker4395io"></a>

### clientBroker._io : <code>SocketIO</code> ℗
Used socketio instance.

**Kind**: instance property of [<code>ClientBroker</code>](#clientbroker)  
**Access**: private  
<a id="clientbroker4395controller"></a>

### clientBroker._controller : <code>Controller</code> ℗
Used Controller object.

**Kind**: instance property of [<code>ClientBroker</code>](#clientbroker)  
**Access**: private  
<a id="clientbroker4395clients"></a>

### clientBroker._clients : <code>Array.&lt;Client&gt;</code> ℗
Array of managed/connected client instances.

**Kind**: instance property of [<code>ClientBroker</code>](#clientbroker)  
**Access**: private  
<a id="clientbroker4395handleconnection"></a>

### clientBroker._handleConnection(socket) ℗
Eventhandler for new connection.

**Kind**: instance method of [<code>ClientBroker</code>](#clientbroker)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| socket | <code>SocketIoConnection</code> | socket connection to client |

<a id="clientbroker4395handlecommentupdated"></a>

### clientBroker._handleCommentUpdated(eventId, entryId, commentId, affectsEntryMetadata) ⇒ <code>Promise</code> ℗
Eventhandler for updated comment data.

**Kind**: instance method of [<code>ClientBroker</code>](#clientbroker)  
**Returns**: <code>Promise</code> - indicates success  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event of updated comment |
| entryId | <code>ObjectID</code> | id of entry of updated comment |
| commentId | <code>ObjectID</code> | id of comment which has been updated |
| affectsEntryMetadata | <code>boolean</code> | indicates if update of comment affects metadata of the superordinate entry |

<a id="clientbroker4395handleentryupdated"></a>

### clientBroker._handleEntryUpdated(eventId, entryId) ⇒ <code>Promise</code> ℗
Eventhandler for updated entry data.

**Kind**: instance method of [<code>ClientBroker</code>](#clientbroker)  
**Returns**: <code>Promise</code> - indicates success  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event of updated entry |
| entryId | <code>ObjectID</code> | id of entry which has been updated |

<a id="clientbroker4395handleeventusersupdated"></a>

### clientBroker._handleEventUsersUpdated(eventId, userIds) ⇒ <code>Promise</code> ℗
Eventhandler for updated user data (of event).

**Kind**: instance method of [<code>ClientBroker</code>](#clientbroker)  
**Returns**: <code>Promise</code> - indicates success  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event which users have been updated |
| userIds | <code>Array.&lt;string&gt;</code> | array of updated/affected userIds |

<a id="clientbroker4395handleeventscreenshotsupdated"></a>

### clientBroker._handleEventScreenshotsUpdated(eventId) ⇒ <code>Promise</code> ℗
Eventhandler for updated screenshot data (of event).

**Kind**: instance method of [<code>ClientBroker</code>](#clientbroker)  
**Returns**: <code>Promise</code> - indicates success  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event which screenshots have been updated |

<a id="clientbroker43unregisterclient"></a>

### clientBroker.unregisterClient(client)
Unregister a Client instance.
Passed instance will not be managed by this broker after call anymore.

**Kind**: instance method of [<code>ClientBroker</code>](#clientbroker)  

| Param | Type | Description |
| --- | --- | --- |
| client | <code>Client</code> | Client instance to unregister. |

