import {setUsdData, usdDataStore} from "@store";

describe('usd-data store', function () {
    test('store should exist', function () {
        const state = usdDataStore.getState();

        expect(Array.isArray(state)).toEqual(true);
    });

    describe('setUsdData', function () {
        test('should return current state when pass wrong argument', function () {
            const prevState = usdDataStore.getState();

            setUsdData();
            const newState = usdDataStore.getState();

            expect(newState).toEqual(prevState);
        });

        test('should set an array of values', function () {
            const newValues = [
                {
                    date: '2020.01.01',
                    value: 50,
                },
                {
                    date: '2020.01.02',
                    value: 51,
                },
            ];

            setUsdData(newValues);
            const newState = usdDataStore.getState();

            expect(newState).toEqual(newValues);
        });
    });
});
