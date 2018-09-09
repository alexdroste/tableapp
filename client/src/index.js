import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker'; // TODO
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { configureStore } from './configureStore';
import { ApiConnection } from './api/ApiConnection';
import { App } from './containers/App';
import { config } from './config';
import { createSafeBrowserHistory } from './createSafeBrowserHistory';
import { ScrollMemory } from './containers/ScrollMemory';
import { IpcHandler } from './ipc/IpcHandler';

console.log(config);
const api = new ApiConnection();
const ipc = new IpcHandler();
const store = configureStore(api, ipc);
api.initialize(config.api.socketUrl, store.dispatch, store.getState);
ipc.initialize(store.dispatch);

const safeBrowserHistory = createSafeBrowserHistory();

ReactDOM.render(
    <Router history={safeBrowserHistory.browserHistory}>
        <ScrollMemory>
            <Provider store={store}>
                <App />
            </Provider>
        </ScrollMemory>
    </Router>
, document.getElementById('root'));


// registerServiceWorker();
