import { createStore, createEvent } from 'effector';
import { isEmptyString } from '@helpers';

type TLegendItemStore = string[];

const initialState: TLegendItemStore = [];

export const legendItemsStore = createStore(initialState);
export const addLegendItem = createEvent<string>();
export const clearLegendItems = createEvent();

legendItemsStore.on(addLegendItem, (state: TLegendItemStore, payload: string) => {
    if (isEmptyString(payload) || state.includes(payload)) {
        return state;
    }

    const newState = state.slice();
    newState.push(payload);

    return newState;
});

legendItemsStore.reset(clearLegendItems);
