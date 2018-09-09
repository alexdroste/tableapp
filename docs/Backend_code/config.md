<a id="config"></a>

## config
Configuration values.

**Kind**: global constant  

* [config](#config)
    * [.ldap](#config46ldap)
        * [.url](#config46ldap46url) : <code>string</code>
        * [.dn](#config46ldap46dn) : <code>string</code>
        * [.password](#config46ldap46password) : <code>string</code>
        * [.base](#config46ldap46base) : <code>string</code>
        * [.emailAttributes](#config46ldap46emailattributes) : <code>Array.&lt;string&gt;</code>
        * [.nameAttribute](#config46ldap46nameattribute) : <code>string</code>
        * [.titleAttribute](#config46ldap46titleattribute) : <code>string</code> &#124; <code>undefined</code>
    * [.db](#config46db)
        * [.name](#config46db46name) : <code>string</code>
        * [.url](#config46db46url) : <code>string</code>
    * [.sessionToken](#config46sessiontoken)
        * [.privateKey](#config46sessiontoken46privatekey) : <code>string</code>
        * [.validFor](#config46sessiontoken46validfor) : <code>string</code>
    * [.eventScreenshots](#config46eventscreenshots)
        * [.keepForMinutesAfterLastUpdate](#config46eventscreenshots46keepforminutesafterlastupdate) : <code>number</code>
        * [.saveLastCount](#config46eventscreenshots46savelastcount) : <code>number</code>

<a id="config46ldap"></a>

### config.ldap
LDAP config values.

**Kind**: static property of [<code>config</code>](#config)  

* [.ldap](#config46ldap)
    * [.url](#config46ldap46url) : <code>string</code>
    * [.dn](#config46ldap46dn) : <code>string</code>
    * [.password](#config46ldap46password) : <code>string</code>
    * [.base](#config46ldap46base) : <code>string</code>
    * [.emailAttributes](#config46ldap46emailattributes) : <code>Array.&lt;string&gt;</code>
    * [.nameAttribute](#config46ldap46nameattribute) : <code>string</code>
    * [.titleAttribute](#config46ldap46titleattribute) : <code>string</code> &#124; <code>undefined</code>

<a id="config46ldap46url"></a>

#### ldap.url : <code>string</code>
URL to LDAP-Server.
Requires overwrite.

**Kind**: static property of [<code>ldap</code>](#config46ldap)  
<a id="config46ldap46dn"></a>

#### ldap.dn : <code>string</code>
DN of search-account.
Requires overwrite.

**Kind**: static property of [<code>ldap</code>](#config46ldap)  
<a id="config46ldap46password"></a>

#### ldap.password : <code>string</code>
Password of search-account.
Requires overwrite.

**Kind**: static property of [<code>ldap</code>](#config46ldap)  
<a id="config46ldap46base"></a>

#### ldap.base : <code>string</code>
Search-base.
Requires overwrite.

**Kind**: static property of [<code>ldap</code>](#config46ldap)  
<a id="config46ldap46emailattributes"></a>

#### ldap.emailAttributes : <code>Array.&lt;string&gt;</code>
LDAP entry attributes which are handled as email address.
Defaults to ['mail'].

**Kind**: static property of [<code>ldap</code>](#config46ldap)  
<a id="config46ldap46nameattribute"></a>

#### ldap.nameAttribute : <code>string</code>
LDAP entry attribute which is handled as a persons name.
Defaults to 'cn'.

**Kind**: static property of [<code>ldap</code>](#config46ldap)  
<a id="config46ldap46titleattribute"></a>

#### ldap.titleAttribute : <code>string</code> &#124; <code>undefined</code>
LDAP entry attribute which is handled as a persons title.

This setting is optional: if not set, no title is put in front of persons names.

**Kind**: static property of [<code>ldap</code>](#config46ldap)  
<a id="config46db"></a>

### config.db
Database (MongoDB) config values.

**Kind**: static property of [<code>config</code>](#config)  

* [.db](#config46db)
    * [.name](#config46db46name) : <code>string</code>
    * [.url](#config46db46url) : <code>string</code>

<a id="config46db46name"></a>

#### db.name : <code>string</code>
Name of database to use.
Defaults to 'tableapp'.

**Kind**: static property of [<code>db</code>](#config46db)  
<a id="config46db46url"></a>

#### db.url : <code>string</code>
URL to mongodb.
Defaults to local mongodb instance on default port.

**Kind**: static property of [<code>db</code>](#config46db)  
<a id="config46sessiontoken"></a>

### config.sessionToken
Config values for session tokens.

**Kind**: static property of [<code>config</code>](#config)  

* [.sessionToken](#config46sessiontoken)
    * [.privateKey](#config46sessiontoken46privatekey) : <code>string</code>
    * [.validFor](#config46sessiontoken46validfor) : <code>string</code>

<a id="config46sessiontoken46privatekey"></a>

#### sessionToken.privateKey : <code>string</code>
Private key used for signing.
Requires overwrite.

**Kind**: static property of [<code>sessionToken</code>](#config46sessiontoken)  
<a id="config46sessiontoken46validfor"></a>

#### sessionToken.validFor : <code>string</code>
Time span a sessionToken is valid after creation.
Defaults to '180d' (180 days).

Value is expressed in seconds or a string describing a time span. Eg: 60, "2 days", "10h", "7d"

**Kind**: static property of [<code>sessionToken</code>](#config46sessiontoken)  
<a id="config46eventscreenshots"></a>

### config.eventScreenshots
Config values for (event-)screenshots.

**Kind**: static property of [<code>config</code>](#config)  

* [.eventScreenshots](#config46eventscreenshots)
    * [.keepForMinutesAfterLastUpdate](#config46eventscreenshots46keepforminutesafterlastupdate) : <code>number</code>
    * [.saveLastCount](#config46eventscreenshots46savelastcount) : <code>number</code>

<a id="config46eventscreenshots46keepforminutesafterlastupdate"></a>

#### eventScreenshots.keepForMinutesAfterLastUpdate : <code>number</code>
Time in minutes to keep screenshots available after last received screenshot/update.
Defaults to 15.

**Kind**: static property of [<code>eventScreenshots</code>](#config46eventscreenshots)  
<a id="config46eventscreenshots46savelastcount"></a>

#### eventScreenshots.saveLastCount : <code>number</code>
Determines how many screenshots should be preserved at a time.
Defaults to 3.

**Kind**: static property of [<code>eventScreenshots</code>](#config46eventscreenshots)  
