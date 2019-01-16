<a id="module95eventscontroller"></a>

## eventsController
Controller for events.


* [eventsController](#module95eventscontroller)
    * _static_
        * [.changeUserPermissionLevelForEvent(eventId, userId, permissionLevel)](#module95eventscontroller46changeuserpermissionlevelforevent) ⇒ <code>Promise</code>
        * [.getEventDict(userId, [full], [eventIds])](#module95eventscontroller46geteventdict) ⇒ <code>Promise.&lt;EventsController~EventDict&gt;</code>
        * [.getRoleList(eventId)](#module95eventscontroller46getrolelist) ⇒ <code>Promise.&lt;EventsController~RoleList&gt;</code>
        * [.getUserDict(eventId, [withName], [withPermissionLevelAndEmail], [userIds])](#module95eventscontroller46getuserdict) ⇒ <code>Promise.&lt;EventsController~UserDict&gt;</code>
    * _inner_
        * [~_onEventUsersUpdated(eventId, userIds)](#module95eventscontroller464695oneventusersupdated) ℗
        * [~Role](#module95eventscontroller4646role) : <code>object</code>
        * [~EventUser](#module95eventscontroller4646eventuser) : <code>object</code>
        * [~UserDict](#module95eventscontroller4646userdict) : <code>object</code>
        * [~TableEvent](#module95eventscontroller4646tableevent) : <code>object</code>
        * [~EventDict](#module95eventscontroller4646eventdict) : <code>object</code>

<a id="module95eventscontroller46changeuserpermissionlevelforevent"></a>

### eventsController.changeUserPermissionLevelForEvent(eventId, userId, permissionLevel) ⇒ <code>Promise</code>
Changes a users permission level for a specific event.

**Kind**: static method of [<code>eventsController</code>](#module95eventscontroller)  
**Returns**: <code>Promise</code> - indicates success  
**Throws**:

- <code>Error</code> with message: 'eventId not found' with code NOT_FOUND if supplied eventId does not exist


| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| userId | <code>string</code> | id of user |
| permissionLevel | <code>PermissionLevelEnum</code> | permission level to set |

<a id="module95eventscontroller46geteventdict"></a>

### eventsController.getEventDict(userId, [full], [eventIds]) ⇒ <code>Promise.&lt;EventsController~EventDict&gt;</code>
Retrives EventDict for a user.

**Kind**: static method of [<code>eventsController</code>](#module95eventscontroller)  
**Returns**: <code>Promise.&lt;EventsController~EventDict&gt;</code> - resolves to dictionary of events (for user)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| userId | <code>string</code> |  | userId to get dict for |
| [full] | <code>boolean</code> | <code>false</code> | true receives every event, false only joined ones |
| [eventIds] | <code>Array.&lt;ObjectID&gt;</code> | <code>[]</code> | Array of eventIds to retrieve dict for. Empty array [] means all events. Defaults to []. If set, parameter full is ignored. |

<a id="module95eventscontroller46getrolelist"></a>

### eventsController.getRoleList(eventId) ⇒ <code>Promise.&lt;EventsController~RoleList&gt;</code>
Retrieves rolesList for an event.

**Kind**: static method of [<code>eventsController</code>](#module95eventscontroller)  
**Returns**: <code>Promise.&lt;EventsController~RoleList&gt;</code> - resolves to list of roles ordered by priority  
**Throws**:

- <code>Error</code> with message: 'eventId not found' with code NOT_FOUND if supplied eventId does not exist


| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |

<a id="module95eventscontroller46getuserdict"></a>

### eventsController.getUserDict(eventId, [withName], [withPermissionLevelAndEmail], [userIds]) ⇒ <code>Promise.&lt;EventsController~UserDict&gt;</code>
Retrieves userDict for an event.

**Kind**: static method of [<code>eventsController</code>](#module95eventscontroller)  
**Returns**: <code>Promise.&lt;EventsController~UserDict&gt;</code> - resolves to dictionary of event-users  
**Throws**:

- <code>Error</code> with message: 'eventId not found' with code NOT_FOUND if supplied eventId does not exist


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| eventId | <code>ObjectID</code> |  | id of event to retrieve user dict from |
| [withName] | <code>boolean</code> | <code>true</code> | adds name property to user objects |
| [withPermissionLevelAndEmail] | <code>boolean</code> | <code>false</code> | if true, keeps permissionLevel property and adds email address of user |
| [userIds] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | Array of userIds to limit dict to. Unset means all users. |

<a id="module95eventscontroller464695oneventusersupdated"></a>

### eventsController~_onEventUsersUpdated(eventId, userIds) ℗
Internal method that triggers update handlers.

**Kind**: inner method of [<code>eventsController</code>](#module95eventscontroller)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event which users have been updated |
| userIds | <code>Array.&lt;string&gt;</code> | array of updated/affected userIds |

<a id="module95eventscontroller4646role"></a>

### eventsController~Role : <code>object</code>
A role object.

**Kind**: inner typedef of [<code>eventsController</code>](#module95eventscontroller)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| color | <code>string</code> | named color, e.g. "red", "violet", "blue", ... |
| id | <code>string</code> | role-id |
| name | <code>string</code> | name of role, e.g. "Tutor" |

<a id="module95eventscontroller4646eventuser"></a>

### eventsController~EventUser : <code>object</code>
An event-user object.

**Kind**: inner typedef of [<code>eventsController</code>](#module95eventscontroller)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [email] | <code>string</code> | users email address |
| name | <code>string</code> | users full name, e.g. "Dr. Max Mustermann" |
| [permissionLevel] | <code>PermissionLevelEnum</code> | users permission level |
| roleId | <code>string</code> | users roleId |

<a id="module95eventscontroller4646userdict"></a>

### eventsController~UserDict : <code>object</code>
Dictionary of EventUsers.

dict[key] = value:
* key := id of user
* value := [EventUser](EventUser)

**Kind**: inner typedef of [<code>eventsController</code>](#module95eventscontroller)  
<a id="module95eventscontroller4646tableevent"></a>

### eventsController~TableEvent : <code>object</code>
An event object.
Containing non-general event infos for a single user.

**Kind**: inner typedef of [<code>eventsController</code>](#module95eventscontroller)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| isArchived | <code>boolean</code> | indicates if event is archived |
| name | <code>string</code> | title/name of event |
| permissionLevel | <code>PermissionLevelEnum</code> | permission level of user |

<a id="module95eventscontroller4646eventdict"></a>

### eventsController~EventDict : <code>object</code>
Dictionary of TableEvents.

dict[key] = value:
* key := id of event
* value := [TableEvent](TableEvent)

**Kind**: inner typedef of [<code>eventsController</code>](#module95eventscontroller)  
