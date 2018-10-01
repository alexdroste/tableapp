<a id="config"></a>

## config
Configuration values.

**Kind**: global constant  

* [config](#config)
    * [.api](#config46api)
        * [.disconnectTimeout](#config46api46disconnecttimeout) : <code>number</code>
        * [.requestTimeout](#config46api46requesttimeout) : <code>number</code>
        * [.socketUrl](#config46api46socketurl) : <code>string</code>
    * [.baseUrl](#config46baseurl) : <code>string</code>
    * [.inputImageMaxRes](#config46inputimagemaxres) : <code>number</code>
    * [.saveStateDebounceTime](#config46savestatedebouncetime) : <code>number</code>

<a id="config46api"></a>

### config.api
API config values.

**Kind**: static property of [<code>config</code>](#config)  

* [.api](#config46api)
    * [.disconnectTimeout](#config46api46disconnecttimeout) : <code>number</code>
    * [.requestTimeout](#config46api46requesttimeout) : <code>number</code>
    * [.socketUrl](#config46api46socketurl) : <code>string</code>

<a id="config46api46disconnecttimeout"></a>

#### api.disconnectTimeout : <code>number</code>
Timeout in ms for api disconnect.
Defaults to 15000.

**Kind**: static property of [<code>api</code>](#config46api)  
<a id="config46api46requesttimeout"></a>

#### api.requestTimeout : <code>number</code>
Timeout in ms for a single api request.
Defaults to 30000.

**Kind**: static property of [<code>api</code>](#config46api)  
<a id="config46api46socketurl"></a>

#### api.socketUrl : <code>string</code>
URL to Websocket-API.
Defaults to localhost:4898.

**Kind**: static property of [<code>api</code>](#config46api)  
<a id="config46baseurl"></a>

### config.baseUrl : <code>string</code>
Base-URL of client. Needs to end with a slash.
Defaults to localhost:3000.

**Kind**: static property of [<code>config</code>](#config)  
<a id="config46inputimagemaxres"></a>

### config.inputImageMaxRes : <code>number</code>
Maximum resolution (width or height) in px for an attached image.
Larger pictures get resized to this value.
Defaults to 1200.

**Kind**: static property of [<code>config</code>](#config)  
<a id="config46savestatedebouncetime"></a>

### config.saveStateDebounceTime : <code>number</code>
Time intervall in ms that state-save operations 
(save state to localStorage) can be performed at max rate.  
Defaults to 500.

**Kind**: static property of [<code>config</code>](#config)  
