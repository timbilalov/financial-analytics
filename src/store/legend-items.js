import {createStore, createEvent} from 'effector';

export const legendItemsStore = createStore([]);
export const addLegendItem = createEvent();
export const clearLegendItems = createEvent();

legendItemsStore.on(addLegendItem, function (state, item) {
    if (typeof item !== 'string' || item.trim() === '' || state.includes(item) === true) {
        return state;
    }

    const newState = state.slice();
    newState.push(item);

    return newState;
});

legendItemsStore.on(clearLegendItems, function () {
    return [];
});
