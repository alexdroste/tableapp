<a id="subscribefulleventdict"></a>

## subscribeFullEventDict(api) ⇒ <code>Promise</code>
API-call: subscribe to full EventDict (containing all events).

**Kind**: global function  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiConnection</code> | ApiConnection instance |

<a id="unsubscribefulleventdict"></a>

## unsubscribeFullEventDict(api) ⇒ <code>Promise</code>
API-call: unsubscribe from full EventDict.

**Kind**: global function  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiConnection</code> | ApiConnection instance |

<a id="joinevent"></a>

## joinEvent(api, eventId) ⇒ <code>Promise</code>
API-call: join an event (by id).

**Kind**: global function  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiConnection</code> | ApiConnection instance |
| eventId | <code>string</code> | id of event to join |

<a id="leaveevent"></a>

## leaveEvent(api, eventId) ⇒ <code>Promise</code>
API-call: leave an event (by id).

**Kind**: global function  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiConnection</code> | ApiConnection instance |
| eventId | <code>string</code> | id of event to leave |

<a id="switchactiveevent"></a>

## switchActiveEvent(api, eventId) ⇒ <code>Promise</code>
API-call: switch the active event (by id).

**Kind**: global function  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiConnection</code> | ApiConnection instance |
| eventId | <code>string</code> | id of event to switch to |

