const db = require('../db').db;
const utils = require('../utils');
const userActivity = require('./userActivity');


module.exports = async (eventId, timeslots, tutorUserIds) => {
    const output = [];

    for(let i = 0; i < timeslots.length; ++i) {
        const activity = await userActivity(eventId, timeslots[i][0], timeslots[i][1], tutorUserIds);
        activity.forEach(a => {
            output.push(Object.assign({ 
                timeslot: i + 1,
                from: utils.timestampToString(timeslots[i][0]),
                to: utils.timestampToString(timeslots[i][1]),
            }, a));
        });
    }

    return output;
};