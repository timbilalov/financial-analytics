import { resetUsdData, setUsdData, usdDataStore } from '@store';
import type { TAssetData } from '@types';

describe('usd-data store', function () {
    beforeEach(function () {
        resetUsdData();
    });

    test('store should exist', function () {
        const state = usdDataStore.getState();

        expect(Array.isArray(state)).toEqual(true);
    });

    describe('setUsdData', function () {
        const newValues: TAssetData = [
            {
                date: '2020.01.01',
                values: {
                    current: 50,
                },
            },
            {
                date: '2020.01.02',
                values: {
                    current: 51,
                },
            },
        ];

        test('should set an array of values', function () {
            setUsdData(newValues);
            const newState = usdDataStore.getState();

            expect(newState).toEqual(newValues);
        });

        test('should return current state, if same array passed', function () {
            setUsdData(newValues);
            const newState1 = usdDataStore.getState();

            setUsdData(newValues);
            const newState2 = usdDataStore.getState();

            expect(newState2).toBe(newState1);
        });
    });
});
