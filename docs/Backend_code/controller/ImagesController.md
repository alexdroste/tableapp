<a id="imagescontroller"></a>

## ImagesController
Controller for images.

**Kind**: global class  

* [ImagesController](#imagescontroller)
    * [new ImagesController(dbConnection)](#new95imagescontroller95new)
    * _instance_
        * [._db](#imagescontroller4395db) : <code>object</code> ℗
        * [.getImages(imageIds, [onlyThumbnails])](#imagescontroller43getimages) ⇒ [<code>Promise.&lt;GetImagesResult&gt;</code>](#imagescontroller4646getimagesresult)
    * _inner_
        * [~ImageDict](#imagescontroller4646imagedict) : <code>object</code>
        * [~ThumbnailDict](#imagescontroller4646thumbnaildict) : <code>object</code>
        * [~GetImagesResult](#imagescontroller4646getimagesresult) : <code>object</code>

<a id="new95imagescontroller95new"></a>

### new ImagesController(dbConnection)
Initializes images controller.


| Param | Type | Description |
| --- | --- | --- |
| dbConnection | <code>object</code> | mongodb database connection |

<a id="imagescontroller4395db"></a>

### imagesController._db : <code>object</code> ℗
Database connection that is beeing used.

**Kind**: instance property of [<code>ImagesController</code>](#imagescontroller)  
**Access**: private  
<a id="imagescontroller43getimages"></a>

### imagesController.getImages(imageIds, [onlyThumbnails]) ⇒ <code>Promise.&lt;GetImagesResult&gt;</code>
Retrieve image- and/or thumbnail-data from specified images by their ids.

**Kind**: instance method of [<code>ImagesController</code>](#imagescontroller)  
**Returns**: [<code>Promise.&lt;GetImagesResult&gt;</code>](#imagescontroller4646getimagesresult) - resolves to an object containing an imageDict and thumbnailDict property, if onlyThumbnails is set imageDict will be an empty object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| imageIds | <code>Array.&lt;ObjectID&gt;</code> |  | array of ids of images to retrieve |
| [onlyThumbnails] | <code>boolean</code> | <code>false</code> | indicates if only the thumbnails should be queried |

<a id="imagescontroller4646imagedict"></a>

### ImagesController~ImageDict : <code>object</code>
Dictionary of images.

dict[key] = value:
* key := id of image 
* value := image-data (base64)

**Kind**: inner typedef of [<code>ImagesController</code>](#imagescontroller)  
<a id="imagescontroller4646thumbnaildict"></a>

### ImagesController~ThumbnailDict : <code>object</code>
Dictionary of thumbnails.

dict[key] = value:
* key := id of image 
* value := thumbnail-data (base64)

**Kind**: inner typedef of [<code>ImagesController</code>](#imagescontroller)  
<a id="imagescontroller4646getimagesresult"></a>

### ImagesController~GetImagesResult : <code>object</code>
Result of getImages call.

**Kind**: inner typedef of [<code>ImagesController</code>](#imagescontroller)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| imageDict | [<code>ImageDict</code>](#imagescontroller4646imagedict) | dictionary of images |
| thumbnailDict | [<code>ThumbnailDict</code>](#imagescontroller4646thumbnaildict) | dictionary of thumbnails |

