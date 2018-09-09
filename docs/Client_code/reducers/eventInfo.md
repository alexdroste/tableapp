<a id="eventinfo"></a>

## eventInfo(state, action)
eventInfo-reducer

**Kind**: global function  

| Param | Type |
| --- | --- |
| state | [<code>EventInfoState</code>](#eventinfostate) | 
| action | <code>object</code> | 

<a id="getrole"></a>

## getRole(state, roleId) ⇒ <code>Role</code> &#124; <code>null</code>
Selector to select specific role by id from eventInfo-state.

**Kind**: global function  
**Returns**: [<code>Role</code>](#role) &#124; <code>null</code> - role, null if not matching role was found  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EventInfoState</code>](#eventinfostate) | eventInfo-state |
| roleId | <code>string</code> | id of role |

<a id="getrolelist"></a>

## getRoleList(state) ⇒ <code>RoleList</code>
Selector to retrieve events role list from eventInfo-state.

**Kind**: global function  
**Returns**: [<code>RoleList</code>](#rolelist) - active events role list  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EventInfoState</code>](#eventinfostate) | eventInfo-state |

<a id="getrolepriority"></a>

## getRolePriority(state) ⇒ <code>Array.&lt;string&gt;</code>
Selector to retrieve priority of roles as ordered list from eventInfo-state.

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - list of role-ids ordered by priority  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EventInfoState</code>](#eventinfostate) | eventInfo-state |

<a id="getuserdict"></a>

## getUserDict(state) ⇒ <code>UserDict</code>
Selector to select user dictionary from eventInfo-state.

**Kind**: global function  
**Returns**: [<code>UserDict</code>](#userdict) - active events user dictionary  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EventInfoState</code>](#eventinfostate) | eventInfo-state |

<a id="getuser"></a>

## getUser(state, userId) ⇒ <code>EventUser</code> &#124; <code>null</code>
Selector to select an (event-)user by its id from eventInfo-state.

**Kind**: global function  
**Returns**: [<code>EventUser</code>](#eventuser) &#124; <code>null</code> - event-user with specified id, null if it does not exist  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EventInfoState</code>](#eventinfostate) | eventInfo-state |
| userId | <code>string</code> | id of user |

<a id="getuserroleid"></a>

## getUserRoleId(state, userId) ⇒ <code>string</code> &#124; <code>null</code>
Selector to select role-id from an event-user specified by its id from eventInfo-state.

**Kind**: global function  
**Returns**: <code>string</code> &#124; <code>null</code> - roleId of specified (event-)user, null if user or user.roleId does not exist  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EventInfoState</code>](#eventinfostate) | eventInfo-state |
| userId | <code>string</code> | id of user |

<a id="role"></a>

## Role : <code>object</code>
A role object.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| color | <code>string</code> | named color, e.g. "red", "violet", "blue", ... |
| id | <code>string</code> | role-id |
| name | <code>string</code> | name of role, e.g. "Tutor" |

<a id="rolelist"></a>

## RoleList : <code>Array.&lt;Role&gt;</code>
List of roles (see [Role](#role)) ordered by priority.

**Kind**: global typedef  
<a id="eventuser"></a>

## EventUser : <code>object</code>
An event-user object.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [email] | <code>string</code> | users email address |
| name | <code>string</code> | users full name, e.g. "Dr. Max Mustermann" |
| [permissionLevel] | <code>PermissionLevelEnum</code> | users permission level |
| roleId | <code>string</code> | users roleId |

<a id="userdict"></a>

## UserDict : <code>object</code>
Dictionary of EventUsers.

dict[key] = value:
* key := id of user
* value := [EventUser](#eventuser)

**Kind**: global typedef  
<a id="eventinfostate"></a>

## EventInfoState : <code>object</code>
Shape of eventInfo reducers state.
Default values are the initial state.

**Kind**: global typedef  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| [roleList] | [<code>RoleList</code>](#rolelist) | <code>[]</code> | 
| [userDict] | [<code>UserDict</code>](#userdict) | <code>{}</code> | 

