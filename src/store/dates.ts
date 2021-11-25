import { createStore, createEvent } from 'effector';
import type { TDate } from '@types';

type TDatesFullArrayStore = TDate[];

const initialState: TDatesFullArrayStore = [];

export const datesStore = createStore(initialState);
export const setDatesFullArray = createEvent<TDate[]>();

datesStore.on(setDatesFullArray,  (state: TDatesFullArrayStore, payload: TDate[]) => {
    return payload;
});
