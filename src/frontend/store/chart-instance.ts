import { createStore, createEvent } from 'effector';
import type { TChartInstance } from '@types';

export type TChartStoreState = TChartInstance;

const initialState: TChartStoreState = {
    update: () => {
        // do nothing
    },
    config: {
        data: {
            datasets: [],
        },
    },
};

export const chartInstanceStore = createStore(initialState);
export const setChartInstance = createEvent<TChartInstance>();
export const resetChartInstance = createEvent();

chartInstanceStore.on(setChartInstance, function (state: TChartStoreState, payload: TChartInstance) {
    return payload;
});

chartInstanceStore.reset(resetChartInstance);
