const electron = require('electron');
const defaults = require('./defaults');
const debounce = require('lodash.debounce');


class WindowManager {
    constructor(browserWindow) {
        this.browserWindow = browserWindow;
        this.boundsByScreenSetup = {};
        this.isMiniControlViewActive = false;

        const debouncedUpdateBounds = debounce(() => this.updateBounds(), 250);

        browserWindow.on('move', debouncedUpdateBounds);
        browserWindow.on('resize', debouncedUpdateBounds);
        electron.screen.on("display-added", () => this.restorePosition());
        electron.screen.on("display-metrics-changed", () => this.ensureWindowIsInScreenBounds());
        electron.screen.on("display-removed", () => this.restorePosition());

        this.updateBounds();
    }


    static getDisplayForBounds(bounds) {
        // use midpoint
        return electron.screen.getDisplayNearestPoint({
            x: bounds.x + bounds.width / 2,
            y: bounds.y + bounds.height / 2,
        })
    }


    static getScreenSetupHash() {
        const displayIds = electron.screen.getAllDisplays().map(disp => disp.id);
        displayIds.sort();
        return displayIds.reduce((acc, cur) => {
            return acc + cur.toString();
        }, "");
    }


    ensureWindowIsInScreenBounds() {
        const win = this.browserWindow.getBounds();
        const screen = WindowManager.getDisplayForBounds(win).bounds;
        // left + top check should have priority before right + bottom
        if (win.x + win.width > screen.x + screen.width) // right
            win.x = screen.x + screen.width - win.width;
        if (win.y + win.height > screen.y + screen.height) // bottom
            win.y = screen.y + screen.height - win.height;
        if (win.x < screen.x) // left
            win.x = screen.x;
        if (win.y < screen.y) // top
            win.y = screen.y;

        // ensure window fits screen size
        if (win.width > screen.width)
            win.width = screen.width;
        if (win.height > screen.height)
            win.height = screen.height;

        this.browserWindow.setBounds(win);
    }


    restorePosition() {
        const screenHash = WindowManager.getScreenSetupHash();
        const boundsSS = this.boundsByScreenSetup[screenHash];
        if (!boundsSS) return;
        const view = this.isMiniControlViewActive ? 'miniControlView' : 'normalView';
        const bounds = boundsSS[view];
        if (bounds) {
            this.browserWindow.setBounds(bounds);
        } else { 
            // ensure proper window-size to fix OS' window-bounds-cache 
            // restoring wrong bounds after screen-setup-change if setup was already
            // used before but in other mode
            // e.g. cur screensetup was used with normalView before and is now entered in minicontrolView
            // or cur screensetup was used with minicontrolview before is now entered in normalview

            let width = defaults.windowSize[view].width;
            let height = defaults.windowSize[view].height;
            // find existing valid setup for view
            const validSetupHash = Object.keys(this.boundsByScreenSetup).find((key) => this.boundsByScreenSetup[key][view]);
            if (validSetupHash) {
                width = this.boundsByScreenSetup[validSetupHash][view].width;
                height = this.boundsByScreenSetup[validSetupHash][view].height;
            }
            this.browserWindow.setSize(width, height);
        }
    }


    setAlwaysOnTop(alwaysOnTop) {
        if (alwaysOnTop) {
            if (electron.app.dock) // macOS
                electron.app.dock.hide();
            this.browserWindow.setAlwaysOnTop(true, 'floating', 99999);
            this.browserWindow.setVisibleOnAllWorkspaces(true);
            this.browserWindow.setFullScreenable(false);
            if (electron.app.dock) // macOS
                electron.app.dock.show();
        } else {
            this.browserWindow.setAlwaysOnTop(false, 'normal');
            this.browserWindow.setVisibleOnAllWorkspaces(false);
            this.browserWindow.setFullScreenable(true);
        }
    }


    setMiniControlViewActive(active) {
        if (active === this.isMiniControlViewActive)
            return; // no change => do nothing
        this.isMiniControlViewActive = active;

        let curBounds = this.browserWindow.getBounds();
        let nextBounds = null;
        let newMinimumSize = null;
        
        if (active) { // init mini-control-view
            this.browserWindow.setOpacity(.85);
            newMinimumSize = { 
                width: defaults.windowSize.miniControlView.minWidth, 
                height: defaults.windowSize.miniControlView.minHeight, 
            };
            nextBounds = { 
                x: curBounds.x, 
                y: curBounds.y, 
                width: defaults.windowSize.miniControlView.width, 
                height: defaults.windowSize.miniControlView.height, 
            };
            const miniControlViewBounds = this.boundsByScreenSetup[WindowManager.getScreenSetupHash()].miniControlView;
            if (miniControlViewBounds)
                nextBounds = miniControlViewBounds;
        } else { // return to normal/full - view
            this.browserWindow.setOpacity(1);
            newMinimumSize = { 
                width: defaults.windowSize.normalView.minWidth, 
                height: defaults.windowSize.normalView.minHeight, 
            };
            nextBounds = { 
                x: curBounds.x, 
                y: curBounds.y, 
                width: defaults.windowSize.normalView.width, 
                height: defaults.windowSize.normalView.height, 
            };
            const normalViewBounds = this.boundsByScreenSetup[WindowManager.getScreenSetupHash()].normalView;
            if (normalViewBounds)
                nextBounds = normalViewBounds;
        }

        const curScreen = WindowManager.getDisplayForBounds(curBounds);
        const nextScreen = WindowManager.getDisplayForBounds(nextBounds);
        // check if nextScreen is curScreen, if it differs
        // use current position and scale (bounds-)rect at midpoint
        if (curScreen.id !== nextScreen.id) {
            const moveDiffX = (nextBounds.width - curBounds.width) / 2;
            const moveDiffY = (nextBounds.height - curBounds.height) / 2;
            nextBounds.x = curBounds.x - moveDiffX;
            nextBounds.y = curBounds.y - moveDiffY;
        }

        this.browserWindow.setMinimumSize(newMinimumSize.width, newMinimumSize.height);
        this.browserWindow.setBounds(nextBounds);

        //this.ensureWindowIsInScreenBounds(); // called anyway by updateBounds() after move/resize event
    }


    updateBounds() {
        const screenHash = WindowManager.getScreenSetupHash();
        const curBounds = this.browserWindow.getBounds();
        if (!this.boundsByScreenSetup[screenHash])
            this.boundsByScreenSetup[screenHash] = {};
        if (this.isMiniControlViewActive)
            this.boundsByScreenSetup[screenHash].miniControlView = curBounds;
        else
            this.boundsByScreenSetup[screenHash].normalView = curBounds;
        this.ensureWindowIsInScreenBounds();
    }
}

module.exports = WindowManager;