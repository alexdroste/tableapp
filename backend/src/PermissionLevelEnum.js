/**
 * Enum for a users permission level inside an event.
 * @enum {number}
 * @property {number} NOT_A_USER
 * @property {number} USER
 * @property {number} MODERATOR
 * @property {number} ADMINISTRATOR
 */
const PermissionLevelEnum = Object.freeze({
    NOT_A_USER: 0,
    USER: 1,
    MODERATOR: 2,
    ADMINISTRATOR: 3,
});

module.exports = PermissionLevelEnum;
