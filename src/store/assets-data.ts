import {createStore, createEvent} from 'effector';
import {deepClone, isArraysSimilar, isObjectsEqual} from "@helpers";
import type {TAssetData} from "@types";
import {LocalStorage} from "@utils";
import {STORAGE_KEYS} from "@constants";

type TAssetsDataState = {
    [key: string]: TAssetData,
};

const initialState = LocalStorage.get(STORAGE_KEYS.assetsData) as TAssetsDataState || {};

export const assetsDataStore = createStore(initialState);
export const setAssetsData = createEvent<TAssetsDataState>();
export const resetAssetsData = createEvent();

assetsDataStore.watch((state) => {
    console.log('assetsDataStore changed', deepClone(state));
    LocalStorage.set(STORAGE_KEYS.assetsData, state);
    LocalStorage.logSize();
});

assetsDataStore.reset(resetAssetsData);

assetsDataStore.on(setAssetsData, function (state: TAssetsDataState, payload: TAssetsDataState) {
    if (isObjectsEqual(state, payload)) {
        return state;
    }

    const newState = deepClone(state);

    for (const ticker in payload) {
        if (!payload.hasOwnProperty(ticker)) {
            continue;
        }

        newState[ticker] = payload[ticker];
    }

    return newState;
});
