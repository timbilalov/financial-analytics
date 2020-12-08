import {createStore, createEvent} from 'effector';

export const chartInstanceStore = createStore({});
export const setChartInstance = createEvent();

// TEMP
chartInstanceStore.watch(function (state) {
    console.log('chartInstanceStore changed', state)
});
window.chartInstanceStore = chartInstanceStore;

chartInstanceStore.on(setChartInstance, function (state, instance) {
    if (typeof instance !== 'object') {
        return state;
    }

    return instance;
});
