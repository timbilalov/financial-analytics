import { assetsDataStore, setAssetsData, resetAssetsData } from '@store';
import type { TAssetData } from '@types';
import { deepClone, isObject } from '@helpers';

type TAssetsDataState = {
    [key: string]: TAssetData,
};

describe('asset-data store', function () {
    test('store should exist', function () {
        const state = assetsDataStore.getState();

        expect(isObject(state)).toEqual(true);
    });

    beforeEach(function () {
        resetAssetsData();
    });

    describe('setAssetsData', function () {
        const assetsData: TAssetData = [
            {
                date: '2020.01.01',
                value: 100,
            },
        ];
        const newValues: TAssetsDataState = {
            ticker: assetsData,
        };

        test('should set an assets object', function () {
            setAssetsData(newValues);
            const newState = assetsDataStore.getState();

            expect(newState).toEqual(newValues);
        });

        test('should return current state if the same object passed', function () {
            const newValues2 = deepClone(newValues);

            setAssetsData(newValues);
            const newState1 = assetsDataStore.getState();

            setAssetsData(newValues2);
            const newState2 = assetsDataStore.getState();

            expect(newState2).toBe(newState1);
        });
    });
});
