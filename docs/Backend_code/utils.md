<a id="createerror"></a>

## createError(msg, [code]) ⇒ <code>Error</code>
Creates a new Error object with a custom code attribute

**Kind**: global function  
**Returns**: <code>Error</code> - error object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| msg | <code>string</code> |  | error-message |
| [code] | <code>number</code> &#124; <code>string</code> | <code>500</code> | code (status-code) property, defaults to internal server error (500) |

<a id="createsessiontoken"></a>

## createSessionToken(dn) ⇒ <code>string</code>
Creates a sessionToken.

**Kind**: global function  
**Returns**: <code>string</code> - signed jwt (JSON Web Token), containing payload (see [SessionTokenPayload](#sessiontokenpayload))  

| Param | Type | Description |
| --- | --- | --- |
| dn | <code>string</code> | dn of user |

<a id="createthumbnailfrombase64image"></a>

## createThumbnailFromBase64Image(base64Image) ⇒ <code>Promise.&lt;string&gt;</code>
Creates a thumbnail (as base64) from a full image (as base64).

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - Resolves to base64 thumbnail  

| Param | Type | Description |
| --- | --- | --- |
| base64Image | <code>string</code> | full image as base64 to create thumbnail from |

<a id="filterarrayfornulledentries"></a>

## filterArrayForNulledEntries(arr) ⇒ <code>Array</code>
Filters and returns new array without falsy elements like null, undefined or "".

**Kind**: global function  
**Returns**: <code>Array</code> - new filtered array  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array</code> | array to filter |

<a id="insertionsort"></a>

## insertionSort(array, compareFunc)
In-place insertion-sort.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> | array to sort |
| compareFunc | [<code>compareFunction</code>](#comparefunction) | function to compare elements in array, >0 means b comes before a |

<a id="isappindevelopmentmode"></a>

## isAppInDevelopmentMode() ⇒ <code>boolean</code>
Determines if current instance runs in development mode. (NODE_ENV)

**Kind**: global function  
**Returns**: <code>boolean</code> - true if NODE_ENV is not set to 'production'  
<a id="removenulledpropertiesfromobject"></a>

## removeNulledPropertiesFromObject(obj)
Removes nulled properties from an object.

**Kind**: global function  

| Param | Type |
| --- | --- |
| obj | <code>object</code> | 

<a id="verifysessiontoken"></a>

## verifySessionToken(sessionToken) ⇒ <code>SessionTokenPayload</code>
Verifies and decodes sessionToken.

**Kind**: global function  
**Returns**: [<code>SessionTokenPayload</code>](#sessiontokenpayload) - decoded sessionToken (payload)  
**Throws**:

- <code>Error</code> with message 'jwt expired' if token expired
- <code>Error</code> with message 'jwt malformed' if supplied sessionToken is not a jwt


| Param | Type | Description |
| --- | --- | --- |
| sessionToken | <code>string</code> | signed jwt |

<a id="sessiontokenpayload"></a>

## SessionTokenPayload : <code>object</code>
A sessionTokens payload.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| dn | <code>string</code> | users DN |
| iat | <code>number</code> | timestamp token was issued |
| exp | <code>number</code> | timestamp when token expires |

<a id="comparefunction"></a>

## compareFunction ⇒ <code>number</code>
Compare function interface.

**Kind**: global typedef  
**Returns**: <code>number</code> - <0: a comes before b, 0: a and b are of equal value, >0: b comes before a  

| Param | Type |
| --- | --- |
| a | <code>\*</code> | 
| b | <code>\*</code> | 

