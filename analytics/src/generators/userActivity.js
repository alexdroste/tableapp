const db = require('../db').db;
const utils = require('../utils');


module.exports = async (eventId, fromTime, toTime, tutorUserIds) => {
    const users = {};
    const checkId = (userId) => {
        if (users[userId]) return;
        users[userId] = {};
        users[userId].entryCount = 0;
        users[userId].commentCount = 0;
        users[userId].overscrollReadCount = 0;
        users[userId].uniqueOverscrollReadCount = 0;
        users[userId].readCount = 0;
        users[userId].uniqueReadCount = 0;
        users[userId].sessionCount = 0;
        users[userId].totalSessionDuration = 0;
    }
    
    // count entries
    const entriesRes = await db().collection('entries').aggregate([
        { 
            $match: { 
                eventId,
                $and: [ 
                    { timestamp: { $gte: fromTime } }, 
                    { timestamp: { $lte: toTime } },
                ]
            }
        },
        {
            $project: { postedById: 1, _id: 0  }
        },
        {
            $group: {
                _id: '$postedById',
                count: { $sum: 1 },
            }
        }
    ]).toArray();

    entriesRes.forEach(e => {
        checkId(e._id);
        users[e._id].entryCount += e.count;
    });

    // count comments
    const commentsRes = await db().collection('comments').aggregate([
        { 
            $match: { 
                eventId,
                $and: [ 
                    { timestamp: { $gte: fromTime } }, 
                    { timestamp: { $lte: toTime } },
                ]
            }
        },
        {
            $project: { postedById: 1, _id: 0  }
        },
        {
            $group: {
                _id: '$postedById',
                count: { $sum: 1 },
            }
        }
    ]).toArray();

    commentsRes.forEach(e => {
        checkId(e._id);
        users[e._id].commentCount += e.count;
    });

    // count reads
    const activityRes = await db().collection('activitylog').aggregate([
        { 
            $match: { 
                activeEventId: eventId,
                activity: 'entries/readEntry',
                $and: [ 
                    { timestamp: { $gte: fromTime } }, 
                    { timestamp: { $lte: toTime } },
                ]
            }
        },
        {
            $project: { data: 1, userId: 1, _id: 0  }
        },
        {
            $group: {
                _id: { userId: '$userId', entryId: '$data.entryId', isScrollOver: '$data.isScrollOver' },
                count: { $sum: 1 },
            }
        }
    ]).toArray();

    activityRes.forEach(e => {
        checkId(e._id.userId);
        if (e._id.isScrollOver) {
            users[e._id.userId].uniqueOverscrollReadCount++;
            users[e._id.userId].overscrollReadCount += e.count;
        } else {
            users[e._id.userId].uniqueReadCount++;
            users[e._id.userId].readCount += e.count;
        }
    });


    const sessionRes = await db().collection('sessionlog').aggregate([
        { 
            $match: { $and: [ 
                { from: { $gte: fromTime } }, 
                { from: { $lte: toTime } },
            ]}
        },
        {
            $project: { userId: 1, from: 1, to: 1, _id: 0  }
        },
    ]).toArray();

    sessionRes.forEach(e => {
        checkId(e.userId);
        users[e.userId].sessionCount++;
        users[e.userId].totalSessionDuration += e.to - e.from;
    });


    return Object.keys(users).map(u => {
        return { 
            userId: utils.destoryUid(u),
            isTutor: tutorUserIds.includes(u) ? 'yes' : 'no',
            entryCount: users[u].entryCount,
            commentCount: users[u].commentCount,
            readCount: users[u].readCount,
            uniqueReadCount: users[u].uniqueReadCount,
            overscrollReadCount: users[u].overscrollReadCount,
            uniqueOverscrollReadCount: users[u].uniqueOverscrollReadCount,
            sessionCount: users[u].sessionCount,
            totalSessionDurationMin: Math.round(users[u].totalSessionDuration / 1000 / 60 * 10) / 10,
        };
    });
};