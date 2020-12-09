import {createStore, createEvent} from 'effector';

export const chartInstanceStore = createStore({});
export const setChartInstance = createEvent();

chartInstanceStore.on(setChartInstance, function (state, instance) {
    if (typeof instance !== 'object') {
        return state;
    }

    return instance;
});
