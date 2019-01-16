<a id="createsafebrowserhistory"></a>

## createSafeBrowserHistory() ⇒ <code>object</code>
Returns a patched browserHistory:

* prevents going back in history too far (outside app)
* prevents pushing to the same location

**Kind**: global function  
**Returns**: <code>object</code> - object containing patched browserHistory as property .browserHistory  
**See**: https://github.com/ReactTraining/history/issues/26#issuecomment-357062114  
