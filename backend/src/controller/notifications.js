"use strict";

const broker = require('../broker');
const config = require('../config');
const db = require('../db').db;
const LDAPConnection = require('../LDAPConnection');
const ldapUtils = require('../ldapUtils');
const NotificationTypesEnum = require('../NotificationTypesEnum');
const ObjectID = require('mongodb').ObjectID;
const PermissionLevelEnum = require('../PermissionLevelEnum');
const statusCodes = require('http-status-codes');
const utils = require('../utils');


/**
 * Controller for notifications.
 * @module notificationsController
 */


 // TODO define & document types "Notification" and "ClientNotification"
 // TODO document methods



// --------- Private ---------

async function _createAndSendMails(notifications) {
    console.error("MAIL NOTIFICATIONS NOT IMPLEMENTED YET");
    if (!notifications.length) 
        return;
    // todo
}


async function _createClientNotificationUserDict(notifications) {
    const ldap = new LDAPConnection(config.ldap.dn, config.ldap.password);
    try {
        const d = {};
        await ldap.open();
        const promises = notifications.map(async (n) => {
            const { _id, data, isRead, senderId, timestamp, type, userId } = n;

            let sender = null;
            if (senderId) 
                sender = await ldapUtils.getNameFromUserIdWithCache(ldap, senderId);

            if (!d[userId])
                d[userId] = {};
            d[userId][_id] = {
                data,
                isRead,
                sender,
                timestamp,
                type
            };
        });
        await Promise.all(promises);
        return d;
    } catch (err) {
        throw err;
    } finally {
        ldap.close();
    }
}


async function _handleNewNotifications(notifications) {
    await _insertNotifications(notifications);
    await _createAndSendMails(notifications);
    broker.handleUpdateNotifications(await _createClientNotificationUserDict(notifications));
}


async function _insertNotifications(notifications) {
    if (!notifications.length) 
        return;
    const insRes = await db().collection('notifications').insertMany(notifications);
    if (insRes.result.ok !== 1 || insRes.result.n !== notifications.length)
        throw utils.createError('notifications could not be saved', statusCodes.INTERNAL_SERVER_ERROR);
}


async function _onNotificationUpdated(notificationId) {
    try {
        const n = await db().collection('notifications').find(
            { _id: notificationId, isInApp: true },
            { projection: { data: 1, isRead: 1, senderId: 1, timestamp: 1, type: 1, userId: 1 }}
        ).toArray();
        broker.handleUpdateNotifications(await _createClientNotificationUserDict(n));
    } catch (e) {
        console.error(e);
    }
}


// --------- Public ---------

async function getUnreadInAppClientNotificationDict(userId) {
    const n = await db().collection('notifications').find(
        { userId, isRead: false, isInApp: true },
        { projection: { data: 1, isRead: 1, senderId: 1, timestamp: 1, type: 1, userId: 1 }}
    ).toArray();
    const nd = await _createClientNotificationUserDict(n);
    return nd[userId];
}
exports.getUnreadInAppClientNotificationDict = getUnreadInAppClientNotificationDict;


async function markNotificationIdAsRead(notificationId) {
    const res = await db().collection('notifications')
        .updateOne({ _id: notificationId }, { $set: { isRead: true } });

    if (res.result.ok !== 1)
        throw utils.createError('error changing isRead state for notification', statusCodes.INTERNAL_SERVER_ERROR);
    if (res.result.n < 1)
        throw utils.createError('notificationId not found', statusCodes.NOT_FOUND);
    if (res.result.nModified > 0)
        _onNotificationUpdated(notificationId);
}
exports.markNotificationIdAsRead = markNotificationIdAsRead;


