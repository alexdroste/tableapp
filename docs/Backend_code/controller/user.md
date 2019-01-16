<a id="module95usercontroller"></a>

## userController
Controller for user-data.


* [userController](#module95usercontroller)
    * _static_
        * [.acceptTos(userId)](#module95usercontroller46accepttos) ⇒ <code>Promise</code>
        * [.continueSession(sessionToken)](#module95usercontroller46continuesession) ⇒ <code>Promise.&lt;UserController~LoginData&gt;</code>
        * [.login(email, password)](#module95usercontroller46login) ⇒ <code>Promise.&lt;UserController~LoginData&gt;</code>
        * [.saveLastActiveEventId(userId, eventId)](#module95usercontroller46savelastactiveeventid) ⇒ <code>Promise</code>
        * [.saveSessionInfos(userId, fromTimestamp, toTimestamp, sessionToken, [ip], [userAgent])](#module95usercontroller46savesessioninfos) ⇒ <code>Promise</code>
    * _inner_
        * [~_createLoginData(dn, sessionToken)](#module95usercontroller464695createlogindata) ⇒ <code>Promise.&lt;UserController~LoginData&gt;</code> ℗
        * [~LoginData](#module95usercontroller4646logindata) : <code>object</code>

<a id="module95usercontroller46accepttos"></a>

### userController.acceptTos(userId) ⇒ <code>Promise</code>
Sets hasAcceptedTos to true for a user.

**Kind**: static method of [<code>userController</code>](#module95usercontroller)  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | id of user |

<a id="module95usercontroller46continuesession"></a>

### userController.continueSession(sessionToken) ⇒ <code>Promise.&lt;UserController~LoginData&gt;</code>
Continue session with supplied sessionToken.

**Kind**: static method of [<code>userController</code>](#module95usercontroller)  
**Returns**: <code>Promise.&lt;UserController~LoginData&gt;</code> - resolve to login data object (id, name, sessionToken)  
**Throws**:

- <code>Error</code> if supplied sessionToken is not valid/expired


| Param | Type | Description |
| --- | --- | --- |
| sessionToken | <code>string</code> | valid sessionToken |

<a id="module95usercontroller46login"></a>

### userController.login(email, password) ⇒ <code>Promise.&lt;UserController~LoginData&gt;</code>
Login user by email and password.

HINT: if app is not in production mode, using 'debug' as password always grants access

**Kind**: static method of [<code>userController</code>](#module95usercontroller)  
**Returns**: <code>Promise.&lt;UserController~LoginData&gt;</code> - resolves to login data object (id, name, sessionToken)  
**Throws**:

- <code>Error</code> with message: 'email not found' and code NOT_FOUND if supplied email could not be found
- <code>Error</code> if user/password combination could not be used to bind to ldap


| Param | Type | Description |
| --- | --- | --- |
| email | <code>string</code> | email of user |
| password | <code>string</code> | password of user |

<a id="module95usercontroller46savelastactiveeventid"></a>

### userController.saveLastActiveEventId(userId, eventId) ⇒ <code>Promise</code>
Sets lastActiveEventId for a user.

**Kind**: static method of [<code>userController</code>](#module95usercontroller)  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | id of user |
| eventId | <code>ObjectID</code> | id of event to set as lastActiveEventId |

<a id="module95usercontroller46savesessioninfos"></a>

### userController.saveSessionInfos(userId, fromTimestamp, toTimestamp, sessionToken, [ip], [userAgent]) ⇒ <code>Promise</code>
Saves sessionInfo for a user. Used for tracking and analysis.

**Kind**: static method of [<code>userController</code>](#module95usercontroller)  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | id of user |
| fromTimestamp | <code>number</code> | login/auth timestamp |
| toTimestamp | <code>number</code> | logout/disconnect timestamp |
| sessionToken | <code>string</code> | used sessionToken |
| [ip] | <code>string</code> | ip-address |
| [userAgent] | <code>string</code> | userAgent of users browser |

<a id="module95usercontroller464695createlogindata"></a>

### userController~_createLoginData(dn, sessionToken) ⇒ <code>Promise.&lt;UserController~LoginData&gt;</code> ℗
Creates login data object.

**Kind**: inner method of [<code>userController</code>](#module95usercontroller)  
**Returns**: <code>Promise.&lt;UserController~LoginData&gt;</code> - resolves to login data object  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| dn | <code>string</code> | DN of user |
| sessionToken | <code>Promise.&lt;string&gt;</code> | resolves to sessionToken (jwt) |

<a id="module95usercontroller4646logindata"></a>

### userController~LoginData : <code>object</code>
Login data object.

**Kind**: inner typedef of [<code>userController</code>](#module95usercontroller)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| activeEventId | <code>ObjectID</code> &#124; <code>null</code> | id of active (or last active) event, null if no event is active |
| hasAcceptedTos | <code>boolean</code> | indicates if user accepted the terms of service |
| id | <code>string</code> | id of user |
| name | <code>string</code> | name of user |
| sessionToken | <code>string</code> | sessionToken (jwt) |

