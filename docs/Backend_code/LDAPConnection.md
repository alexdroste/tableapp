<a id="ldapconnection"></a>

## LDAPConnection
LDAPConnection class can be used to open a ldap-connection
and perform several search-actions.

**Kind**: global class  

* [LDAPConnection](#ldapconnection)
    * [new LDAPConnection(dn, password)](#new95ldapconnection95new)
    * [._dn](#ldapconnection4395dn) : <code>string</code> ℗
    * [._password](#ldapconnection4395password) : <code>string</code> ℗
    * [._bound](#ldapconnection4395bound) : <code>boolean</code> ℗
    * [._client](#ldapconnection4395client) : <code>object</code> ℗
    * [.open()](#ldapconnection43open) ⇒ <code>Promise</code>
    * [.close()](#ldapconnection43close) ⇒ <code>Promise</code>
    * [._connect()](#ldapconnection4395connect) ⇒ <code>Promise</code> ℗
    * [._disconnect()](#ldapconnection4395disconnect) ℗
    * [._bind()](#ldapconnection4395bind) ⇒ <code>Promise</code> ℗
    * [._unbind()](#ldapconnection4395unbind) ⇒ <code>Promise</code> ℗
    * [.search(filter, attributes, [filterIsDn], [limit])](#ldapconnection43search) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    * [.searchForDnByEmail(email)](#ldapconnection43searchfordnbyemail) ⇒ <code>Promise.&lt;(string&#124;null)&gt;</code>
    * [.getNameFromDn(dn)](#ldapconnection43getnamefromdn) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.getEmailFromDn(dn)](#ldapconnection43getemailfromdn) ⇒ <code>Promise.&lt;string&gt;</code>

<a id="new95ldapconnection95new"></a>

### new LDAPConnection(dn, password)
Creates an LDAPConnection instance.


| Param | Type | Description |
| --- | --- | --- |
| dn | <code>string</code> | DN of user to connect with |
| password | <code>string</code> | password of user to connect with |

<a id="ldapconnection4395dn"></a>

### ldapConnection._dn : <code>string</code> ℗
DN of user bind will be executed.

**Kind**: instance property of [<code>LDAPConnection</code>](#ldapconnection)  
**Access**: private  
<a id="ldapconnection4395password"></a>

### ldapConnection._password : <code>string</code> ℗
Password of user bind will be executed.

**Kind**: instance property of [<code>LDAPConnection</code>](#ldapconnection)  
**Access**: private  
<a id="ldapconnection4395bound"></a>

### ldapConnection._bound : <code>boolean</code> ℗
Indicates if bound.

**Kind**: instance property of [<code>LDAPConnection</code>](#ldapconnection)  
**Access**: private  
<a id="ldapconnection4395client"></a>

### ldapConnection._client : <code>object</code> ℗
Internal connection instance from ldapjs.

**Kind**: instance property of [<code>LDAPConnection</code>](#ldapconnection)  
**Access**: private  
<a id="ldapconnection43open"></a>

### ldapConnection.open() ⇒ <code>Promise</code>
Connect to ldap server and bind.

**Kind**: instance method of [<code>LDAPConnection</code>](#ldapconnection)  
**Returns**: <code>Promise</code> - indicates successful connect and bind  
<a id="ldapconnection43close"></a>

### ldapConnection.close() ⇒ <code>Promise</code>
Unbind and disconnect.

**Kind**: instance method of [<code>LDAPConnection</code>](#ldapconnection)  
**Returns**: <code>Promise</code> - indicates successful unbind and disconnect  
<a id="ldapconnection4395connect"></a>

### ldapConnection._connect() ⇒ <code>Promise</code> ℗
Connect to ldap server.

**Kind**: instance method of [<code>LDAPConnection</code>](#ldapconnection)  
**Returns**: <code>Promise</code> - indicates successful connect  
**Access**: private  
<a id="ldapconnection4395disconnect"></a>

### ldapConnection._disconnect() ℗
Disconnect from ldap server. This method should always be called after
connection is not used anymore to avoid left open sockets.

**Kind**: instance method of [<code>LDAPConnection</code>](#ldapconnection)  
**Access**: private  
<a id="ldapconnection4395bind"></a>

### ldapConnection._bind() ⇒ <code>Promise</code> ℗
Binds with dn and password. 
Connection needs to be open.

**Kind**: instance method of [<code>LDAPConnection</code>](#ldapconnection)  
**Returns**: <code>Promise</code> - indicates successful bind  
**Access**: private  
<a id="ldapconnection4395unbind"></a>

### ldapConnection._unbind() ⇒ <code>Promise</code> ℗
Unbinds. 
Connection needs to be open.

**Kind**: instance method of [<code>LDAPConnection</code>](#ldapconnection)  
**Returns**: <code>Promise</code> - indicates successful unbind  
**Access**: private  
<a id="ldapconnection43search"></a>

### ldapConnection.search(filter, attributes, [filterIsDn], [limit]) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
Performs a search. 
Connection need to be open and bound.

**Kind**: instance method of [<code>LDAPConnection</code>](#ldapconnection)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - returns search results as array of result objects  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filter | <code>string</code> &#124; <code>filter</code> |  | ldap filter string (remains unescaped!!!) or a ldap-js Filter object |
| attributes | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> |  | attributes to select and return |
| [filterIsDn] | <code>boolean</code> | <code>false</code> | if set, filter param is used as searchBase, search is performed with scope: base and wildcard filter |
| [limit] | <code>number</code> | <code>10</code> | maximum number of entries to return |

<a id="ldapconnection43searchfordnbyemail"></a>

### ldapConnection.searchForDnByEmail(email) ⇒ <code>Promise.&lt;(string&#124;null)&gt;</code>
Searches for a DN by a given email. 
Connection need to be open and bound.

**Kind**: instance method of [<code>LDAPConnection</code>](#ldapconnection)  
**Returns**: <code>Promise.&lt;(string&#124;null)&gt;</code> - resolves to DN if found, null if not found  

| Param | Type | Description |
| --- | --- | --- |
| email | <code>string</code> | email to search for |

<a id="ldapconnection43getnamefromdn"></a>

### ldapConnection.getNameFromDn(dn) ⇒ <code>Promise.&lt;string&gt;</code>
Performs a DN lookup and constructs the users full name (including title).
Connection need to be open and bound.

**Kind**: instance method of [<code>LDAPConnection</code>](#ldapconnection)  
**Returns**: <code>Promise.&lt;string&gt;</code> - resolves to the users name  

| Param | Type | Description |
| --- | --- | --- |
| dn | <code>string</code> | DN of user |

<a id="ldapconnection43getemailfromdn"></a>

### ldapConnection.getEmailFromDn(dn) ⇒ <code>Promise.&lt;string&gt;</code>
Performs a DN lookup and retrieves the users email.
Connection need to be open and bound.

**Kind**: instance method of [<code>LDAPConnection</code>](#ldapconnection)  
**Returns**: <code>Promise.&lt;string&gt;</code> - resolves to the users email  

| Param | Type | Description |
| --- | --- | --- |
| dn | <code>string</code> | DN of user |

