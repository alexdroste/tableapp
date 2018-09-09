<a id="images"></a>

## images(state, action)
images-reducer

**Kind**: global function  

| Param | Type |
| --- | --- |
| state | [<code>ImagesState</code>](#imagesstate) | 
| action | <code>object</code> | 

<a id="generatelocalimageid"></a>

## generateLocalImageId() ⇒ <code>string</code>
Generates a new local image id (uuid).

**Kind**: global function  
**Returns**: <code>string</code> - local image id  
<a id="getimage"></a>

## getImage(state, imageId) ⇒ <code>string</code> &#124; <code>null</code>
Selector to retrieve image data for a specific imageId from images-state.

**Kind**: global function  
**Returns**: <code>string</code> &#124; <code>null</code> - image-data (base64), null if image-data is not (locally) available  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>ImagesState</code>](#imagesstate) | images-state |
| imageId | <code>string</code> | id of image |

<a id="getthumbnail"></a>

## getThumbnail(state, imageId) ⇒ <code>string</code> &#124; <code>null</code>
Selector to retrieve thumbnail data for a specific imageId from images-state.

**Kind**: global function  
**Returns**: <code>string</code> &#124; <code>null</code> - thumbnail-data (base64), null if thumbnail-data is not (locally) available  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>ImagesState</code>](#imagesstate) | images-state |
| imageId | <code>string</code> | id of image |

<a id="getthumbnaildict"></a>

## getThumbnailDict(state) ⇒ <code>ThumbnailDict</code>
Selector to retrieve whole thumbnail dictionary from images-state.

**Kind**: global function  
**Returns**: [<code>ThumbnailDict</code>](#thumbnaildict) - dictionary of thumbnails  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>ImagesState</code>](#imagesstate) | images-state |

<a id="imagedict"></a>

## ImageDict : <code>object</code>
Dictionary of images.

dict[key] = value:
* key := id of image 
* value := image-data (base64)

**Kind**: global typedef  
<a id="thumbnaildict"></a>

## ThumbnailDict : <code>object</code>
Dictionary of thumbnails.

dict[key] = value:
* key := id of image 
* value := thumbnail-data (base64)

**Kind**: global typedef  
<a id="imagesstate"></a>

## ImagesState : <code>object</code>
Shape of images reducers state.
Default values are the initial state.

**Kind**: global typedef  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| [imageDict] | [<code>ImageDict</code>](#imagedict) | <code>{}</code> | 
| [thumbnailDict] | [<code>ThumbnailDict</code>](#thumbnaildict) | <code>{}</code> | 

