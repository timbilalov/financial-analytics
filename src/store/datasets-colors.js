import {createStore, createEvent} from 'effector';
import {deepClone} from "@helpers";

export const datasetsColorsStore = createStore({});
export const addDatasetColor = createEvent();

// TEMP
datasetsColorsStore.watch(function (state) {
    console.log('datasetsColorsStore changed', state)
});

datasetsColorsStore.on(addDatasetColor, function (state, data) {
    if (typeof data !== 'object') {
        return state;
    }

    const {title, color} = data;

    if (typeof title !== 'string' || title.trim() === '' || state[title] !== undefined || Array.isArray(color) === false) {
        return state;
    }

    const newState = deepClone(state);
    newState[title] = color;

    return newState;
});
