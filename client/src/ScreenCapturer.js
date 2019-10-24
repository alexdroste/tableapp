import { config } from './config';


export class ScreenCapturer {
    constructor() {
        if (!window.electron)
            console.error("ERROR: electron context missing");
        this._onScreenSetupChangedCallback = null;
    }


    _onScreenSetupChanged = () => {
        if (!this._onScreenSetupChangedCallback)
            return;
        this._onScreenSetupChangedCallback();
    }


    // call with null to unregister
    onScreenSetupChanged(cb) {
        if (this._onScreenSetupChangedCallback) {
            window.electron.remote.screen.removeListener("display-added", this._onScreenSetupChanged);
            window.electron.remote.screen.removeListener("display-removed", this._onScreenSetupChanged);
        }
        if (cb) {
            window.electron.remote.screen.on("display-added", this._onScreenSetupChanged);
            window.electron.remote.screen.on("display-removed", this._onScreenSetupChanged);
        } 
        this._onScreenSetupChangedCallback = cb;
    }


    async capture() {
        const options = {
            types: ['screen'],
            thumbnailSize: {
                width: config.desktopApp.screenshotMaxRes,
                height: config.desktopApp.screenshotMaxRes,
            },
        };


        return window.electron.desktopCapturer.getSources(options);
    }
}