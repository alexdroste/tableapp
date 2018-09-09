const EntryListTypeEnum = require('./EntryListTypeEnum');
const utils = require('./utils');


/**
 * Manages subscriptions for entry-lists.
 */
class EntryListSubscription {
    /**
     * Represents a search filter.
     * @typedef {object} EntryListSubscription~SearchFilter
     * @property {(string|undefined)} bookmarkForUser id of user, only include entries if bookmarked by this user 
     * @property {Array<ObjectID>} excludedEntryIds entries to exclude 
     * @property {number} maxScore maximum score to include 
     * @property {number} maxTimestamp maximum (entry-)timestamp to include
     * @property {number} minTimestamp minimum (entry-)timestamp to include
     */


    /**
     * Creates an EntryListSubscription instance.
     * @param {EntriesController} entriesController instance of EntriesController
     * @param {EntryListTypeEnum} type list type
     * @param {ObjectID} eventId id of event
     * @param {string} userId id of user
     * @param {boolean} onlyBookmarked indicates if only bookmarked entries should be included in subscription
     */
    constructor(entriesController, type, eventId, userId, onlyBookmarked) {
        /**
         * Instance of EntriesController that is beeing used.
         * @private
         * @type {EntriesController}
         */
        this._entriesController = entriesController;
        /**
         * Type of list subscription.
         * @private
         * @type {EntryListTypeEnum}
         */
        this._type = type;
        /**
         * Id of event.
         * @private
         * @type {ObjectID}
         */
        this._eventId = eventId;
        /**
         * Id of user.
         * @private
         * @type {string}
         */
        this._userId = userId;
        /**
         * Indicates if only bookmarked entries should be included in subscription.
         * @private
         * @type {boolean}
         */
        this._onlyBookmarked = onlyBookmarked;

        /**
         * Internal list of entry infos.
         * Entry infos are objects with neccessary properties (e.g. timestamp)
         * to perform certain operations regarding list subscriptions.
         * @private
         * @type {Array<EntriesController~EntryInfo>}
         */
        this._list = [];

        /**
         * Internal search filter.
         * @private
         * @type {SearchFilter}
         */
        this._filter;
        /**
         * Indicates if search results from internal search (entry) requests 
         * should contain a score property. 
         * @private
         * @type {boolean}
         */
        this._includeScore;
        /**
         * Object that describes sorting behaviour of entries.
         * 
         * E.g. `{ score: -1, timestamp: -1 }` will sort for score (descending)
         * first and timestamp (descending) after.
         * @private
         * @type {object}
         */
        this._sort;
        switch (this._type) {
            case EntryListTypeEnum.RECENT:
                this._filter = { 
                    excludedEntryIds: [],
                    maxTimestamp: Date.now(),
                };
                this._includeScore = false;
                this._sort = { timestamp: -1 };
                break;
            case EntryListTypeEnum.TOP_LATELY:
                this._filter = { 
                    excludedEntryIds: [],
                    maxScore: Number.MAX_VALUE,
                    minTimestamp: Date.now() - 1000 * 60 * 60 * 24 * 7 // One week ago 
                };
                this._includeScore = true;
                this._sort = { score: -1, timestamp: -1 };
                break;
            case EntryListTypeEnum.TOP_RATED:
                this._filter = { 
                    excludedEntryIds: [],
                    maxScore: Number.MAX_VALUE,
                };
                this._includeScore = true;
                this._sort = { score: -1 };
                break;
        }
        if (this._onlyBookmarked)
            this._filter.bookmarkForUser = this._userId;
    }


    /**
     * (Re-)sorts internal entry infos list based on list type.
     * @private
     * @function
     */
    _sortList() {
        let compareFunc;

        switch (this._type) {
            case EntryListTypeEnum.RECENT:
                compareFunc = (a, b) => 
                    b.timestamp - a.timestamp;
                break;
            case EntryListTypeEnum.TOP_LATELY:
                compareFunc = (a, b) => {
                    const s = b.score - a.score;
                    return s !== 0 ? s : (b.timestamp - a.timestamp);
                }
            case EntryListTypeEnum.TOP_RATED:
                compareFunc = (a, b) => 
                    b.score - a.score;
                break;
        }

        utils.insertionSort(this._list, compareFunc);
    }


