import {createStore, createEvent} from 'effector';

export const chartInstanceStore = createStore({});
export const setChartInstance = createEvent();
export const resetChartInstance = createEvent();

chartInstanceStore.on(setChartInstance, function (state, instance) {
    if (typeof instance !== 'object') {
        return state;
    }

    return instance;
});

chartInstanceStore.reset(resetChartInstance);
