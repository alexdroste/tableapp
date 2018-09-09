<a id="eventscreenshotscontroller"></a>

## EventScreenshotsController
Controller for event screenshots.

**Kind**: global class  

* [EventScreenshotsController](#eventscreenshotscontroller)
    * [new EventScreenshotsController(dbConnection)](#new95eventscreenshotscontroller95new)
    * _instance_
        * [._db](#eventscreenshotscontroller4395db) : <code>object</code> ℗
        * [._onEventScreenshotsUpdatedCallback](#eventscreenshotscontroller4395oneventscreenshotsupdatedcallback) : [<code>onEventScreenshotsUpdatedCallback</code>](#eventscreenshotscontroller4646oneventscreenshotsupdatedcallback) &#124; <code>null</code> ℗
        * [._onEventScreenshotsUpdated(eventId)](#eventscreenshotscontroller4395oneventscreenshotsupdated) ℗
        * [.onEventScreenshotsUpdated(cb)](#eventscreenshotscontroller43oneventscreenshotsupdated)
        * [.addImageForEvent(eventId, imageData)](#eventscreenshotscontroller43addimageforevent) ⇒ <code>Promise</code>
        * [.getScreenshotIdsForEvent(eventId)](#eventscreenshotscontroller43getscreenshotidsforevent) ⇒ <code>Promise.&lt;Array.&lt;ObjectID&gt;&gt;</code>
    * _inner_
        * [~onEventScreenshotsUpdatedCallback](#eventscreenshotscontroller4646oneventscreenshotsupdatedcallback) : <code>function</code>

<a id="new95eventscreenshotscontroller95new"></a>

### new EventScreenshotsController(dbConnection)
Initializes event screenshots controller.


| Param | Type | Description |
| --- | --- | --- |
| dbConnection | <code>object</code> | mongodb database connection |

<a id="eventscreenshotscontroller4395db"></a>

### eventScreenshotsController._db : <code>object</code> ℗
Database connection that is beeing used.

**Kind**: instance property of [<code>EventScreenshotsController</code>](#eventscreenshotscontroller)  
**Access**: private  
<a id="eventscreenshotscontroller4395oneventscreenshotsupdatedcallback"></a>

### eventScreenshotsController._onEventScreenshotsUpdatedCallback : <code>onEventScreenshotsUpdatedCallback</code> &#124; <code>null</code> ℗
Registered onEventScreenshotsUpdated callback.

**Kind**: instance property of [<code>EventScreenshotsController</code>](#eventscreenshotscontroller)  
**Access**: private  
<a id="eventscreenshotscontroller4395oneventscreenshotsupdated"></a>

### eventScreenshotsController._onEventScreenshotsUpdated(eventId) ℗
Internal method that calls onEventScreenshotsUpdated callback function.

**Kind**: instance method of [<code>EventScreenshotsController</code>](#eventscreenshotscontroller)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event which screenshots have been updated |

<a id="eventscreenshotscontroller43oneventscreenshotsupdated"></a>

### eventScreenshotsController.onEventScreenshotsUpdated(cb)
Register callback for event screenshots have been updated.

**Kind**: instance method of [<code>EventScreenshotsController</code>](#eventscreenshotscontroller)  

| Param | Type | Description |
| --- | --- | --- |
| cb | [<code>onEventScreenshotsUpdatedCallback</code>](#eventscreenshotscontroller4646oneventscreenshotsupdatedcallback) | callback when screenshots have been updated |

<a id="eventscreenshotscontroller43addimageforevent"></a>

### eventScreenshotsController.addImageForEvent(eventId, imageData) ⇒ <code>Promise</code>
Adds a screenshot for an event.
Thumbnails are generated automagically.

**Kind**: instance method of [<code>EventScreenshotsController</code>](#eventscreenshotscontroller)  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| imageData | <code>string</code> | base64 image-data of full image |

<a id="eventscreenshotscontroller43getscreenshotidsforevent"></a>

### eventScreenshotsController.getScreenshotIdsForEvent(eventId) ⇒ <code>Promise.&lt;Array.&lt;ObjectID&gt;&gt;</code>
Retrieve (image-)ids of screenshots for a specified event.

**Kind**: instance method of [<code>EventScreenshotsController</code>](#eventscreenshotscontroller)  
**Returns**: <code>Promise.&lt;Array.&lt;ObjectID&gt;&gt;</code> - resolves to array of image-ids  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |

<a id="eventscreenshotscontroller4646oneventscreenshotsupdatedcallback"></a>

### EventScreenshotsController~onEventScreenshotsUpdatedCallback : <code>function</code>
Function called when an events screenshots have been updated.

**Kind**: inner typedef of [<code>EventScreenshotsController</code>](#eventscreenshotscontroller)  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event which screenshots have been updated |

