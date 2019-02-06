const db = require('../db').db;
const utils = require('../utils');


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
                $project: { userAgent: 1, _id: 0  }
            },
        ]).toArray();

        let mobile = 0;
        let desktop = 0;

        res.forEach(e => {
            if (utils.isMobileUserAgent(e.userAgent))
                mobile++;
            else
                desktop++;
        });

        output.push({ 
            timeslot: i + 1,
            from: utils.timestampToString(timeslots[i][0]),
            to: utils.timestampToString(timeslots[i][1]),
            mobileSessions: mobile,
            desktopSessions: desktop,
            mobilePercent: mobile / (mobile + desktop),
            desktopPercent: desktop / (mobile + desktop),
        });
    }

    return output;
};