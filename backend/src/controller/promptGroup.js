"use strict";

const db = require('../db').db;
const utils = require('../utils');


// TODO disable/remove when not needed anymore, added code is tagged with line:
// extra-code for prompts
/**
 * Controller for prompt groups.
 * Only supports switch between two groups: 0 and 1.
 * @module promptGroupController
 */


// dirty bit
const firstSplitDate = new Date('2018-12-16T00:00:00.000Z');
const validForMonths = 3;
const maxUnbalance = 5; // max 5 person more in one group is ok



// --------- Private ---------

function _getNextSplitDate() {
    const now = Date.now() + 1000 * 60 * 60 * 24; // + 1 day
    let nd = new Date(firstSplitDate.getTime());
    while (true) {
        if (now < nd.getTime())
            return nd;
        nd.setMonth(nd.getMonth() + validForMonths);
    }
}


async function _getNextGroup(eventId) {
    const groupRatio = await db().collection('promptgroup').aggregate([
        { $match: { 
            eventId,
            toDate:  { $gt: new Date() },
        } },
        { $group: {
            _id: '$group',
            count: { $sum: 1 },
        } }
    ]).toArray();

    const groupCount = { 0: 0, 1: 0 };
    groupRatio.forEach(d => {
        groupCount[d._id] = d.count;
    });

    if (Math.abs(groupCount[0] - groupCount[1]) < maxUnbalance)
        return Math.floor(Math.random() * 2);
    else
        return groupCount[0] < groupCount[1] ? 0 : 1;
}


async function _joinGroup(userId, eventId, group) {
    if (typeof group !== 'number')
        group = await _getNextGroup(eventId);

    const res = await db().collection('promptgroup').insertOne({
        eventId,
        fromDate: new Date(),
        group,
        toDate: _getNextSplitDate(),
        userId,
    });

    if (res.insertedCount < 1)
        throw utils.createError('prompt group could not be saved for user');

    return group;
}
    

// --------- Public ---------

async function getGroup(userId, eventId) {
    /*
    lese letzte gruppe für nutzer aus db 
    wenn kein eintrag vorhanden:
        lese verhältnis gruppenmitglieder aus db (prop: to > aktuelles datum)
        wenn verhältnis zwischen gruppen ausgeglichen (abweichung < treshold):
            random gruppe bestimmen
        sonst:
            gruppe mit weniger mitgliedern wählen
        gruppe für nutzer in db speichern (mit props from - to)
    sonst wenn letzte gruppe abgelaufen (prop: to <= aktuelles datum):
        gruppe tauschen
    return gruppe
    */
    const doc = await db().collection('promptgroup').findOne(
        { eventId, userId }, { sort: { toDate: -1 } });
    if (!doc)
        return await _joinGroup(userId, eventId);
    if (doc.toDate.getTime() <= Date.now())
        return await _joinGroup(userId, eventId, doc.group === 0 ? 1 : 0);
    return doc.group;
}
exports.getGroup = getGroup;
