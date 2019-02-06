const db = require('../db').db;
const utils = require('../utils');


// todo check for specific event not global (scan activity, ...)
module.exports = async (timeslots) => {
    const output = [];
    
    for(let i = 0; i < timeslots.length; ++i) {
        const res = await db().collection('sessionlog').aggregate([
            { 
                $match: { $and: [ 
                    { from: { $gte: timeslots[i][0] } }, 
                    { from: { $lte: timeslots[i][1] } },
                ]}
            },
            {
                $project: { userId: 1, from: 1, to: 1, _id: 0  }
            },
        ]).toArray();

        const users = {};
        res.forEach(e => {
            if (!users[e.userId]) {
                users[e.userId] = {};
                users[e.userId].sessionCount = 0;
                users[e.userId].totalDuration = 0;
            }
            users[e.userId].sessionCount++;
            users[e.userId].totalDuration += e.to - e.from;
        });

        Object.keys(users).forEach(u => {
            output.push({ 
                timeslot: i + 1,
                from: utils.timestampToString(timeslots[i][0]),
                to: utils.timestampToString(timeslots[i][1]),
                userId: utils.destoryUid(u),
                sessionCount: users[u].sessionCount,
                totalDurationMin: Math.round(users[u].totalDuration / 1000 / 60 * 10) / 10,
            });
        });
    }

    return output;
};