// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getStoredData } from '@data';
import { resetUsdData, setUsdData, usdDataStore } from '@store';
import type { TAssetData, TAssetOptions, TStoreOptions } from '@types';
import { USD_TICKER } from '@constants';
import { moexDataRows } from '@test-constants';

declare const global: {
    fetch: unknown,
};

describe('get-stored-data', function () {
    const fetch = jest.fn(() =>
        Promise.resolve({
            ok: 1,
            json: () => Promise.resolve({
                'history': {
                    columns: ['BOARDID', 'TRADEDATE', 'SHORTNAME', 'SECID', 'OPEN', 'LOW', 'HIGH', 'CLOSE', 'NUMTRADES', 'VOLRUR', 'WAPRICE'],
                    data: [
                        moexDataRows[0],
                        moexDataRows[1],
                        moexDataRows[2],
                        moexDataRows[3],
                        moexDataRows[4],
                        moexDataRows[5],
                    ],
                },
                'history.cursor': {
                    columns: ['INDEX', 'TOTAL', 'PAGESIZE'],
                    data: [
                        [1, 2, 3],
                    ],
                },
            }),
        }),
    );

    global.fetch = fetch;

    const store = usdDataStore;
    const resetStore = resetUsdData;
    const setState = setUsdData;
    const ticker = USD_TICKER;

    const storeOptions: TStoreOptions = {
        store,
    };

    const assetOptions: TAssetOptions = {
        ticker,
    };

    const dates = [
        '2020.01.01',
        '2020.01.02',
        '2020.01.03',
        '2020.01.04',
        '2020.01.05',
    ];

    const expected: TAssetData = [
        {
            date: '2020.01.01',
            value: 70,
        },
        {
            date: '2020.01.02',
            value: 71,
        },
        {
            date: '2020.01.03',
            value: 72,
        },
        {
            date: '2020.01.04',
            value: 73,
        },
        {
            date: '2020.01.05',
            value: 74,
        },
    ];

    afterEach(function () {
        resetStore();
        fetch.mockClear();
    });

    it('should fetch new data, if store is empty', async function () {
        expect(store.getState()).toEqual([]);

        const actual = await getStoredData(dates, storeOptions, assetOptions);

        expect(actual).toEqual(expected);
        expect(store.getState()).toEqual(expected);
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('from=2020-01-01'));
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('till=2020-01-05'));
    });

    it('should not fetch new data, if store is not empty', async function () {
        setState(expected);

        const actual = await getStoredData(dates, storeOptions, assetOptions);

        expect(actual).toEqual(expected);
        expect(global.fetch).toHaveBeenCalledTimes(0);
    });

    describe('should fetch only part of data, if store contains another',  function () {
        it('case with a first part of data', async function () {
            const dataPart: TAssetData = [
                {
                    date: '2020.01.01',
                    value: 70,
                },
                {
                    date: '2020.01.02',
                    value: 71,
                },
            ];

            setState(dataPart);

            const actual = await getStoredData(dates, storeOptions, assetOptions);

            expect(actual).toEqual(expected);
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('from=2020-01-03'));
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('till=2020-01-05'));
        });

        it('case with a last part of data', async function () {
            const dataPart: TAssetData = [
                {
                    date: '2020.01.04',
                    value: 73,
                },
                {
                    date: '2020.01.05',
                    value: 74,
                },
            ];

            setState(dataPart);

            const actual = await getStoredData(dates, storeOptions, assetOptions);

            expect(actual).toEqual(expected);
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('from=2020-01-01'));
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('till=2020-01-03'));
        });

        it('case with a middle part of data', async function () {
            const dataPart: TAssetData = [
                {
                    date: '2020.01.02',
                    value: 71,
                },
                {
                    date: '2020.01.03',
                    value: 72,
                },
            ];

            setState(dataPart);

            const actual = await getStoredData(dates, storeOptions, assetOptions);

            expect(actual).toEqual(expected);
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('from=2020-01-01'));
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('till=2020-01-05'));
        });
    });

    describe('should handle right intersections of ranges',  function () {
        const expectedResultState = expected;

        it('case with a first part of data', async function () {
            const dataPart: TAssetData = [
                {
                    date: '2020.01.01',
                    value: 70,
                },
                {
                    date: '2020.01.02',
                    value: 71,
                },
            ];

            setState(dataPart);

            const dates = [
                '2020.01.02',
                '2020.01.03',
                '2020.01.04',
                '2020.01.05',
            ];

            const expected: TAssetData = [
                {
                    date: '2020.01.02',
                    value: 71,
                },
                {
                    date: '2020.01.03',
                    value: 72,
                },
                {
                    date: '2020.01.04',
                    value: 73,
                },
                {
                    date: '2020.01.05',
                    value: 74,
                },
            ];

            const actual = await getStoredData(dates, storeOptions, assetOptions);

            expect(actual).toEqual(expected);
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('from=2020-01-03'));
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('till=2020-01-05'));
            expect(store.getState()).toEqual(expectedResultState);
        });

        it('case with a last part of data', async function () {
            const dataPart: TAssetData = [
                {
                    date: '2020.01.04',
                    value: 73,
                },
                {
                    date: '2020.01.05',
                    value: 74,
                },
            ];

            setState(dataPart);

            const dates = [
                '2020.01.01',
                '2020.01.02',
                '2020.01.03',
                '2020.01.04',
            ];

            const expected: TAssetData = [
                {
                    date: '2020.01.01',
                    value: 70,
                },
                {
                    date: '2020.01.02',
                    value: 71,
                },
                {
                    date: '2020.01.03',
                    value: 72,
                },
                {
                    date: '2020.01.04',
                    value: 73,
                },
            ];

            const actual = await getStoredData(dates, storeOptions, assetOptions);

            expect(actual).toEqual(expected);
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('from=2020-01-01'));
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('till=2020-01-03'));
            expect(store.getState()).toEqual(expectedResultState);
        });
    });

    describe('should extrapolate dates to fetch',  function () {
        const expectedResultState = expected;

        it('case with forwards extrapolation', async function () {
            const dataPart: TAssetData = [
                {
                    date: '2020.01.04',
                    value: 73,
                },
                {
                    date: '2020.01.05',
                    value: 74,
                },
            ];

            setState(dataPart);

            const dates = [
                '2020.01.01',
                '2020.01.02',
            ];

            const expected: TAssetData = [
                {
                    date: '2020.01.01',
                    value: 70,
                },
                {
                    date: '2020.01.02',
                    value: 71,
                },
            ];

            const actual = await getStoredData(dates, storeOptions, assetOptions);

            expect(actual).toEqual(expected);
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('from=2020-01-01'));
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('till=2020-01-03'));
            expect(store.getState()).toEqual(expectedResultState);
        });

        it('case with backwards extrapolation', async function () {
            const dataPart: TAssetData = [
                {
                    date: '2020.01.01',
                    value: 70,
                },
                {
                    date: '2020.01.02',
                    value: 71,
                },
            ];

            setState(dataPart);

            const dates = [
                '2020.01.04',
                '2020.01.05',
            ];

            const expected: TAssetData = [
                {
                    date: '2020.01.04',
                    value: 73,
                },
                {
                    date: '2020.01.05',
                    value: 74,
                },
            ];

            const actual = await getStoredData(dates, storeOptions, assetOptions);

            expect(actual).toEqual(expected);
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('from=2020-01-03'));
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('till=2020-01-05'));
            expect(store.getState()).toEqual(expectedResultState);
        });
    });
});
