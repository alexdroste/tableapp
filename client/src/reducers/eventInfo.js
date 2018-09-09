import { combineReducers } from 'redux';
import * as eventInfoActionTypes from '../actiontypes/eventInfo';
import * as eventsActionTypes from '../actiontypes/events';
import * as userActionTypes from '../actiontypes/user';
import * as utils from '../utils';


/**
 * A role object.
 * @typedef {object} Role
 * @property {string} color named color, e.g. "red", "violet", "blue", ...
 * @property {string} id role-id
 * @property {string} name name of role, e.g. "Tutor"
 */


/**
 * List of roles (see {@link Role}) ordered by priority.
 * @typedef {Array<Role>} RoleList
 */


/**
 * An event-user object.
 * @typedef {object} EventUser
 * @property {string} [email] users email address
 * @property {string} name users full name, e.g. "Dr. Max Mustermann"
 * @property {PermissionLevelEnum} [permissionLevel] users permission level
 * @property {string} roleId users roleId
 */


/**
 * Dictionary of EventUsers.
 * 
 * dict[key] = value:
 * * key := id of user
 * * value := {@link EventUser}
 * @typedef {object} UserDict
 */


/**
 * Shape of eventInfo reducers state.
 * Default values are the initial state.
 * @typedef {object} EventInfoState
 * @property {RoleList} [roleList=[]]
 * @property {UserDict} [userDict={}]
 */
const initialState = {
    roleList: [],
    userDict: {},
};


const roleList = (state = initialState.roleList, action) => {
    switch (action.type) {
        case eventInfoActionTypes.UPDATE_ROLE_LIST:
            return action.roleList;
        // reset
        case eventsActionTypes.SWITCH_ACTIVE_EVENT_REQUEST:
        case userActionTypes.CONTINUE_SESSION_REQUEST:
        case userActionTypes.LOGIN_REQUEST:
            return initialState.roleList;
        default:
            return state;
    }
};


const userDict = (state = initialState.userDict, action) => {
    switch (action.type) {
        case eventInfoActionTypes.UPDATE_USER_DICT:
            if (Object.keys(action.userDict).length === 0)
                return state;
            const newDict = {
                ...state,
                ...action.userDict,
            };
            utils.removeNulledPropertiesFromObject(newDict);
            return newDict;
        // reset
        case eventsActionTypes.SWITCH_ACTIVE_EVENT_REQUEST:
        case userActionTypes.CONTINUE_SESSION_REQUEST:
        case userActionTypes.LOGIN_REQUEST:
            return initialState.userDict;
        default:
            return state;
    }
};


/**
 * eventInfo-reducer
 * @function
 * @param {EventInfoState} state
 * @param {object} action
 */
export const eventInfo = combineReducers({
    roleList,
    userDict,
});


// selectors

/**
 * Selector to select specific role by id from eventInfo-state.
 * @function
 * @param {EventInfoState} state eventInfo-state
 * @param {string} roleId id of role
 * @returns {(Role|null)} role, null if not matching role was found
 */
export const getRole = (state, roleId) => 
    state.roleList.find((elem) => elem.id === roleId) || null;


/**
 * Selector to retrieve events role list from eventInfo-state.
 * @function
 * @param {EventInfoState} state eventInfo-state
 * @returns {RoleList} active events role list
 */
export const getRoleList = (state) => 
    state.roleList;


/**
 * Selector to retrieve priority of roles as ordered list from eventInfo-state.
 * @function
 * @param {EventInfoState} state eventInfo-state
 * @returns {Array<string>} list of role-ids ordered by priority
 */
export const getRolePriority = (state) => {
    return state.roleList.map((elem) => elem.id);
};


/**
 * Selector to select user dictionary from eventInfo-state.
 * @function
 * @param {EventInfoState} state eventInfo-state
 * @returns {UserDict} active events user dictionary
 */
export const getUserDict = (state) =>
    state.userDict;


/**
 * Selector to select an (event-)user by its id from eventInfo-state.
 * @function
 * @param {EventInfoState} state eventInfo-state
 * @param {string} userId id of user
 * @returns {(EventUser|null)} event-user with specified id, null if it does not exist
 */
export const getUser = (state, userId) =>
    state.userDict[userId] || null;


/**
 * Selector to select role-id from an event-user specified by its id from eventInfo-state.
 * @function
 * @param {EventInfoState} state eventInfo-state
 * @param {string} userId id of user
 * @returns {(string|null)} roleId of specified (event-)user, null if user or user.roleId does not exist
 */
export const getUserRoleId = (state, userId) => {
    const user = getUser(state, userId);
    if (!user) return null;
    if (!user.roleId) return null;
    return user.roleId;
};
