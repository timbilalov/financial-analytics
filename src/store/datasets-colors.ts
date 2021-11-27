import { createStore, createEvent } from 'effector';
import { deepClone, isEmptyString } from '@helpers';
import type { TColorRBG } from '@types';

export type TColorsStoreItem = {
    title: string,
    color: TColorRBG,
};

export type TColorsStoreState = {
    [key: string]: TColorsStoreItem['color'],
};

const defaultState: TColorsStoreState = {};

export const datasetsColorsStore = createStore(defaultState);
export const addDatasetColor = createEvent<TColorsStoreItem>();

datasetsColorsStore.on(addDatasetColor, function (state: TColorsStoreState, payload: TColorsStoreItem) {
    const { title, color } = payload;

    if (isEmptyString(title) || state[title] !== undefined) {
        return state;
    }

    const newState = deepClone(state);
    newState[title] = color;

    return newState;
});
