"use strict";

const CURRENT_DATASET_VERSION = 1;

const db = require('../db').db;
const utils = require('../utils');
const statusCodes = require('http-status-codes');
const NotificationTypesEnum = require('../NotificationTypesEnum');


/**
 * Controller that handles migration between dataset versions of the db.
 * @module dbVersionMigrationController
 */


// --------- Private ---------

async function _0to1() {
    console.info('Starting dataset migration from v0 to v1...');

    // split sessioninfos from user objects
    const uRes = await db().collection('users').find({}, {
        projection: { sessionInfos: 1 }
    }).toArray();
    const sessionInfos = [];
    uRes.forEach(u => {
        u.sessionInfos.forEach(si => {
            sessionInfos.push(Object.assign({
                userId: u._id,
            }, si));
        });
    });
    const insRes = await db().collection('sessionlog').insertMany(sessionInfos);
    if (insRes.result.ok !== 1 || insRes.result.n !== sessionInfos.length)
        throw utils.createError('error migrating dataset to v1', statusCodes.INTERNAL_SERVER_ERROR);
    const remRes = await db().collection('users').updateMany({}, { $unset: { sessionInfos: 1 } });
    if (remRes.result.ok !== 1)
        throw utils.createError('error migrating dataset to v1', statusCodes.INTERNAL_SERVER_ERROR);

    // notificationsettings
    const addSettingsRes = await db().collection('users').updateMany({}, {
        $set: {
            inAppNotifications: [NotificationTypesEnum.COMMENT_ON_ENTRY, NotificationTypesEnum.REPLY_ON_COMMENT],
            emailNotifications: [NotificationTypesEnum.COMMENT_ON_ENTRY, NotificationTypesEnum.REPLY_ON_COMMENT],
        }
    });
    if (addSettingsRes.result.ok !== 1)
        throw utils.createError('error migrating dataset to v1', statusCodes.INTERNAL_SERVER_ERROR);
    
    // update version doc
    const updVersionRes = await db().collection('migration').updateOne({ _id: 'version' }, {
        $set: { version: 1 }
    });
    if (updVersionRes.result.ok !== 1)
        throw utils.createError('error migrating dataset to v1', statusCodes.INTERNAL_SERVER_ERROR);

    console.info('Dataset migrated to v1.');
}


// --------- Public ---------

async function checkAndUpdateVersion() {
    const versionDoc = await db().collection('migration').findOne({ _id: 'version' });
    
    if (!versionDoc) {
        console.warn('Unidentified dataset version. Version set to ' 
            + CURRENT_DATASET_VERSION + '. Possible data corruption!' +
            ' Ignore this message, if this is the first run.');
        const insRes = await db().collection('migration').insertOne({
            _id: 'version',
            version: CURRENT_DATASET_VERSION,
        });
        if (insRes.result.ok !== 1 || insRes.result.n < 1)
            throw utils.createError('error saving db dataset version', statusCodes.INTERNAL_SERVER_ERROR);
        return;
    }

    switch(versionDoc.version) {
        case 0:
            await _0to1();
        case 1:
            break;
        // case 1:
        //     await _1to2();
        // case 2:
        //     await _2to3();
        // case 3:
        //     break;
        default:
            throw utils.createError('Incompatible dataset version. No migration possible.',
                statusCodes.INTERNAL_SERVER_ERROR);
    }
}
exports.checkAndUpdateVersion = checkAndUpdateVersion;
