/**
 * Load saved state from localStorage.
 * @function
 * @returns {(object|undefined)} previously saved state
 */
export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};


/**
 * Saves state (or part of state) in localStorage.
 * @function
 * @param {object} state state or part of state to save in localStorage
 */
export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch (err) {
        console.error('saving app-state in localStorage failed');
    }
};
