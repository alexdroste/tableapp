<a id="apimiddleware"></a>

## apiMiddleware(api) ⇒ <code>function</code>
Redux middleware for api calls. 

### API middleware usage:

Dispatch an action with following shape:

```
type: always 'apiCall',
apiCall: {
   key: 'login',
   types: [REQUEST, SUCCESS, FAILURE],
   call: (api) => api.login("myemail@web.de", "mypass")
},
...rest
```

### apiCall.key property // parallel execution prevention

Setting key prevents parallel execution (of api calls with same key) 
to avoid race conditions.

If a call was blocked, an action with the following shape is dispatched:

```
type: BLOCKED_REQUEST (actionType from api),
originalType: REQUEST (as specified in apiCall.types),
...rest
```

### additional notes

- apiCall.call must return a Promise
- SUCCESS action holds response in action.result
- FAILURE action holds error-response in action.error

**Kind**: global function  
**Returns**: <code>function</code> - redux middleware  
**See**: https://stackoverflow.com/a/41309189  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>object</code> | api instance |

