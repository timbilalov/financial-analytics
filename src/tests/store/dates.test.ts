import { datesStore, setDatesFullArray } from '@store';
import type { TDate } from '@types';

describe('dates store', function () {
    test('store should exist', function () {
        const state = datesStore.getState();

        expect(Array.isArray(state)).toEqual(true);
    });

    describe('setDatesFullArray', function () {
        test('should set an array of dates', function () {
            const newValues: TDate[] = [
                '2020.01.01',
                '2020.01.02',
                '2020.01.03',
            ];

            setDatesFullArray(newValues);
            const newState = datesStore.getState();

            expect(newState).toEqual(newValues);
        });
    });
});
