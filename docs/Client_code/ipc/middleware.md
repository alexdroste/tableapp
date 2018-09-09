<a id="ipcmiddleware"></a>

## ipcMiddleware(ipc) ⇒ <code>function</code>
Redux middleware for ipc messages. 

### API middleware usage:

Dispatch an action with following shape:

```
type: can be anything,
ipcCall: (ipc) => resizeWindow(ipc, width, height),
...rest
```

**Kind**: global function  
**Returns**: <code>function</code> - redux middleware  
**See**: https://stackoverflow.com/a/41309189  

| Param | Type | Description |
| --- | --- | --- |
| ipc | <code>object</code> | ipc handler instance |

