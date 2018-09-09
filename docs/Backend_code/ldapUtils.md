<a id="getnamefromuseridwithcache"></a>

## getNameFromUserIdWithCache(ldap, userId) ⇒ <code>Promise.&lt;string&gt;</code>
Searches for an users name by id, caches usernames. 
LDAPConnection needs to be open (connected & bound).

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - resolves to the users name  

| Param | Type | Description |
| --- | --- | --- |
| ldap | <code>LDAPConnection</code> | LDAPConnection instance to use |
| userId | <code>string</code> | userId to look up |

<a id="getemailfromuseridwithcache"></a>

## getEmailFromUserIdWithCache(ldap, userId) ⇒ <code>Promise.&lt;string&gt;</code>
Searches for an users email by id, caches email addresses. 
LDAPConnection needs to be open (connected & bound).

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - resolves to the users email  

| Param | Type | Description |
| --- | --- | --- |
| ldap | <code>LDAPConnection</code> | LDAPConnection instance to use |
| userId | <code>string</code> | userId to look up |

