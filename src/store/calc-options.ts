import { createStore, createEvent } from 'effector';
import { LocalStorage } from '@utils';
import { CALC_CURRENCIES, CALC_METHODS, STORAGE_KEYS } from '@constants';
import { deepClone, isObjectsEqual } from '@helpers';
import type { TCalcOptions, TCalcUses } from '@types';

const defaultState: TCalcOptions = {
    method: CALC_METHODS.ABSOLUTE_TOTAL,
    currency: CALC_CURRENCIES.RUB,
    uses: {
        taxes: true,
    },
};
const initialState: TCalcOptions = Object.assign({}, defaultState, LocalStorage.get(STORAGE_KEYS.calc));

export const calcOptionsStore = createStore(initialState);
export const resetCalcOptionsStore = createEvent();
export const setCalcMethod = createEvent<CALC_METHODS>();
export const setCurrency = createEvent<CALC_CURRENCIES>();
export const setCalcUses = createEvent<TCalcUses>();

calcOptionsStore.watch(function (state) {
    console.log('calcOptionsStore changed', deepClone(state))
    LocalStorage.set(STORAGE_KEYS.calc, state);
});

calcOptionsStore.reset(resetCalcOptionsStore);

calcOptionsStore.on(setCalcMethod,  (state: TCalcOptions, payload: CALC_METHODS) => {
    if (state.method === payload) {
        return state;
    }

    const newState = deepClone(state);
    newState.method = payload;

    return newState;
});

calcOptionsStore.on(setCurrency,  (state: TCalcOptions, payload: CALC_CURRENCIES) => {
    if (state.currency === payload) {
        return state;
    }

    const newState = deepClone(state);
    newState.currency = payload;

    return newState;
});

calcOptionsStore.on(setCalcUses, function (state: TCalcOptions, payload: TCalcUses) {
    if (isObjectsEqual(payload, state.uses)) {
        return state;
    }

    const newState = deepClone(state);
    newState.uses = payload;

    return newState;
});
