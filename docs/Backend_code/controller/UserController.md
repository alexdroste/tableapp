<a id="usercontroller"></a>

## UserController
Controller for user-data.

**Kind**: global class  

* [UserController](#usercontroller)
    * [new UserController(dbConnection)](#new95usercontroller95new)
    * _instance_
        * [._db](#usercontroller4395db) : <code>object</code> ℗
        * [._createLoginData(dn, sessionToken)](#usercontroller4395createlogindata) ⇒ [<code>Promise.&lt;LoginData&gt;</code>](#usercontroller4646logindata) ℗
        * [.continueSession(sessionToken)](#usercontroller43continuesession) ⇒ [<code>Promise.&lt;LoginData&gt;</code>](#usercontroller4646logindata)
        * [.getLastActiveEventId(userId)](#usercontroller43getlastactiveeventid) ⇒ <code>Promise.&lt;(ObjectID&#124;null)&gt;</code>
        * [.login(email, password)](#usercontroller43login) ⇒ [<code>Promise.&lt;LoginData&gt;</code>](#usercontroller4646logindata)
        * [.saveLastActiveEventId(userId, eventId)](#usercontroller43savelastactiveeventid) ⇒ <code>Promise</code>
    * _inner_
        * [~LoginData](#usercontroller4646logindata) : <code>object</code>

<a id="new95usercontroller95new"></a>

### new UserController(dbConnection)
Initializes user controller.


| Param | Type | Description |
| --- | --- | --- |
| dbConnection | <code>object</code> | mongodb database connection |

<a id="usercontroller4395db"></a>

### userController._db : <code>object</code> ℗
Database connection that is beeing used.

**Kind**: instance property of [<code>UserController</code>](#usercontroller)  
**Access**: private  
<a id="usercontroller4395createlogindata"></a>

### userController._createLoginData(dn, sessionToken) ⇒ <code>Promise.&lt;LoginData&gt;</code> ℗
Creates login data object.

**Kind**: instance method of [<code>UserController</code>](#usercontroller)  
**Returns**: [<code>Promise.&lt;LoginData&gt;</code>](#usercontroller4646logindata) - resolves to login data object  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| dn | <code>string</code> | DN of user |
| sessionToken | <code>Promise.&lt;string&gt;</code> | resolves to sessionToken (jwt) |

<a id="usercontroller43continuesession"></a>

### userController.continueSession(sessionToken) ⇒ <code>Promise.&lt;LoginData&gt;</code>
Continue session with supplied sessionToken.

**Kind**: instance method of [<code>UserController</code>](#usercontroller)  
**Returns**: [<code>Promise.&lt;LoginData&gt;</code>](#usercontroller4646logindata) - resolve to login data object (id, name, sessionToken)  
**Throws**:

- <code>Error</code> if supplied sessionToken is not valid/expired


| Param | Type | Description |
| --- | --- | --- |
| sessionToken | <code>string</code> | valid sessionToken |

<a id="usercontroller43getlastactiveeventid"></a>

### userController.getLastActiveEventId(userId) ⇒ <code>Promise.&lt;(ObjectID&#124;null)&gt;</code>
Retrieves id of last active event for a user.

**Kind**: instance method of [<code>UserController</code>](#usercontroller)  
**Returns**: <code>Promise.&lt;(ObjectID&#124;null)&gt;</code> - resolves to last ative event-id (or null)  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | id of user |

<a id="usercontroller43login"></a>

### userController.login(email, password) ⇒ <code>Promise.&lt;LoginData&gt;</code>
Login user by email and password.

HINT: if app is not in production mode, using 'debug' as password always grants access

**Kind**: instance method of [<code>UserController</code>](#usercontroller)  
**Returns**: [<code>Promise.&lt;LoginData&gt;</code>](#usercontroller4646logindata) - resolves to login data object (id, name, sessionToken)  
**Throws**:

- <code>Error</code> with message: 'email not found' and statusCode NOT_FOUND if supplied email could not be found
- <code>Error</code> if user/password combination could not be used to bind to ldap


| Param | Type | Description |
| --- | --- | --- |
| email | <code>string</code> | email of user |
| password | <code>string</code> | password of user |

<a id="usercontroller43savelastactiveeventid"></a>

### userController.saveLastActiveEventId(userId, eventId) ⇒ <code>Promise</code>
Sets lastActiveEventId for a user.

**Kind**: instance method of [<code>UserController</code>](#usercontroller)  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | id of user |
| eventId | <code>ObjectID</code> | id of event to set as lastActiveEventId |

<a id="usercontroller4646logindata"></a>

### UserController~LoginData : <code>object</code>
Login data object.

**Kind**: inner typedef of [<code>UserController</code>](#usercontroller)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| activeEventId | <code>ObjectID</code> &#124; <code>null</code> | id of active (or last active) event, null if no event is active |
| id | <code>string</code> | id of user |
| name | <code>string</code> | name of user |
| sessionToken | <code>string</code> | sessionToken (jwt) |

