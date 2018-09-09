<a id="apiconnection"></a>

## ApiConnection
Represents connection to (WebSocket-)API.
You must call `initialize()` method after construction.

**Kind**: global class  

* [ApiConnection](#apiconnection)
    * _instance_
        * [.initialize(url, dispatch, getState)](#apiconnection43initialize)
        * [._transitionToDisconnectedState()](#apiconnection4395transitiontodisconnectedstate) ℗
        * [._changeIsConnected(isConnected)](#apiconnection4395changeisconnected) ℗
        * [.request(event, [data])](#apiconnection43request) ⇒ <code>Promise.&lt;\*&gt;</code>
        * [.on(event, cb)](#apiconnection43on)
        * [._handleConnect()](#apiconnection4395handleconnect) ℗
        * [._handleConnectError(reason)](#apiconnection4395handleconnecterror) ℗
        * [._handleDisconnect(reason)](#apiconnection4395handledisconnect) ℗
    * _inner_
        * [~eventListenerCallback](#apiconnection4646eventlistenercallback) : <code>function</code>

<a id="apiconnection43initialize"></a>

### apiConnection.initialize(url, dispatch, getState)
Initializes ApiConnection instance. Must be called after instance creation.

**Kind**: instance method of [<code>ApiConnection</code>](#apiconnection)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | url socketAPI is listening on |
| dispatch | <code>dispatchAction</code> | function to dispatch an action to the store |
| getState | <code>getStateOfStore</code> | function to retrieve current app-state from store |

<a id="apiconnection4395transitiontodisconnectedstate"></a>

### apiConnection._transitionToDisconnectedState() ℗
Dispatches changeConnectionState actions to transition from TEMPORARILY_DISCONNECTED
to DISCONNECTED after API_DISCONNECT_TIMEOUT.

**Kind**: instance method of [<code>ApiConnection</code>](#apiconnection)  
**Access**: private  
<a id="apiconnection4395changeisconnected"></a>

### apiConnection._changeIsConnected(isConnected) ℗
Define connection state.
Handles connectionState transition by dispatching corresponding actions (redux).

**Kind**: instance method of [<code>ApiConnection</code>](#apiconnection)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| isConnected | <code>boolean</code> | true sets state to CONNECTED, false transitions to DISCONNECTED |

<a id="apiconnection43request"></a>

### apiConnection.request(event, [data]) ⇒ <code>Promise.&lt;\*&gt;</code>
Performs an api-request with the specified data-object.

**Kind**: instance method of [<code>ApiConnection</code>](#apiconnection)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - resolves to response-data  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| event | <code>string</code> |  | event-identifier |
| [data] | <code>object</code> | <code>{}</code> | data to send |

<a id="apiconnection43on"></a>

### apiConnection.on(event, cb)
Registers a callback for a specific api-event.

**Kind**: instance method of [<code>ApiConnection</code>](#apiconnection)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | event-identifier |
| cb | [<code>eventListenerCallback</code>](#apiconnection4646eventlistenercallback) | callback for api-event |

<a id="apiconnection4395handleconnect"></a>

### apiConnection._handleConnect() ℗
Eventhandler for connected event.

**Kind**: instance method of [<code>ApiConnection</code>](#apiconnection)  
**Access**: private  
<a id="apiconnection4395handleconnecterror"></a>

### apiConnection._handleConnectError(reason) ℗
Eventhandler for connect error event.

**Kind**: instance method of [<code>ApiConnection</code>](#apiconnection)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| reason | <code>string</code> | reason for connect failed |

<a id="apiconnection4395handledisconnect"></a>

### apiConnection._handleDisconnect(reason) ℗
Eventhandler for socket disconnect event.

**Kind**: instance method of [<code>ApiConnection</code>](#apiconnection)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| reason | <code>string</code> | disconnect-reason |

<a id="apiconnection4646eventlistenercallback"></a>

### ApiConnection~eventListenerCallback : <code>function</code>
Callback for api-event.

**Kind**: inner typedef of [<code>ApiConnection</code>](#apiconnection)  

| Param | Type | Description |
| --- | --- | --- |
| eventData | <code>\*</code> | attached event-data |

