

export class DynamicRowsCache {
    constructor() {
        this._idOrder = [];
        this._heightsById = {};

        this._onHeightChangedCallback = null;
    }

    // events

    _onHeightChanged = (id, diff) => {
        if (!this._onHeightChangedCallback)
            return;
        const index = this._idOrder.indexOf(id); // -1 if not found
        // console.log('height changed', index, id, diff);
        this._onHeightChangedCallback(index, id, diff);
    };


    onHeightChanged = (cb) => {
        this._onHeightChangedCallback = cb;
    };


    // methods 
    
    getHeightById = (id) => {
        if (this._heightsById.hasOwnProperty(id))
            return this._heightsById[id];
        return 0; // default value
    };


    getHeightByIndexObj = ({ index }) => {
        const id = this._idOrder[index];
        return this.getHeightById(id);
    };


    setIdOrder = (arr) => {
        this._idOrder = arr;
    };


    setHeightForId = (id, height) => {
        if (this._heightsById[id] === height)
            return;
        const lastHeight = this._heightsById[id];
        const diff = height - (typeof lastHeight === 'number' ? lastHeight : 0);
        this._heightsById[id] = height;
        this._onHeightChanged(id, diff);
        // TODO calc diff
    };
}
