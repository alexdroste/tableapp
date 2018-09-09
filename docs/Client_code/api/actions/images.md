<a id="loadimages"></a>

## loadImages(api, imageIds, onlyThumbnails) ⇒ <code>Promise.&lt;LoadImagesResult&gt;</code>
API-call: load images (and/or thumbnails) (by imageIds).

**Kind**: global function  
**Returns**: [<code>Promise.&lt;LoadImagesResult&gt;</code>](#loadimagesresult) - resolves to object containing image and thumbnaildata  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiConnection</code> | ApiConnection instance |
| imageIds | <code>Array.&lt;string&gt;</code> | array of imageIds to load |
| onlyThumbnails | <code>boolean</code> | indicates if only the thumbnails should be queried |

<a id="loadimagesresult"></a>

## LoadImagesResult : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| imageDict | <code>ImageDict</code> | dictionary of images |
| thumbnailDict | <code>ThumbnailDict</code> | dictionary of thumbnails |

