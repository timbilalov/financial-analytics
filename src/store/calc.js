import {createStore, createEvent} from 'effector';
import LocalStorage from "@utils/local-storage";
import {CALC_CURRENCIES, CALC_METHODS, POSSIBLE_USES, STORAGE_KEYS} from "@constants";
import {deepClone, isObjectsEqual} from "@helpers";

const defaultState = {
    method: CALC_METHODS.RELATIVE,
    currency: CALC_CURRENCIES.RUB,
    uses: {
        taxes: true,
    },
};
const initialState = Object.assign({}, defaultState, LocalStorage.get(STORAGE_KEYS.calc));

export const calcStore = createStore(initialState);
export const setCalcMethod = createEvent();
export const setCurrency = createEvent();
export const setCalcUses = createEvent();

calcStore.watch(function (state) {
    console.log('calcStore changed', deepClone(state))
    LocalStorage.set(STORAGE_KEYS.calc, state);
});

calcStore.on(setCalcMethod, function (state, method) {
    if (typeof method !== 'string' || method.trim() === '' || state.method === method || Object.values(CALC_METHODS).includes(method) === false) {
        return state;
    }

    const newState = deepClone(state);
    newState.method = method;

    return newState;
});

calcStore.on(setCurrency, function (state, currency) {
    if (typeof currency !== 'string' || currency.trim() === '' || state.currency === currency || Object.values(CALC_CURRENCIES).includes(currency) === false) {
        return state;
    }

    const newState = deepClone(state);
    newState.currency = currency;

    return newState;
});

calcStore.on(setCalcUses, function (state, use) {
    if (typeof use === undefined) {
        return state;
    }

    const uses = deepClone(state.uses);

    let shouldUpdate = true;

    for (const prop in use) {
        if (!POSSIBLE_USES.includes(prop)) {
            shouldUpdate = false;
            break;
        }

        uses[prop] = use[prop];
    }

    if (isObjectsEqual(uses, state.uses)) {
        shouldUpdate = false;
    }

    if (shouldUpdate === false) {
        return state;
    }

    const newState = deepClone(state);
    newState.uses = uses;

    return newState;
});