    /**
     * Creates a less filter based on testKey and compareKeyAcc.
     * @private
     * @function
     * @param {Array<object>} list array of objects to create less filter for
     * @param {string} testKey key to test for in objects
     * @param {string} compareKeyAcc key to minimize and to compare against (must also be a key in initialVal)
     * @param {object} initialVal initial filter to start with
     * @returns {EntryListSubscription~SearchFilter} less filter
     */
    _createLessFilter(list, testKey, compareKeyAcc, initialVal) {
        return list.reduce((acc, cur) => {
            if (cur[testKey] < acc[compareKeyAcc]) {
                acc.excludedEntryIds = [cur._id];
                acc[compareKeyAcc] = cur[testKey];
            } else if (cur[testKey] === acc[compareKeyAcc]) {
                acc.excludedEntryIds.push(cur._id);
            }
            return acc;
        }, initialVal);
    }


    /**
     * Returns list of entry-ids that are subscribed according to list type
     * and filter. Order of ids is based on configured sorting.
     * @function
     * @returns {Array<ObjectID>} array of entry-ids
     */
    getIdList() {
        return this._list.map((cur) => cur._id);
    }


    /**
     * Result of getMoreEntries call.
     * @typedef {object} EntryListSubscription~GetMoreEntriesResult
     * @property {Array<ObjectID>} addedEntryIds array of entry-ids that were found
     * @property {boolean} hasMoreEntriesToLoad indicates if more entries can be received by calling the function again
     */


    /**
     * Retrieve next x (:= limit) entries according to the internal search filter.
     * @async
     * @function
     * @param {number} limit limtis the number of entries to receive (x := limit)
     * @returns {Promise<EntryListSubscription~GetMoreEntriesResult>} resolves to an object containing addedEntryIds and hasMoreEntriesToLoad
     */
    async getMoreEntries(limit = 15) {
        const entries = await this._entriesController.getEntriesInfoRange(
            this._eventId, this._sort, this._filter, this._includeScore, limit);

        // update filter
        switch (this._type) {
            case EntryListTypeEnum.RECENT:
                this._filter = this._createLessFilter(entries, "timestamp", "maxTimestamp", this._filter);
                break;
            case EntryListTypeEnum.TOP_LATELY:
            case EntryListTypeEnum.TOP_RATED:
                this._filter = this._createLessFilter(entries, "score", "maxScore", this._filter);
                break;
        }

        this._list.push(...entries);
        this._sortList();
        return {
            addedEntryIds: entries.map((cur) => cur._id),
            hasMoreEntriesToLoad: entries.length >= limit,
        };
    }


    /**
     * Checks if entry with specified id is subscribed by this instance.
     * @function
     * @param {ObjectID} entryId id of entry to check
     * @returns {boolean} indicates if entry is subscribed
     */
    isIdInList(entryId) {
        return this._list.findIndex((cur) => cur._id.equals(entryId)) !== -1;
    }


    /**
     * Update a single entry by supplied entryInfo.
     * @async
     * @function
     * @param {EntriesController~EntryInfo} entryInfo entryInfo of updated entry
     * @returns {Promise<boolean>} true indicates update merged, false update ignored/not relevant for this subscription
     */
    async updateEntry(entryInfo) {
        // TODO handle entry deleted

        const foundEntry = this._list.find((cur) => cur._id.equals(entryInfo._id));

        if (this._onlyBookmarked) {
            const bookmarked  = await this._entriesController.hasUserBookmarkSetForEntry(
                this._eventId, entryInfo._id, this._userId);
            if (!bookmarked) {
                if (foundEntry) { // user removing bookmark triggered update (was in list before)
                    this._list = this._list.filter((cur) => !cur._id.equals(entryInfo._id));
                    return true;
                }
                return false;
            }
        }

        if (foundEntry) {
            foundEntry.timestamp = entryInfo.timestamp;
            if (foundEntry.hasOwnProperty('score'))
                foundEntry.score = entryInfo.score;
            this._sortList();
            return true;
        }

        switch (this._type) {
            case EntryListTypeEnum.RECENT:
                if (entryInfo.timestamp < this._filter.maxTimestamp)
                    return false;
                // if item would be filtered, it should be in subscription => add it to list
                // unshift here to speed up sort because mostly untracked items will be new posts
                this._list.unshift({
                    _id: entryInfo._id,
                    timestamp: entryInfo.timestamp,
                });
                this._sortList();
                return true;
            case EntryListTypeEnum.TOP_LATELY:
                if (entryInfo.timestamp < this._filter.minTimestamp)
                    return false;
            case EntryListTypeEnum.TOP_RATED:
                if (entryInfo.score < this._filter.maxScore)
                    return false;
                this._list.push({
                    _id: entryInfo._id,
                    score: entryInfo.score,
                    timestamp: entryInfo.timestamp,
                });
                this._sortList();
                return true;
        }
        
    }
}


module.exports = EntryListSubscription;
