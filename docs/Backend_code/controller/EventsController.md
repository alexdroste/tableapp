<a id="eventscontroller"></a>

## EventsController
Controller for events.

**Kind**: global class  

* [EventsController](#eventscontroller)
    * [new EventsController(dbConnection)](#new95eventscontroller95new)
    * _instance_
        * [._db](#eventscontroller4395db) : <code>object</code> ℗
        * [._onEventUsersUpdatedCallback](#eventscontroller4395oneventusersupdatedcallback) : [<code>onEventUsersUpdatedCallback</code>](#eventscontroller4646oneventusersupdatedcallback) &#124; <code>null</code> ℗
        * [._onEventUsersUpdated(eventId, userIds)](#eventscontroller4395oneventusersupdated) ℗
        * [.onEventUsersUpdated(cb)](#eventscontroller43oneventusersupdated)
        * [.changeUserPermissionLevelForEvent(eventId, userId, permissionLevel)](#eventscontroller43changeuserpermissionlevelforevent) ⇒ <code>Promise</code>
        * [.getEventDict(userId, [full], [eventIds])](#eventscontroller43geteventdict) ⇒ [<code>Promise.&lt;EventDict&gt;</code>](#eventscontroller4646eventdict)
        * [.getRoleList(eventId)](#eventscontroller43getrolelist) ⇒ [<code>Promise.&lt;RoleList&gt;</code>](#eventscontroller4646rolelist)
        * [.getUserDict(eventId, [withName], [withPermissionLevelAndEmail], [userIds])](#eventscontroller43getuserdict) ⇒ [<code>Promise.&lt;UserDict&gt;</code>](#eventscontroller4646userdict)
    * _inner_
        * [~Role](#eventscontroller4646role) : <code>object</code>
        * [~RoleList](#eventscontroller4646rolelist) : [<code>Array.&lt;Role&gt;</code>](#eventscontroller4646role)
        * [~EventUser](#eventscontroller4646eventuser) : <code>object</code>
        * [~UserDict](#eventscontroller4646userdict) : <code>object</code>
        * [~TableEvent](#eventscontroller4646tableevent) : <code>object</code>
        * [~EventDict](#eventscontroller4646eventdict) : <code>object</code>
        * [~onEventUsersUpdatedCallback](#eventscontroller4646oneventusersupdatedcallback) : <code>function</code>

<a id="new95eventscontroller95new"></a>

### new EventsController(dbConnection)
Initializes events controller.


| Param | Type | Description |
| --- | --- | --- |
| dbConnection | <code>object</code> | mongodb database connection |

<a id="eventscontroller4395db"></a>

### eventsController._db : <code>object</code> ℗
Database connection that is beeing used.

**Kind**: instance property of [<code>EventsController</code>](#eventscontroller)  
**Access**: private  
<a id="eventscontroller4395oneventusersupdatedcallback"></a>

### eventsController._onEventUsersUpdatedCallback : <code>onEventUsersUpdatedCallback</code> &#124; <code>null</code> ℗
Registered onEventUsersUpdated callback.

**Kind**: instance property of [<code>EventsController</code>](#eventscontroller)  
**Access**: private  
<a id="eventscontroller4395oneventusersupdated"></a>

### eventsController._onEventUsersUpdated(eventId, userIds) ℗
Internal method that calls onEventUsersUpdated callback function.

**Kind**: instance method of [<code>EventsController</code>](#eventscontroller)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event which users have been updated |
| userIds | <code>Array.&lt;string&gt;</code> | array of updated/affected userIds |

<a id="eventscontroller43oneventusersupdated"></a>

### eventsController.onEventUsersUpdated(cb)
Register callback for event users have been updated.

**Kind**: instance method of [<code>EventsController</code>](#eventscontroller)  

| Param | Type | Description |
| --- | --- | --- |
| cb | [<code>onEventUsersUpdatedCallback</code>](#eventscontroller4646oneventusersupdatedcallback) | callback when users of an event have been updated |

<a id="eventscontroller43changeuserpermissionlevelforevent"></a>

### eventsController.changeUserPermissionLevelForEvent(eventId, userId, permissionLevel) ⇒ <code>Promise</code>
Changes a users permission level for a specific event.

**Kind**: instance method of [<code>EventsController</code>](#eventscontroller)  
**Returns**: <code>Promise</code> - indicates success  
**Throws**:

- <code>Error</code> with message: 'eventId not found' with statusCode NOT_FOUND if supplied eventId does not exist


| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| userId | <code>string</code> | id of user |
| permissionLevel | <code>PermissionLevelEnum</code> | permission level to set |

<a id="eventscontroller43geteventdict"></a>

### eventsController.getEventDict(userId, [full], [eventIds]) ⇒ <code>Promise.&lt;EventDict&gt;</code>
Retrives EventDict for a user.

**Kind**: instance method of [<code>EventsController</code>](#eventscontroller)  
**Returns**: [<code>Promise.&lt;EventDict&gt;</code>](#eventscontroller4646eventdict) - resolves to dictionary of events (for user)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| userId | <code>string</code> |  | userId to get dict for |
| [full] | <code>boolean</code> | <code>false</code> | true receives every event, false only joined ones |
| [eventIds] | <code>Array.&lt;ObjectID&gt;</code> | <code>[]</code> | Array of eventIds to retrieve dict for. Empty array [] means all events. Defaults to []. If set, parameter full is ignored. |

<a id="eventscontroller43getrolelist"></a>

### eventsController.getRoleList(eventId) ⇒ <code>Promise.&lt;RoleList&gt;</code>
Retrieves rolesList for an event.

**Kind**: instance method of [<code>EventsController</code>](#eventscontroller)  
**Returns**: [<code>Promise.&lt;RoleList&gt;</code>](#eventscontroller4646rolelist) - resolves to list of roles ordered by priority  
**Throws**:

- <code>Error</code> with message: 'eventId not found' with statusCode NOT_FOUND if supplied eventId does not exist


| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |

<a id="eventscontroller43getuserdict"></a>

### eventsController.getUserDict(eventId, [withName], [withPermissionLevelAndEmail], [userIds]) ⇒ <code>Promise.&lt;UserDict&gt;</code>
Retrieves userDict for an event.

**Kind**: instance method of [<code>EventsController</code>](#eventscontroller)  
**Returns**: [<code>Promise.&lt;UserDict&gt;</code>](#eventscontroller4646userdict) - resolves to dictionary of event-users  
**Throws**:

- <code>Error</code> with message: 'eventId not found' with statusCode NOT_FOUND if supplied eventId does not exist


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| eventId | <code>ObjectID</code> |  | id of event to retrieve user dict from |
| [withName] | <code>boolean</code> | <code>true</code> | adds name property to user objects |
| [withPermissionLevelAndEmail] | <code>boolean</code> | <code>false</code> | if true, keeps permissionLevel property and adds email address of user |
| [userIds] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | Array of userIds to limit dict to. Unset means all users. |

<a id="eventscontroller4646role"></a>

### EventsController~Role : <code>object</code>
A role object.

**Kind**: inner typedef of [<code>EventsController</code>](#eventscontroller)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| color | <code>string</code> | named color, e.g. "red", "violet", "blue", ... |
| id | <code>string</code> | role-id |
| name | <code>string</code> | name of role, e.g. "Tutor" |

<a id="eventscontroller4646rolelist"></a>

### EventsController~RoleList : <code>Array.&lt;Role&gt;</code>
List of roles (see [Role](#eventscontroller4646role)) ordered by priority.

**Kind**: inner typedef of [<code>EventsController</code>](#eventscontroller)  
<a id="eventscontroller4646eventuser"></a>

### EventsController~EventUser : <code>object</code>
An event-user object.

**Kind**: inner typedef of [<code>EventsController</code>](#eventscontroller)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [email] | <code>string</code> | users email address |
| name | <code>string</code> | users full name, e.g. "Dr. Max Mustermann" |
| [permissionLevel] | <code>PermissionLevelEnum</code> | users permission level |
| roleId | <code>string</code> | users roleId |

<a id="eventscontroller4646userdict"></a>

### EventsController~UserDict : <code>object</code>
Dictionary of EventUsers.

dict[key] = value:
* key := id of user
* value := [EventUser](#eventscontroller4646eventuser)

**Kind**: inner typedef of [<code>EventsController</code>](#eventscontroller)  
<a id="eventscontroller4646tableevent"></a>

### EventsController~TableEvent : <code>object</code>
An event object.
Containing non-general event infos for a single user.

**Kind**: inner typedef of [<code>EventsController</code>](#eventscontroller)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| isArchived | <code>boolean</code> | indicates if event is archived |
| name | <code>string</code> | title/name of event |
| permissionLevel | <code>PermissionLevelEnum</code> | permission level of user |

<a id="eventscontroller4646eventdict"></a>

### EventsController~EventDict : <code>object</code>
Dictionary of TableEvents.

dict[key] = value:
* key := id of event
* value := [TableEvent](#eventscontroller4646tableevent)

**Kind**: inner typedef of [<code>EventsController</code>](#eventscontroller)  
<a id="eventscontroller4646oneventusersupdatedcallback"></a>

### EventsController~onEventUsersUpdatedCallback : <code>function</code>
Function called when users of an event have been updated.

**Kind**: inner typedef of [<code>EventsController</code>](#eventscontroller)  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event which users have been updated |
| userIds | <code>Array.&lt;string&gt;</code> | array of updated/affected userIds |

