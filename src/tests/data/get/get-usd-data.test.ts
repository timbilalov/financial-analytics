import { getUsdData } from '@data';
import { assets, moexDataRows } from '@test-constants';
import type { TFetchDataItemMoex } from '@types';

declare const global: {
    fetch: unknown,
};

describe('get-usd-data', function () {
    const responseDataRows = moexDataRows.map(item => ['CETS', ...item.slice(1)] as TFetchDataItemMoex);

    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: 1,
            json: () => Promise.resolve({
                'history': {
                    columns: ['BOARDID', 'TRADEDATE', 'SHORTNAME', 'SECID', 'OPEN', 'LOW', 'HIGH', 'CLOSE', 'NUMTRADES', 'VOLRUR', 'WAPRICE'],
                    data: [
                        responseDataRows[0],
                        responseDataRows[1],
                        responseDataRows[2],
                        responseDataRows[3],
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

    it('should return an array of values', async function () {
        const result = await getUsdData(assets);

        expect(result).toEqual([
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
        ]);
    });

    it('should cache fetch result', async function () {
        const result1 = await getUsdData(assets);
        const result2 = await getUsdData(assets);

        expect(result1).toEqual(result2);
        expect(global.fetch).toBeCalledTimes(1);
    });
});

