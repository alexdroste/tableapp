<a id="configurecontroller"></a>

## configureController(dbConnection) ⇒ <code>Controller</code>
Returns an object with all controllers initialized.

**Kind**: global function  
**Returns**: [<code>Controller</code>](#controller) - controller object with all controllers initialized  

| Param | Type | Description |
| --- | --- | --- |
| dbConnection | <code>object</code> | database object (mongodb database connection) |

<a id="controller"></a>

## Controller : <code>object</code>
Controller object.

**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| comments | <code>CommentsController</code> | 
| entries | <code>EntriesController</code> | 
| events | <code>EventsController</code> | 
| eventScreenshots | <code>EventScreenshotsController</code> | 
| images | <code>ImagesController</code> | 
| user | <code>UserController</code> | 

