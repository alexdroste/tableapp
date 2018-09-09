<a id="configurestore"></a>

## configureStore(api, ipc) ⇒ <code>object</code>
Initializes and configures redux store.

Applied middlewares:
* thunk
* ipcMiddleware
* apiMiddleware
* logger (only in development)

Sets up saveState routine for saving parts of state in localStorage.

**Kind**: global function  
**Returns**: <code>object</code> - fully initialized (redux-)store  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>ApiConnection</code> | api connection instance |
| ipc | <code>IpcHandler</code> | ipc handler instance |

<a id="dispatchaction"></a>

## dispatchAction : <code>function</code>
Store-function to dispatch an action.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>object</code> | action to dispatch |

<a id="getstateofstore"></a>

## getStateOfStore ⇒ <code>object</code>
Store-function to retrieve current app-state.

**Kind**: global typedef  
**Returns**: <code>object</code> - returns object in the shape of the root-reducer with current app-state  
