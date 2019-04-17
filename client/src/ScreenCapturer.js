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
            window.electron.screen.removeListener("display-added", this._onScreenSetupChanged);
            window.electron.screen.removeListener("display-removed", this._onScreenSetupChanged);
        }
        if (cb) {
            window.electron.screen.on("display-added", this._onScreenSetupChanged);
            window.electron.screen.on("display-removed", this._onScreenSetupChanged);
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

        return new Promise((resolve, reject) => {
            window.electron.desktopCapturer.getSources(options, (err, sources) => {
                if (err)
                    reject(err);
                const primaryId = 'screen:' + window.electron.screen.getPrimaryDisplay().id;
                for (let s of sources) {
                    s.isPrimary = s.id === primaryId;
                }
                resolve(sources);
            });
        });
    }
}