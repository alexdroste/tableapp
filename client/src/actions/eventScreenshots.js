import * as eventScreenshotsActionTypes from '../actiontypes/eventScreenshots';


/**
 * Creates action for updating the screenshot-ids of the event-screenshots.
 * @function
 * @property {Array<string>} ids updated list of (image-)ids of event-screenshots
 * @returns {object} action
 */
export function updateScreenshotIds(ids) {
    return ({
        type: eventScreenshotsActionTypes.UPDATE_SCREENSHOT_IDS,
        ids
    });
}
