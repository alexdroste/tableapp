<a id="api"></a>

## api(state, action)
api-reducer

**Kind**: global function  

| Param | Type |
| --- | --- |
| state | [<code>ApiState</code>](#apistate) | 
| action | <code>object</code> | 

<a id="getconnectionstate"></a>

## getConnectionState(state) ⇒ <code>ApiConnectionStateEnum</code>
Selector to select api connection state from api-state.

**Kind**: global function  
**Returns**: <code>ApiConnectionStateEnum</code> - indicates connection state to api (backend)  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>ApiState</code>](#apistate) | api-state |

<a id="iskeylocked"></a>

## isKeyLocked(state) ⇒ <code>boolean</code>
Selector to check if an action key is currently locked, selects from api-state.

**Kind**: global function  
**Returns**: <code>boolean</code> - indicates that an action key is currently locked, that means that the same request was made before but did not receive an answer until now and another request should not be made until an answer is received or a timeout kicked in  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>ApiState</code>](#apistate) | api-state |

<a id="apistate"></a>

## ApiState : <code>object</code>
Shape of api reducers state.
Default values are the initial state.

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [connectionState] | <code>ApiConnectionStateEnum</code> | <code>ApiConnectionStateEnum.DISCONNECTED</code> | indicates connection state to api (backend) |
| [lockedActionKeys] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | keys of api-actions that are currently pending / awaiting an answer that should not be executed twice |

