const ActivityLogController = require('./ActivityLogController');
const CommentsController = require('./CommentsController');
const EntriesController = require('./EntriesController');
const EventsController = require('./EventsController');
const EventScreenshotsController = require('./EventScreenshotsController');
const ImagesController = require('./ImagesController');
const PromptGroupController = require('./PromptGroupController'); // extra-code for prompts
const UserController = require('./UserController');

/**
 * Controller object.
 * @typedef {object} Controller
 * @property {ActivityLogController} activityLog
 * @property {CommentsController} comments
 * @property {EntriesController} entries
 * @property {EventsController} events
 * @property {EventScreenshotsController} eventScreenshots
 * @property {ImagesController} images
 * @property {PromptGroupController} promptGroup // extra-code for prompts
 * @property {UserController} user
 */


/**
 * Returns an object with all controllers initialized.
 * @param {object} dbConnection database object (mongodb database connection)
 * @returns {Controller} controller object with all controllers initialized
 */
const configureController = (dbConnection) => {
    return {
        activityLog: new ActivityLogController(dbConnection),
        comments: new CommentsController(dbConnection),
        entries: new EntriesController(dbConnection),
        events: new EventsController(dbConnection),
        eventScreenshots: new EventScreenshotsController(dbConnection),
        images: new ImagesController(dbConnection),
        promptGroup: new PromptGroupController(dbConnection), // extra-code for prompts
        user: new UserController(dbConnection),
    };
};

module.exports = configureController;
