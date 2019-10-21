const db = require('../db').db;
const utils = require('../utils');


module.exports = async (eventId, fromTime, toTime, timeslots, tutorUserIds) => {
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
            $project: { 
                bookmarks: 1,
                downvotes: 1,
                extraQuestions: 1,
                following: 1,
                imageIds: 1,
                postedById: 1,
                timestamp: 1,
                upvotes: 1,
            }
        },
        {
            $lookup: {
                from: 'comments',
                let: { entryId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$entryId', '$$entryId'],
                            },
                            $and: [ 
                                { timestamp: { $gte: fromTime } }, 
                                { timestamp: { $lte: toTime } },
                            ]
                        }
                    },
                    {
                        $count: 'count'
                    }
                ],
                as: 'comments'
            }
        }
    ]).toArray();


    return entriesRes.map(e => {
        let inTimeslot = false;
        for(let i = 0; i < timeslots.length; ++i) {
            if (e.timestamp >= timeslots[i][0] && e.timestamp <= timeslots[i][1]) {
                inTimeslot = true;
                break;
            }
        }

        return {
            entryId: e._id,
            byTutor: tutorUserIds.includes(e.postedById) ? 'yes' : 'no',
            inTimeslot,
            totalVotes: e.downvotes.length + e.upvotes.length,
            score: e.upvotes.length - e.downvotes.length,
            commentCount: e.comments[0] ? e.comments[0].count : 0,
            imgCount: e.imageIds.length,
        };
    });
};