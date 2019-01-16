<a id="desktopapp"></a>

## desktopApp(state, action)
desktopApp-reducer

**Kind**: global function  

| Param | Type |
| --- | --- |
| state | [<code>DesktopAppState</code>](#desktopappstate) | 
| action | <code>object</code> | 

<a id="getlastbroadcastedimage"></a>

## getLastBroadcastedImage(state) ⇒ <code>string</code>
Selector to retrieve last broadcasted image from desktopApp-state.

**Kind**: global function  
**Returns**: <code>string</code> - base64 image-data  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>DesktopAppState</code>](#desktopappstate) | desktopApp-state |

<a id="isbroadcastactive"></a>

## isBroadcastActive(state) ⇒ <code>boolean</code>
Selector to select state if screenshot broadcasting is active from desktopApp-state.

**Kind**: global function  
**Returns**: <code>boolean</code> - indicates if screenshot broadcasting is active  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>DesktopAppState</code>](#desktopappstate) | desktopApp-state |

<a id="isdesktopapp"></a>

## isDesktopApp(state) ⇒ <code>boolean</code>
Selector to select state if client runs inside electron context from desktopApp-state.

**Kind**: global function  
**Returns**: <code>boolean</code> - indicates if client runs inside electron context  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>DesktopAppState</code>](#desktopappstate) | desktopApp-state |

<a id="isminicontrolviewactive"></a>

## isMiniControlViewActive(state) ⇒ <code>boolean</code>
Selector to select state if mini-control-view is active from desktopApp-state.

**Kind**: global function  
**Returns**: <code>boolean</code> - indicates if mini-control-view is active  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>DesktopAppState</code>](#desktopappstate) | desktopApp-state |

<a id="ispresentationmodeactive"></a>

## isPresentationmodeActive(state) ⇒ <code>boolean</code>
Selector to select state if presentationmode is active from desktopApp-state.

**Kind**: global function  
**Returns**: <code>boolean</code> - indicates if app is in presentation-mode  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>DesktopAppState</code>](#desktopappstate) | desktopApp-state |

<a id="iswindowalwaysontop"></a>

## isWindowAlwaysOnTop(state) ⇒ <code>boolean</code>
Selector to select state if window is always on top from desktopApp-state.

**Kind**: global function  
**Returns**: <code>boolean</code> - indicates if app-window is always on top of other windows  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>DesktopAppState</code>](#desktopappstate) | desktopApp-state |

<a id="desktopappstate"></a>

## DesktopAppState : <code>object</code>
Shape of desktopApp reducers state.
Default values are the initial state.

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [app] | <code>boolean</code> | <code>false</code> | indicates if client runs inside electron context (enables desktop-App features) |
| [broadcastActive] | <code>boolean</code> | <code>false</code> | indicates if screenshot broadcasting is active |
| [lastBroadcastedImage] | <code>string</code> | <code>null</code> | base64 image-data of last broadcasted image |
| [miniControlViewActive] | <code>boolean</code> | <code>false</code> | indicates if mini-control-view is active |
| [presentationmodeActive] | <code>boolean</code> | <code>false</code> | indicates if client is in presentation-mode |
| [windowAlwaysOnTop] | <code>boolean</code> | <code>false</code> | indicates if app-window is always on top of other windows |

