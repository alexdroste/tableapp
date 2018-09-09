<a id="changeconnectionstate"></a>

## changeConnectionState(connectionState) ⇒ <code>object</code>
Creates action for api connection-state change.

**Kind**: global function  
**Returns**: <code>object</code> - action  

| Param | Type | Description |
| --- | --- | --- |
| connectionState | <code>ApiConnectionStateEnum</code> | state to change to |

<a id="lockkey"></a>

## lockKey(key) ⇒ <code>object</code>
Creates action for locking a key.

**Kind**: global function  
**Returns**: <code>object</code> - action  
**See**: apiMiddleware  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | key to lock |

<a id="unlockkey"></a>

## unlockKey(key) ⇒ <code>object</code>
Creates action for unlocking a previously locked key.

**Kind**: global function  
**Returns**: <code>object</code> - action  
**See**: apiMiddleware  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | key to unlock |

