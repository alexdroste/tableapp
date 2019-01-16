<a id="loginstateenum"></a>

## LoginStateEnum : <code>enum</code>
Enum for login states

**Kind**: global enum  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| LOGGED_OUT | <code>number</code> | indicates that no one is logged in |
| PENDING | <code>number</code> | indicates that login is pending |
| FAILED | <code>number</code> | indicates that a login attempt failed |
| LOGGED_IN | <code>number</code> | indicates that a user is logged in |

<a id="user"></a>

## user(state, action)
user-reducer

**Kind**: global function  

| Param | Type |
| --- | --- |
| state | [<code>UserState</code>](#userstate) | 
| action | <code>object</code> | 

<a id="getloginstate"></a>

## getLoginState(state) ⇒ <code>LoginStateEnum</code>
Selector to select current login state from user-state.

**Kind**: global function  
**Returns**: [<code>LoginStateEnum</code>](#loginstateenum) - current login state  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>UserState</code>](#userstate) | user-state |

<a id="getuserid"></a>

## getUserId(state) ⇒ <code>string</code> &#124; <code>null</code>
Selector to select user id from user-state.

**Kind**: global function  
**Returns**: <code>string</code> &#124; <code>null</code> - user id, null if no user is logged in  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>UserState</code>](#userstate) | user-state |

<a id="getusername"></a>

## getUserName(state) ⇒ <code>string</code> &#124; <code>null</code>
Selector to select user name from user-state.

**Kind**: global function  
**Returns**: <code>string</code> &#124; <code>null</code> - user name, null if no user is logged in  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>UserState</code>](#userstate) | user-state |

<a id="getsessiontoken"></a>

## getSessionToken(state) ⇒ <code>string</code> &#124; <code>null</code>
Selector to select sessionToken from user-state.

**Kind**: global function  
**Returns**: <code>string</code> &#124; <code>null</code> - sessionToken, null if user is not logged in  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>UserState</code>](#userstate) | user-state |

<a id="hasacceptedtos"></a>

## hasAcceptedTos(state) ⇒ <code>boolean</code>
Selector to retrieve state whether user accepted terms of service from user-state.

**Kind**: global function  
**Returns**: <code>boolean</code> - indicates if user has accepted terms of service  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>UserState</code>](#userstate) | user-state |

<a id="userstate"></a>

## UserState : <code>object</code>
Shape of user reducers state.
Default values are the initial state.

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [hasAcceptedTos] | <code>boolean</code> | <code>false</code> | indicates if logged in user has accepted terms of service |
| [id] | <code>string</code> &#124; <code>null</code> | <code>null</code> | logged in users id |
| [loginState] | [<code>LoginStateEnum</code>](#loginstateenum) | <code>LoginStateEnum.LOGGED_OUT</code> | indicates login-state |
| [name] | <code>string</code> &#124; <code>null</code> | <code>null</code> | logged in users name |
| [sessionToken] | <code>string</code> &#124; <code>null</code> | <code>null</code> | on login received sessionToken |

