<a id="module95imagescontroller"></a>

## imagesController
Controller for images.


* [imagesController](#module95imagescontroller)
    * _static_
        * [.getImages(imageIds, [onlyThumbnails])](#module95imagescontroller46getimages) ⇒ <code>Promise.&lt;imagesController~GetImagesResult&gt;</code>
    * _inner_
        * [~ImageDict](#module95imagescontroller4646imagedict) : <code>object</code>
        * [~ThumbnailDict](#module95imagescontroller4646thumbnaildict) : <code>object</code>
        * [~GetImagesResult](#module95imagescontroller4646getimagesresult) : <code>object</code>

<a id="module95imagescontroller46getimages"></a>

### imagesController.getImages(imageIds, [onlyThumbnails]) ⇒ <code>Promise.&lt;imagesController~GetImagesResult&gt;</code>
Retrieve image- and/or thumbnail-data from specified images by their ids.

**Kind**: static method of [<code>imagesController</code>](#module95imagescontroller)  
**Returns**: <code>Promise.&lt;imagesController~GetImagesResult&gt;</code> - resolves to an object containing an imageDict and thumbnailDict property, if onlyThumbnails is set imageDict will be an empty object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| imageIds | <code>Array.&lt;ObjectID&gt;</code> |  | array of ids of images to retrieve |
| [onlyThumbnails] | <code>boolean</code> | <code>false</code> | indicates if only the thumbnails should be queried |

<a id="module95imagescontroller4646imagedict"></a>

### imagesController~ImageDict : <code>object</code>
Dictionary of images.

dict[key] = value:
* key := id of image 
* value := image-data (base64)

**Kind**: inner typedef of [<code>imagesController</code>](#module95imagescontroller)  
<a id="module95imagescontroller4646thumbnaildict"></a>

### imagesController~ThumbnailDict : <code>object</code>
Dictionary of thumbnails.

dict[key] = value:
* key := id of image 
* value := thumbnail-data (base64)

**Kind**: inner typedef of [<code>imagesController</code>](#module95imagescontroller)  
<a id="module95imagescontroller4646getimagesresult"></a>

### imagesController~GetImagesResult : <code>object</code>
Result of getImages call.

**Kind**: inner typedef of [<code>imagesController</code>](#module95imagescontroller)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| imageDict | <code>imagesController~ImageDict</code> | dictionary of images |
| thumbnailDict | <code>imagesController~ThumbnailDict</code> | dictionary of thumbnails |

