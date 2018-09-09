<a id="continuesession"></a>

## continueSession(api, sessionToken) ⇒ <code>Promise.&lt;LoginData&gt;</code>
API-call: continue session (via sessionToken).

**Kind**: global function  
**Returns**: [<code>Promise.&lt;LoginData&gt;</code>](#logindata) - resolves to object containing login-data (sessionToken, ...)  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiConnection</code> | ApiConnection instance |
| sessionToken | <code>string</code> | sessionToken |

<a id="login"></a>

## login(api, email, password) ⇒ <code>Promise.&lt;LoginData&gt;</code>
API-call: login.

**Kind**: global function  
**Returns**: [<code>Promise.&lt;LoginData&gt;</code>](#logindata) - resolves to object containing login-data (sessionToken, ...)  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiConnection</code> | ApiConnection instance |
| email | <code>string</code> | email of user |
| password | <code>string</code> | password of user |

<a id="logindata"></a>

## LoginData : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| activeEventId | <code>string</code> &#124; <code>null</code> | id of active (or last active) event, null if no event is active |
| id | <code>string</code> | id of user |
| name | <code>string</code> | name of user |
| sessionToken | <code>string</code> | sessionToken (jwt) |

