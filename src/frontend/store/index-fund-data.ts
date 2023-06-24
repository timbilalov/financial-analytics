import { createStore, createEvent } from 'effector';
import { deepClone } from '@helpers';
import type { TAssetData } from '@types';
import { LocalStorage } from '@utils';
import { STORAGE_KEYS } from '@constants';

type TIndexFundState = TAssetData;

const initialState = LocalStorage.get(STORAGE_KEYS.indexFund) as TIndexFundState || [];

export const indexFundDataStore = createStore(initialState);
export const setIndexFundData = createEvent<TAssetData>();
export const resetIndexFundData = createEvent();

indexFundDataStore.watch((state) => {
    console.log('indexFundDataStore changed', deepClone(state))
    LocalStorage.set(STORAGE_KEYS.indexFund, state);
});

indexFundDataStore.reset(resetIndexFundData);

indexFundDataStore.on(setIndexFundData,  (state: TIndexFundState, payload: TAssetData) => {
    return payload;
});
