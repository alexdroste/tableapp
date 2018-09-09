<a id="events"></a>

## events(state, action)
events-reducer

**Kind**: global function  

| Param | Type |
| --- | --- |
| state | [<code>EventsState</code>](#eventsstate) | 
| action | <code>object</code> | 

<a id="isinitialdictupdatepending"></a>

## isInitialDictUpdatePending(state) ⇒ <code>boolean</code>
Selector to get state whether initial update for dictionary is pending from events-state.

**Kind**: global function  
**Returns**: <code>boolean</code> - indicates whether initial update for dicitionary is pending  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EventsState</code>](#eventsstate) | events-state |

<a id="isswitchactiveeventpending"></a>

## isSwitchActiveEventPending(state) ⇒ <code>boolean</code>
Selector to get state whether event switch is pending from events-state.

**Kind**: global function  
**Returns**: <code>boolean</code> - indicates whether event switch is pending  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EventsState</code>](#eventsstate) | events-state |

<a id="getactiveeventid"></a>

## getActiveEventId(state) ⇒ <code>string</code> &#124; <code>null</code>
Selector to select active event id from events-state.

**Kind**: global function  
**Returns**: <code>string</code> &#124; <code>null</code> - id of active event, null if no event is active  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EventsState</code>](#eventsstate) | events-state |

<a id="getactiveeventname"></a>

## getActiveEventName(state) ⇒ <code>string</code> &#124; <code>null</code>
Selector to select name of active event from events-state.

**Kind**: global function  
**Returns**: <code>string</code> &#124; <code>null</code> - name of active event, null if no event is active  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EventsState</code>](#eventsstate) | events-state |

<a id="getactiveeventuserpermissionlevel"></a>

## getActiveEventUserPermissionLevel(state) ⇒ <code>PermissionLevelEnum</code> &#124; <code>null</code>
Selector to select users permission level for the active event from events-state.

**Kind**: global function  
**Returns**: <code>PermissionLevelEnum</code> &#124; <code>null</code> - users pemission level for the active event, null if no event is active  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EventsState</code>](#eventsstate) | events-state |

<a id="geteventdict"></a>

## getEventDict(state) ⇒ <code>EventDict</code>
Selector to retrieve dictionary of events where user has at least joined from events-state.

**Kind**: global function  
**Returns**: [<code>EventDict</code>](#eventdict) - dictionary of events  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EventsState</code>](#eventsstate) | events-state |

<a id="getevent"></a>

## getEvent(state, eventId) ⇒ <code>TableEvent</code> &#124; <code>null</code>
Selector to select a specific event from events-state.

**Kind**: global function  
**Returns**: [<code>TableEvent</code>](#tableevent) &#124; <code>null</code> - event with specified id, null if event with id does not exist locally  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EventsState</code>](#eventsstate) | events-state |
| eventId | <code>string</code> | id of event |

<a id="getfulleventdict"></a>

## getFullEventDict(state) ⇒ <code>EventDict</code>
Selector to retrieve dictionary of all events from events-state.

**Kind**: global function  
**Returns**: [<code>EventDict</code>](#eventdict) - dictionary of events  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EventsState</code>](#eventsstate) | events-state |

<a id="getunjoinedeventdict"></a>

## getUnjoinedEventDict(state) ⇒ <code>EventDict</code>
Selector to retrieve dictionary of events where user has not joined from events-state.

**Kind**: global function  
**Returns**: [<code>EventDict</code>](#eventdict) - dictionary of events  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EventsState</code>](#eventsstate) | events-state |

<a id="tableevent"></a>

## TableEvent : <code>object</code>
An event object.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| isArchived | <code>boolean</code> | indicates if event is archived |
| name | <code>string</code> | title/name of event |
| permissionLevel | <code>PermissionLevelEnum</code> | permission level of user |

<a id="eventdict"></a>

## EventDict : <code>object</code>
Dictionary of TableEvents.

dict[key] = value:
* key := id of event
* value := [TableEvent](#tableevent)

**Kind**: global typedef  
<a id="eventsstate"></a>

## EventsState : <code>object</code>
Shape of events reducers state.
Default values are the initial state.

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| activeEvent | <code>object</code> |  |  |
| [activeEvent.id] | <code>string</code> &#124; <code>null</code> | <code>null</code> | id of active event |
| [activeEvent.switchPending] | <code>boolean</code> | <code>false</code> | indicates if event switch is pending |
| [initialDictUpdatePending] | <code>boolean</code> | <code>true</code> | indicates if initial update of eventDict is pending |
| [eventDict] | [<code>EventDict</code>](#eventdict) | <code>{}</code> |  |
| [subscribedFullDict] | <code>boolean</code> | <code>false</code> | indicates if client subscribed to full event dictionary (all available events) |

