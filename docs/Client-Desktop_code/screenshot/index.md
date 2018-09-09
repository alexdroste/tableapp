<a id="uniqueid"></a>

## uniqueId() ⇒ <code>string</code>
Generates uuid.

**Kind**: global function  
**Returns**: <code>string</code> - uuid  
<a id="imagetobase64"></a>

## imageToBase64(img) ⇒ <code>Promise.&lt;string&gt;</code>
Converts a jimp image to base64.

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - resolves to base64 image  

| Param | Type | Description |
| --- | --- | --- |
| img | <code>JimpImage</code> | image returned by jimp |

<a id="capture"></a>

## capture() ⇒ <code>Promise.&lt;JimpImage&gt;</code>
Performs a screencapture of the active window.

**Kind**: global function  
**Returns**: <code>Promise.&lt;JimpImage&gt;</code> - resolves to a jimp image  
