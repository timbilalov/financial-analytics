import {datesStore, setDatesFullArray} from "@store";

describe('dates store', function () {
    test('store should exist', function () {
        const state = datesStore.getState();

        expect(Array.isArray(state)).toEqual(true);
    });

    describe('setDatesFullArray', function () {
        test('should return current state when pass wrong argument', function () {
            const prevState = datesStore.getState();

            setDatesFullArray();
            const newState = datesStore.getState();

            expect(newState).toEqual(prevState);
        });

        test('should set an array of dates', function () {
            const newValues = [
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