async function newCommentPosted(eventId, entryId, commentId, parentId, senderId, isSenderAnonymous) {
    // template notification
    const def = {
        // _id: ..., to be filled
        data: {
            commentId,
            entryId,
            eventId,
        },
        // isEmail: ..., to be filled
        // isInApp: ..., to be filled
        isRead: false,
        senderId: isSenderAnonymous ? null : senderId,
        timestamp: Date.now(),
        // type: ..., to be filled
        // userId: ..., to be filled
    }
    const notifications = [];


    // retrieve users for events in order to be able to check if a 
    // user has currently joined the event
    // if not, no notification should be generated
    const eventsArr = await db().collection('events')
        .find({ _id: eventId })
        .project({ users: 1 })
        .toArray();

    if (eventsArr < 1)
        throw utils.createError('eventId not found', statusCodes.NOT_FOUND);
    
    const hasUserIdJoined = (id) => {
        const u = eventsArr[0].users[id];
        return u ? u.permissionLevel > PermissionLevelEnum.NOT_A_USER : false;
    };


    // prepare notification for "COMMENT_ON_ENTRY"
    const entryRes = await db().collection('entries').aggregate([
        { $match: { _id: entryId, eventId } },
        { $project: {
            following: 1,
        }},
        {
            $lookup: {
                from: 'users',
                let: { following: '$following' },
                pipeline: [ 
                    { $match: { $expr: { $in: ['$_id', '$$following'] } } },
                    { $project: {
                        inAppNotifications: 1,
                        emailNotifications: 1,
                    }},
                ],
                as: 'users'
            }
        },
        {
            $project: { 
                _id: 0,
                users: 1,
            },
        },
    ]).toArray();

    if (entryRes.length != 1)
        throw utils.createError('could not find entry to notify about', statusCodes.INTERNAL_SERVER_ERROR);
    const users = entryRes[0].users;

    users.forEach(u => {
        // filter for own actions & suppress notifications for not-joined users
        if (u._id === senderId || !hasUserIdJoined(u._id))
            return;
        const isEmail = u.emailNotifications.includes(NotificationTypesEnum.COMMENT_ON_ENTRY);
        const isInApp = u.inAppNotifications.includes(NotificationTypesEnum.COMMENT_ON_ENTRY);
        if (isEmail || isInApp)
            notifications.push(Object.assign({ 
                _id: new ObjectID(),
                isEmail,
                isInApp,
                type: NotificationTypesEnum.COMMENT_ON_ENTRY,
                userId: u._id,
            }, def));
    });


    // prepare notification for "REPLY_ON_COMMENT" (this is max. one notification!)
    if (parentId) {
        const commentRes = await db().collection('comments').findOne(
            { _id: parentId },
            { projection: { _id: 0, postedById: 1 }}
        );
        const u = await db().collection('users').findOne(
            { _id: commentRes.postedById },
            { projection: { inAppNotifications: 1, emailNotifications: 1 }}
        );
        // filter for own actions & suppress notifications for not-joined users
        if (u._id !== senderId && hasUserIdJoined(u._id)) {
            const isEmail = u.emailNotifications.includes(NotificationTypesEnum.REPLY_ON_COMMENT);
            const isInApp = u.inAppNotifications.includes(NotificationTypesEnum.REPLY_ON_COMMENT);
            if (isEmail || isInApp)
                notifications.push(Object.assign({ 
                    _id: new ObjectID(),
                    isEmail,
                    isInApp,
                    type: NotificationTypesEnum.REPLY_ON_COMMENT,
                    userId: u._id,
                }, def));
        }
    }


    // filter "COMMENT_ON_ENTRY" notification in favor of "REPLY_ON_COMMENT"
    const lastNotification = notifications[notifications.length - 1];
    if (lastNotification && lastNotification.type === NotificationTypesEnum.REPLY_ON_COMMENT) {
        // if there is a REPLY_ON_COMMENT notification
        // (-> this can only be the last element of the notifications array)
        // search for possible "COMMENT_ON_ENTRY" notification for same user
        // and disable isEmail/isInApp in "COMMENT_ON_ENTRY" notification
        // if corresponding value is set in "REPLY_ON_COMMENT" notification 
        // to prevent double notification for same event
        // => either "COMMENT_ON_ENTRY" or "REPLY_ON_COMMENT", not both, but favor "REPLY_ON_COMMENT"
        const idx = notifications.findIndex(n => n.userId === lastNotification.userId && n.type === NotificationTypesEnum.COMMENT_ON_ENTRY);
        if (idx !== -1) {
            notifications[idx].isEmail = lastNotification.isEmail ? false : notifications[idx].isEmail;
            notifications[idx].isInApp = lastNotification.isInApp ? false : notifications[idx].isInApp;
            // completely remove "COMMENT_ON_ENTRY" notification if
            // neither isEmail nor isInApp is set to true
            if (!notifications[idx].isEmail && !notifications[idx].isInApp)
                notifications.splice(idx, 1);
        }
    }


    // insert/send notifications
    await _handleNewNotifications(notifications);
}
exports.newCommentPosted = newCommentPosted;


async function newEntryPosted(eventId, entryId, senderId, isSenderAnonymous) {
    const users = await db().collection('users').find(
        { $expr: { $or: [ 
            { $in: [NotificationTypesEnum.NEW_ENTRY, '$inAppNotifications']},
            { $in: [NotificationTypesEnum.NEW_ENTRY, '$emailNotifications']},
        ]}},
        { projection: { inAppNotifications: 1, emailNotifications: 1 }}
    ).toArray();

    const notifications = [];
    users.forEach(u => {
        // filter for own actions
        if (u._id === senderId)
            return;
        notifications.push({ 
            _id: new ObjectID(),
            data: {
                entryId,
                eventId,
            },
            isEmail: u.emailNotifications.includes(NotificationTypesEnum.NEW_ENTRY),
            isInApp: u.inAppNotifications.includes(NotificationTypesEnum.NEW_ENTRY),
            isRead: false,
            senderId: isSenderAnonymous ? null : senderId,
            timestamp: Date.now(),
            type: NotificationTypesEnum.NEW_ENTRY,
            userId: u._id,
        });
    });

    // insert/send notifications
    await _handleNewNotifications(notifications);
}
exports.newEntryPosted = newEntryPosted;
