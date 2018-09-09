<a id="broadcast"></a>

## Broadcast
Broadcast class can be used to schedule interval based screenshots.

**Kind**: global class  

* [Broadcast](#broadcast)
    * _instance_
        * [._interval](#broadcast4395interval) : <code>number</code> &#124; <code>null</code> ℗
        * [._lastImg](#broadcast4395lastimg) : <code>JimpImage</code> &#124; <code>null</code> ℗
        * [._onNewImageCallback](#broadcast4395onnewimagecallback) : [<code>onNewImageCallback</code>](#broadcast4646onnewimagecallback) &#124; <code>null</code> ℗
        * [._onNewImage(img)](#broadcast4395onnewimage) ⇒ <code>Promise</code> ℗
        * [.onNewImage(cb)](#broadcast43onnewimage)
        * [.start()](#broadcast43start)
        * [.stop()](#broadcast43stop)
    * _inner_
        * [~onNewImageCallback](#broadcast4646onnewimagecallback) : <code>function</code>

<a id="broadcast4395interval"></a>

### broadcast._interval : <code>number</code> &#124; <code>null</code> ℗
Id of interval started by start function.

**Kind**: instance property of [<code>Broadcast</code>](#broadcast)  
**Access**: private  
<a id="broadcast4395lastimg"></a>

### broadcast._lastImg : <code>JimpImage</code> &#124; <code>null</code> ℗
Image data of previous processed image.

**Kind**: instance property of [<code>Broadcast</code>](#broadcast)  
**Access**: private  
<a id="broadcast4395onnewimagecallback"></a>

### broadcast._onNewImageCallback : <code>onNewImageCallback</code> &#124; <code>null</code> ℗
Registered onNewImage callback.

**Kind**: instance property of [<code>Broadcast</code>](#broadcast)  
**Access**: private  
<a id="broadcast4395onnewimage"></a>

### broadcast._onNewImage(img) ⇒ <code>Promise</code> ℗
Async internal method that calls onNewImage callback function,
converting the JimpImage to base64.

**Kind**: instance method of [<code>Broadcast</code>](#broadcast)  
**Access**: private  

| Param | Type |
| --- | --- |
| img | <code>JimpImage</code> | 

<a id="broadcast43onnewimage"></a>

### broadcast.onNewImage(cb)
Register callback for new image.

**Kind**: instance method of [<code>Broadcast</code>](#broadcast)  

| Param | Type | Description |
| --- | --- | --- |
| cb | [<code>onNewImageCallback</code>](#broadcast4646onnewimagecallback) | callback if new image was created |

<a id="broadcast43start"></a>

### broadcast.start()
Starts interval based screencapture.
Checks for differences between pictures and omits duplicates.

**Kind**: instance method of [<code>Broadcast</code>](#broadcast)  
<a id="broadcast43stop"></a>

### broadcast.stop()
Stops interval based screencapture.

**Kind**: instance method of [<code>Broadcast</code>](#broadcast)  
<a id="broadcast4646onnewimagecallback"></a>

### Broadcast~onNewImageCallback : <code>function</code>
Function called when new image was captured.

**Kind**: inner typedef of [<code>Broadcast</code>](#broadcast)  

| Param | Type | Description |
| --- | --- | --- |
| img | <code>string</code> | image as base64 |

