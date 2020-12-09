import {createStore, createEvent} from 'effector';
import {isArraysSimilar} from "@helpers";

export const datesStore = createStore([]);
export const setDatesFullArray = createEvent();

datesStore.on(setDatesFullArray, function (state, datesFullArray) {
    if (Array.isArray(datesFullArray) === false || isArraysSimilar(state, datesFullArray) === true) {
        return state;
    }

    return datesFullArray;
});
