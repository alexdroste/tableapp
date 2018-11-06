import * as eventInfoActionTypes from '../actiontypes/eventInfo';


/**
 * Creates action for updating the prompt-group of the active event.
 * @function
 * @param {number} group prompt-group
 * @returns {object} action
 */
export function updatePromptGroup(group) { // extra-code for prompts
    return ({
        type: eventInfoActionTypes.UPDATE_PROMPT_GROUP,
        group
    });
}


/**
 * Creates action for updating the RoleList of the active event.
 * @function
 * @param {RoleList} roleList updated RoleList
 * @returns {object} action
 */
export function updateRoleList(roleList) {
    return ({
        type: eventInfoActionTypes.UPDATE_ROLE_LIST,
        roleList
    });
}


/**
 * Creates action for updating the UserDict of the active event.
 * @function
 * @param {UserDict} userDict updated UserDict
 * @returns {object} action
 */
export function updateUserDict(userDict) {
    return ({
        type: eventInfoActionTypes.UPDATE_USER_DICT,
        userDict
    });
}
