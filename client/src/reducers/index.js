import { combineReducers } from 'redux';
import { api } from './api';
import { comments } from './comments';
import { desktopApp } from './desktopApp';
import { entries } from './entries';
import { eventInfo } from './eventInfo';
import { events } from './events';
import { eventScreenshots } from './eventScreenshots';
import { images } from './images';
import { notifications } from './notifications';
import { user } from './user';


/**
 * root-reducer
 * 
 * combines the following reducers into a single one:
 * * api
 * * comments
 * * desktopApp
 * * entries
 * * eventInfo
 * * events
 * * eventScreenshots
 * * images
 * * user
 * @name reducer
 * @function
 * @param {object} state
 * @param {object} action
 */
export default combineReducers({
    api,
    comments,
    desktopApp,
    entries,
    eventInfo,
    events,
    eventScreenshots,
    images,
    notifications,
    user,
});
