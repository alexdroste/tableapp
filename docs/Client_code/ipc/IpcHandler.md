<a id="ipchandler"></a>

## IpcHandler
Represents communication channel to/from the electron main-process.

**Kind**: global class  

* [IpcHandler](#ipchandler)
    * _instance_
        * [.initialize(dispatch)](#ipchandler43initialize)
        * [.sendMessage(event, [data])](#ipchandler43sendmessage)
        * [.on(event, cb)](#ipchandler43on)
    * _inner_
        * [~eventListenerCallback](#ipchandler4646eventlistenercallback) : <code>function</code>

<a id="ipchandler43initialize"></a>

### ipcHandler.initialize(dispatch)
Initializes IpcHandler instance. Must be called after creation.

**Kind**: instance method of [<code>IpcHandler</code>](#ipchandler)  

| Param | Type | Description |
| --- | --- | --- |
| dispatch | <code>dispatchAction</code> | function to dispatch an action to the store |

<a id="ipchandler43sendmessage"></a>

### ipcHandler.sendMessage(event, [data])
Sends message to the main-process.

**Kind**: instance method of [<code>IpcHandler</code>](#ipchandler)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| event | <code>string</code> |  | event-identifier |
| [data] | <code>object</code> | <code>{}</code> | data to send |

<a id="ipchandler43on"></a>

### ipcHandler.on(event, cb)
Registers a callback for a specific ipc-event.

**Kind**: instance method of [<code>IpcHandler</code>](#ipchandler)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | event-identifier |
| cb | [<code>eventListenerCallback</code>](#ipchandler4646eventlistenercallback) | callback for ipc-event |

<a id="ipchandler4646eventlistenercallback"></a>

### IpcHandler~eventListenerCallback : <code>function</code>
Callback for ipc-event.

**Kind**: inner typedef of [<code>IpcHandler</code>](#ipchandler)  

| Param | Type | Description |
| --- | --- | --- |
| eventData | <code>\*</code> | attached event-data |

