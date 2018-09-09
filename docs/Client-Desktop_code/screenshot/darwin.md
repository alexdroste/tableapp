<a id="getactivewindowid"></a>

## getActiveWindowID() ⇒ <code>Promise.&lt;string&gt;</code>
Retrieve quartz windowId of active window.
Relies on external binary.

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - windowId of active window  
<a id="capturewindow"></a>

## captureWindow(windowId, output) ⇒ <code>Promise</code>
Performs a screencapture of window with windowId on darwin / mac.
Relies on external binary.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| windowId | <code>string</code> | id of (quartz) window to capture |
| output | <code>string</code> | specify output path |

<a id="capture"></a>

## capture(output) ⇒ <code>Promise</code>
Creates screencapture of active window on darwin / mac.
Relies on external binary.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| output | <code>string</code> | specify output path |

