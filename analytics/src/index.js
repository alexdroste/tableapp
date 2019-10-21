"use strict";

const CURRENT_DATASET_VERSION = 1;

const EVENTID = '5bd1c0b188b8da7757fc575c';

const TIMESLOTS_STR = [
    ["2018-10-25T16:55", "2018-10-25T18:30"],
    ["2018-11-01T16:55", "2018-11-01T18:30"],
    ["2018-11-08T16:55", "2018-11-08T18:30"],
    ["2018-11-15T16:55", "2018-11-15T18:30"],
    ["2018-11-22T16:55", "2018-11-22T18:30"],
    ["2018-11-29T16:55", "2018-11-29T18:30"],
    ["2018-12-06T16:55", "2018-12-06T18:30"],
    ["2018-12-13T16:55", "2018-12-13T18:30"],
    ["2018-12-20T16:55", "2018-12-20T18:30"],
    ["2019-01-10T16:55", "2019-01-10T18:30"],
    ["2019-01-17T16:55", "2019-01-17T18:30"],
    ["2019-01-24T16:55", "2019-01-24T18:30"],
    ["2019-01-31T16:55", "2019-01-31T18:30"],
];


const TUTOR_UIDS = [
    'avd15',
    'amac15',
    'ob16',
    'mpr16',
    'mj08',
    'mbar13',
    'ano13',
    'lbu16',
    'sbar14', 
    'mgo16',
];


const csvExport = require('./csvExport');
const db = require('./db');
const ObjectID = require('mongodb').ObjectID;
const utils = require('./utils');
const singlePosts = require('./generators/singlePosts');
const timeslotAllUsers = require('./generators/timeslotAllUsers');
const timeslotSingleUsers = require('./generators/timeslotSingleUsers');
const timeslotUserActivity = require('./generators/timeslotUserActivity');
const userActivity = require('./generators/userActivity');
const mobileVsDesktop = require('./generators/mobileVsDesktop');
const timeslotMobileVsDesktop = require('./generators/timeslotMobileVsDesktop');


db.connect().then(async () => {
    const versionDoc = await db.db().collection('migration').findOne({ _id: 'version' });
    if (versionDoc.version !== CURRENT_DATASET_VERSION)
        throw new Error('db version mismatch');
}).catch(reason => {
    console.error(reason);
    process.exit();
}).then(async () => {

    const eventId = ObjectID(EVENTID);

    // convert timeslots to unix-timestamps
    const timeslots = [];
    TIMESLOTS_STR.forEach(e => {
        timeslots.push([
            (new Date(e[0])).getTime(),
            (new Date(e[1])).getTime(),
        ]);
    });

    // convert tutor uids to system userIds
    const tutorUserIds = [];
    TUTOR_UIDS.forEach(u => {
        tutorUserIds.push(utils.base64encode(`uid=${u},ou=people,dc=tu-clausthal,dc=de`));
    });

    const fromTime = timeslots[0][0];
    const toTime = timeslots[timeslots.length-1][1] + 7 * 24 * 60 * 60 * 1000;

    // generate stats
    const a1 = await timeslotAllUsers(timeslots);
    csvExport('timeslotAllUsers', a1);
    const a2 = await timeslotSingleUsers(timeslots, tutorUserIds);
    csvExport('timeslotSingleUsers', a2);
    const a3 = await userActivity(eventId, fromTime, toTime, tutorUserIds);
    csvExport('userActivity', a3);
    const a4 = await timeslotUserActivity(eventId, timeslots, tutorUserIds);
    csvExport('timeslotUserActivity', a4);
    const a5 = await mobileVsDesktop();
    csvExport('mobileVsDesktop', a5);
    const a6 = await timeslotMobileVsDesktop(timeslots);
    csvExport('timeslotMobileVsDesktop', a6);
    const a7 = await singlePosts(eventId, fromTime, toTime, timeslots, tutorUserIds);
    csvExport('singlePosts', a7);

    process.exit();
});