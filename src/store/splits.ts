import {createStore, createEvent} from 'effector';
import {LocalStorage} from "@utils";
import {STORAGE_KEYS} from "@constants";
import {deepClone, isObject, isObjectsEqual} from "@helpers";
import type {TSplitItem, TSplits} from "@types";

type TSplitsStoreState = TSplits & {
    length?: number,
};

const initialState: TSplitsStoreState = LocalStorage.get(STORAGE_KEYS.splits) as TSplits || {};

export const splitsStore = createStore(initialState);
export const resetSplitsStore = createEvent();
export const addNewSplit = createEvent<TSplitItem>();
export const removeSplit = createEvent<TSplitItem>();
export const setSplits = createEvent<TSplitItem[]>();

splitsStore.watch(function (state) {
    const lengthProperty = Object.getOwnPropertyDescriptor(state, 'length');

    // TODO: Сейчас это свойство добавляется всегда. Подумать, как лучше сделать так, чтобы оно наследовалось при изменении state.
    if (lengthProperty === undefined || lengthProperty.get === undefined) {
        Object.defineProperty(state, 'length', {
            enumerable: false,
            get: function() {
                let splitsCount = 0;

                for (const ticker in this) {
                    if (!this.hasOwnProperty(ticker)) {
                        continue;
                    }

                    const tickerData = state[ticker] || [];
                    splitsCount += tickerData.length;
                }

                return splitsCount;
            },
        });
    }

    console.log('splitsStore changed', state.length, state)
    LocalStorage.set(STORAGE_KEYS.splits, state);
});

splitsStore.reset(resetSplitsStore);

splitsStore.on(addNewSplit, function (state: TSplitsStoreState, payload: TSplitItem) {
    if (!payload.ticker) {
        return state;
    }

    const newState = deepClone(state);
    const {ticker, ...rest} = payload;
    const tickerData = newState[ticker] || [];
    const dataToAdd = {...rest};

    if (tickerData.find(item => isObjectsEqual(item, dataToAdd)) !== undefined) {
        return state;
    }

    tickerData.push(dataToAdd);
    newState[ticker] = tickerData;

    return newState;
});

splitsStore.on(removeSplit, function (state: TSplitsStoreState, payload: TSplitItem) {
    if (!payload.ticker) {
        return state;
    }

    const newState = deepClone(state);
    const {ticker, ...rest} = payload;
    const tickerData = newState[ticker] || [];
    const dataToAdd = {...rest};
    let index = -1;

    for (let i = 0; i < tickerData.length; i++) {
        const item = tickerData[i];
        if (isObjectsEqual(item, dataToAdd)) {
            index = i;
            break;
        }
    }

    if (index === -1) {
        return state;
    }

    tickerData.splice(index, 1);

    if (tickerData.length === 0) {
        delete newState[ticker];
    } else {
        newState[ticker] = tickerData;
    }

    return newState;
});

splitsStore.on(setSplits, function (state: TSplitsStoreState, payload: TSplitItem[]) {
    const newState = {};

    payload.forEach(splitData => {
        const {ticker, ...rest} = splitData;

        if (!ticker) {
            return;
        }

        const tickerData = newState[ticker] || [];
        const dataToAdd = {...rest};

        if (tickerData.find(item => isObjectsEqual(item, dataToAdd)) !== undefined) {
            return;
        }

        tickerData.push(dataToAdd);
        newState[ticker] = tickerData;
    });

    return newState;
});
