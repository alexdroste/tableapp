const db = require('../db').db;
const utils = require('../utils');


module.exports = async () => {
    const res = await db().collection('sessionlog').aggregate([
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

    return [{ 
        mobileSessions: mobile,
        desktopSessions: desktop,
        mobilePercent: mobile / (mobile + desktop),
        desktopPercent: desktop / (mobile + desktop),
    }];
};