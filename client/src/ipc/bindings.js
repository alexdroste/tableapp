import * as desktopAppActions from '../actions/desktopApp';


/**
 * Sets up listeners & handlers for events from the electron main process.
 * Look at implementation for further info.
 * @function
 * @param {IpcHandler} ipc IpcHandler instance 
 * @param {dispatchAction} dispatch function to dispatch an action to the store
 */
export const setupListeners = (ipc, dispatch) => {
    // const _handleBroadcastCancelled = () => {
    //     dispatch(desktopAppActions.broadcastCancelled());
    // };

    // const _handleNewBroadcastImage = (e, data) => {
    //     dispatch(desktopAppActions.broadcastNewImage(data));
    // };

    const _handleToggleMiniControlView = () => {
        dispatch(desktopAppActions.toggleMiniControlView());
    };


    // ipc.on('broadcastCancelled', _handleBroadcastCancelled);

    // ipc.on('newBroadcastImage', _handleNewBroadcastImage);

    ipc.on('toggleMiniControlView', _handleToggleMiniControlView);
};