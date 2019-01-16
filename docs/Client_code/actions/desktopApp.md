<a id="broadcastcancelled"></a>

## broadcastCancelled() ⇒ <code>object</code>
Creates action for cancelling a broadcast.

**Kind**: global function  
**Returns**: <code>object</code> - action  
<a id="broadcastnewimage"></a>

## broadcastNewImage(imageData) ⇒ <code>object</code>
Creates action for broadcasting a new image.

**Kind**: global function  
**Returns**: <code>object</code> - action  

| Param | Type | Description |
| --- | --- | --- |
| imageData | <code>string</code> | base64 image-data of full image |

<a id="initdesktopapp"></a>

## initDesktopApp() ⇒ <code>object</code>
Creates action for initializing the desktop-app features/environment.

**Kind**: global function  
**Returns**: <code>object</code> - action  
<a id="setminicontrolviewactive"></a>

## setMiniControlViewActive(active) ⇒ <code>object</code>
Creates action for going to/exiting the mini-control-view (controls window size/position).
Only dispatches is presentation-mode is active.

**Kind**: global function  
**Returns**: <code>object</code> - action  

| Param | Type | Description |
| --- | --- | --- |
| active | <code>boolean</code> | indicates if mini-control-view should be active |

<a id="setpresentationmodeactive"></a>

## setPresentationmodeActive(active) ⇒ <code>object</code>
Creates action for setting presentationmode-active state.

**Kind**: global function  
**Returns**: <code>object</code> - action  

| Param | Type | Description |
| --- | --- | --- |
| active | <code>boolean</code> | indicates if presentationmode should be activated |

<a id="setwindowalwaysontop"></a>

## setWindowAlwaysOnTop(alwaysOnTop) ⇒ <code>object</code>
Creates action for setting always-on-top state.

**Kind**: global function  
**Returns**: <code>object</code> - action  

| Param | Type | Description |
| --- | --- | --- |
| alwaysOnTop | <code>boolean</code> | indicates if app-window should be always on top of other windows |

<a id="setbroadcastactive"></a>

## setBroadcastActive(active) ⇒ <code>object</code>
Creates action for setting broadcast state.

**Kind**: global function  
**Returns**: <code>object</code> - action  

| Param | Type | Description |
| --- | --- | --- |
| active | <code>boolean</code> | indicates if broadcasting should be activated |

<a id="toggleminicontrolview"></a>

## toggleMiniControlView() ⇒ <code>object</code>
Creates action for toggling mini-control-view active state.

**Kind**: global function  
**Returns**: <code>object</code> - action  
