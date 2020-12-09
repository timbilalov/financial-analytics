import {createStore, createEvent} from 'effector';
import {isArraysSimilar} from "@helpers";

export const usdDataStore = createStore([]);
export const setUsdData = createEvent();

usdDataStore.on(setUsdData, function (state, usdData) {
    if (Array.isArray(usdData) === false || isArraysSimilar(state, usdData) === true) {
        return state;
    }

    return usdData;
});
