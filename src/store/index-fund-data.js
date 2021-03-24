import {createStore, createEvent} from 'effector';
import {isArraysSimilar} from "@helpers";

export const indexFundDataStore = createStore([]);
export const setIndexFundData = createEvent();

indexFundDataStore.on(setIndexFundData, function (state, indexFundData) {
    if (Array.isArray(indexFundData) === false || isArraysSimilar(state, indexFundData) === true) {
        return state;
    }

    return indexFundData;
});
