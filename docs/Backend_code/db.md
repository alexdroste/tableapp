<a id="module95db"></a>

## db
Manage connection to database.


* [db](#module95db)
    * _static_
        * [.connect()](#module95db46connect) ⇒ <code>Promise</code>
        * [.db()](#module95db46db) ⇒ <code>Db</code>
    * _inner_
        * [~_instance](#module95db464695instance) : <code>Db</code>

<a id="module95db46connect"></a>

### db.connect() ⇒ <code>Promise</code>
Establishes connection to mongodb.

**Kind**: static method of [<code>db</code>](#module95db)  
**Returns**: <code>Promise</code> - indicates success  
<a id="module95db46db"></a>

### db.db() ⇒ <code>Db</code>
Returns current db-instance.

**Kind**: static method of [<code>db</code>](#module95db)  
**Returns**: <code>Db</code> - MongodbClient db instance  
<a id="module95db464695instance"></a>

### db~_instance : <code>Db</code>
Mongo database instance.

**Kind**: inner property of [<code>db</code>](#module95db)  
