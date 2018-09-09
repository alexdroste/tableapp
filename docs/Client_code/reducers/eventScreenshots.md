<a id="eventscreenshots"></a>

## eventScreenshots(state, action)
eventScreenshots-reducer

**Kind**: global function  

| Param | Type |
| --- | --- |
| state | [<code>EventScreenshotsState</code>](#eventscreenshotsstate) | 
| action | <code>object</code> | 

<a id="getscreenshotids"></a>

## getScreenshotIds(state) ⇒ <code>Array.&lt;string&gt;</code>
Selector to retrieve ids of screenshots from eventScreenshots-state.

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - list of (image-)ids of screenshots (from event)  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>EventScreenshotsState</code>](#eventscreenshotsstate) | eventScreenshots-state |

<a id="eventscreenshotsstate"></a>

## EventScreenshotsState : <code>object</code>
Shape of eventScreenshots reducers state.
Default values are the initial state.

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [ids] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | list of (image-)ids of screenshots |

