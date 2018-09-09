import createBrowserHistory from 'history/createBrowserHistory';


/**
 * Returns a patched browserHistory that prevents gooing back in history too far (outside app).
 * @function
 * @returns {object} object containing patched browserHistory as property .browserHistory
 * @see https://github.com/ReactTraining/history/issues/26#issuecomment-357062114
 */
export function createSafeBrowserHistory() {
    const obj = {
        browserHistory: createBrowserHistory(), 
        previous: 0
    };
    
    obj._push = obj.browserHistory.push;
    obj._goBack = obj.browserHistory.goBack;

    obj.browserHistory.push = (path, state) => {
        obj.previous += 1;
        obj._push(path, state);
    };

    obj.browserHistory.goBack = () => {
        if (obj.previous > 0) {
            obj.previous -= 1;
            obj._goBack();
        } else {
            obj.browserHistory.push('/');
        }
    };

    return obj;
}
