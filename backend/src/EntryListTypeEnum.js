/**
 * Enum for list types.
 * @enum {number}
 * @property {number} RECENT
 * @property {number} TOP_LATELY
 * @property {number} TOP_RATED
 */
const EntryListTypeEnum = Object.freeze({
    RECENT: 0,
    TOP_LATELY: 1,
    TOP_RATED: 2,
});

module.exports = EntryListTypeEnum;
