<a id="desktopapp"></a>

## desktopApp(state, action)
desktopApp-reducer

**Kind**: global function  

| Param | Type |
| --- | --- |
| state | [<code>DesktopAppState</code>](#desktopappstate) | 
| action | <code>object</code> | 

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

<a id="iswindowalwaysontop"></a>

## isWindowAlwaysOnTop(state) ⇒ <code>boolean</code>
Selector to select state if window is always on top from desktopApp-state.

**Kind**: global function  
**Returns**: <code>boolean</code> - indicates if app is in presentation-mode / window is always on top of other windows  

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
| [windowAlwaysOnTop] | <code>boolean</code> | <code>false</code> | indicates if app is in presentation-mode / window is always on top of other windows |

