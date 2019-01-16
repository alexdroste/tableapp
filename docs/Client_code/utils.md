<a id="createthumbnailfrombase64image"></a>

## createThumbnailFromBase64Image(base64Image) ⇒ <code>Promise.&lt;string&gt;</code>
Creates a thumbnail (as base64) from a full image (as base64).

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - Resolves to base64 thumbnail  

| Param | Type | Description |
| --- | --- | --- |
| base64Image | <code>string</code> | full image as base64 to create thumbnail from |

<a id="filterobject"></a>

## filterObject(obj, predicate) ⇒ <code>object</code>
Filters an object by a given predicate

**Kind**: global function  
**Returns**: <code>object</code> - filtered object  
**See**: https://stackoverflow.com/a/37616104  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | object to filter |
| predicate | [<code>filterObjectPredicate</code>](#filterobjectpredicate) | filter function |

**Example**  
```js
var scores = { John: 2, Sarah: 3, Janet: 1 };
var filtered = filterObject(scores, score => score > 1); 
// { "John": 2, "Sarah": 3 }
```
<a id="generateuuid"></a>

## generateUUID() ⇒ <code>string</code>
Generates a RFC4122 v4 compliant UUID

**Kind**: global function  
**Returns**: <code>string</code> - uuid v4  
**See**: https://stackoverflow.com/a/8809472  
<a id="istextanemailaddress"></a>

## isTextAnEmailAddress(text) ⇒ <code>boolean</code>
Simple check if a short text is an email by checking for @ symbol.

**Kind**: global function  
**Returns**: <code>boolean</code> - true if text is an email  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | text input to check |

<a id="removenulledpropertiesfromobject"></a>

## removeNulledPropertiesFromObject(obj)
Removes nulled properties from an object.

**Kind**: global function  

| Param | Type |
| --- | --- |
| obj | <code>object</code> | 

<a id="uniquearray"></a>

## uniqueArray(array) ⇒ <code>Array.&lt;\*&gt;</code>
Returns a new unique version of the supplied array.

**Kind**: global function  
**Returns**: <code>Array.&lt;\*&gt;</code> - returns new unique array  
**See**: https://stackoverflow.com/a/43046408  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array.&lt;\*&gt;</code> | array to create unique version from |

<a id="filterobjectpredicate"></a>

## filterObjectPredicate ⇒ <code>boolean</code>
FilterObject predicate function.

**Kind**: global typedef  
**Returns**: <code>boolean</code> - true if object shall be included  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | value behind a key |

