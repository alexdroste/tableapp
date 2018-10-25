export class WebFrameScaler {
    constructor() {
        if (!window.electron)
            console.error("ERROR: electron context missing");
    }


    getZoomLevel() {
        return window.electron.webFrame.getZoomFactor();
    }


    setZoomLevel(factor) {
        window.electron.webFrame.setZoomFactor(factor);
    }
}