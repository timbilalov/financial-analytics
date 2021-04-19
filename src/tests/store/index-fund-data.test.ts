import {setIndexFundData, indexFundDataStore} from "@store";
import type {TAssetData} from "@types";

describe('index-fund-data store', function () {
    test('store should exist', function () {
        const state = indexFundDataStore.getState();

        expect(Array.isArray(state)).toEqual(true);
    });

    describe('setIndexFundData', function () {
        test('should set an array of values', function () {
            const newValues: TAssetData = [
                {
                    date: '2020.01.01',
                    value: 150,
                },
                {
                    date: '2020.01.02',
                    value: 151,
                },
            ];

            setIndexFundData(newValues);
            const newState = indexFundDataStore.getState();

            expect(newState).toEqual(newValues);
        });
    });
});
