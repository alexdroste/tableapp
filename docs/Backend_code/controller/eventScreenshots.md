<a id="module95eventscreenshotscontroller"></a>

## eventScreenshotscontroller
Controller for user-data.


* [eventScreenshotscontroller](#module95eventscreenshotscontroller)
    * _static_
        * [.addImageForEvent(eventId, imageData)](#module95eventscreenshotscontroller46addimageforevent) ⇒ <code>Promise</code>
        * [.getScreenshotIdsForEvent(eventId)](#module95eventscreenshotscontroller46getscreenshotidsforevent) ⇒ <code>Promise.&lt;Array.&lt;ObjectID&gt;&gt;</code>
    * _inner_
        * [~_onEventScreenshotsUpdated(eventId)](#module95eventscreenshotscontroller464695oneventscreenshotsupdated) ℗

<a id="module95eventscreenshotscontroller46addimageforevent"></a>

### eventScreenshotscontroller.addImageForEvent(eventId, imageData) ⇒ <code>Promise</code>
Adds a screenshot for an event.
Thumbnails are generated automagically.

**Kind**: static method of [<code>eventScreenshotscontroller</code>](#module95eventscreenshotscontroller)  
**Returns**: <code>Promise</code> - indicates success  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |
| imageData | <code>string</code> | base64 image-data of full image |

<a id="module95eventscreenshotscontroller46getscreenshotidsforevent"></a>

### eventScreenshotscontroller.getScreenshotIdsForEvent(eventId) ⇒ <code>Promise.&lt;Array.&lt;ObjectID&gt;&gt;</code>
Retrieve (image-)ids of screenshots for a specified event.

**Kind**: static method of [<code>eventScreenshotscontroller</code>](#module95eventscreenshotscontroller)  
**Returns**: <code>Promise.&lt;Array.&lt;ObjectID&gt;&gt;</code> - resolves to array of image-ids  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event |

<a id="module95eventscreenshotscontroller464695oneventscreenshotsupdated"></a>

### eventScreenshotscontroller~_onEventScreenshotsUpdated(eventId) ℗
Internal method that triggers update handlers.

**Kind**: inner method of [<code>eventScreenshotscontroller</code>](#module95eventscreenshotscontroller)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| eventId | <code>ObjectID</code> | id of event which screenshots have been updated |

