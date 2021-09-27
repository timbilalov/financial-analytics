import { createStore, createEvent } from 'effector';
import { deepClone, isArraysSimilar } from '@helpers';
import type { TAssetData } from '@types';
import { LocalStorage } from '@utils';
import { STORAGE_KEYS } from '@constants';

type TUsdDataState = TAssetData;

const initialState = LocalStorage.get(STORAGE_KEYS.usdData) as TUsdDataState || [];

export const usdDataStore = createStore(initialState);
export const setUsdData = createEvent<TAssetData>();
export const resetUsdData = createEvent();

usdDataStore.watch((state) => {
    console.log('usdDataStore changed', deepClone(state))
    LocalStorage.set(STORAGE_KEYS.usdData, state);
});

usdDataStore.reset(resetUsdData);

usdDataStore.on(setUsdData, function (state: TUsdDataState, payload: TAssetData) {
    if (isArraysSimilar(state, payload)) {
        return state;
    }

    return payload;
});
