import { prepareSingleDataset } from '@presentation';
import { assetBase, calcOptionsDefault, dates, moexDataRowsUsd } from '@test-constants';
import { BANK_DEPOSIT_LABEL, OWN_MONEY_LABEL, TOTAL_LABEL } from '@constants';
import { extendObject } from '@helpers';

declare const global: {
    fetch: unknown,
};

describe('datasets-single', function () {
    const baseData = [
        {
            date: dates[0],
            value: 10,
        },
        {
            date: dates[1],
            value: 20,
        },
    ];

    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: 1,
            json: () => Promise.resolve({
                'history': {
                    columns: ['BOARDID', 'TRADEDATE', 'SHORTNAME', 'SECID', 'OPEN', 'LOW', 'HIGH', 'CLOSE', 'NUMTRADES', 'VOLRUR', 'WAPRICE'],
                    data: [
                        moexDataRowsUsd[0],
                        moexDataRowsUsd[1],
                        moexDataRowsUsd[2],
                        moexDataRowsUsd[3],
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

    test('should return an object with data', async function () {
        const result = await prepareSingleDataset(assetBase, calcOptionsDefault, dates);

        expect(result).toEqual({
            ticker: expect.any(String),
            label: expect.any(String),
            backgroundColor: expect.any(String),
            borderColor: expect.any(String),
            data: expect.any(Array),
            dataAbsTotal: expect.any(Array),
            dates: expect.any(Array),
            type: 'line',
            pointRadius: expect.any(Number),
            fill: false,
            lineTension: 0,
            borderWidth: expect.any(Number),
            amount: expect.any(Number),
            isUsd: expect.any(Boolean),
        });
    });

    test('should return an object with same data for common labeled items', async function () {
        const values = [
            baseData[0].value,
            baseData[1].value,
            NaN,
            NaN,
        ];
        const data = [
            {
                date: dates[0],
                value: values[0],
            },
            {
                date: dates[1],
                value: values[1],
            },
            {
                date: dates[2],
                value: values[2],
            },
            {
                date: dates[3],
                value: values[3],
            },
        ];

        const assetTotal = extendObject(assetBase, {
            title: TOTAL_LABEL,
            data,
        });
        const assetOwnMoney = extendObject(assetBase, {
            title: OWN_MONEY_LABEL,
            data,
        });
        const assetBankDepo = extendObject(assetBase, {
            title: BANK_DEPOSIT_LABEL,
            data,
        });

        const result1 = await prepareSingleDataset(assetTotal, calcOptionsDefault, dates);
        const result2 = await prepareSingleDataset(assetOwnMoney, calcOptionsDefault, dates);
        const result3 = await prepareSingleDataset(assetBankDepo, calcOptionsDefault, dates);

        expect(result1.data).toEqual(values);
        expect(result2.data).toEqual(values);
        expect(result3.data).toEqual(values);
    });

    test('should fill empty values (by date) with NaN', async function () {
        const asset = extendObject(assetBase, {
            data: [
                {
                    date: dates[1],
                    value: 100,
                },
                {
                    date: dates[2],
                    value: 200,
                },
            ],
        });

        const result = await prepareSingleDataset(asset, calcOptionsDefault, dates);

        expect(result.data.length).toBe(4);
        expect(result.data[0]).toBe(NaN);
        expect(result.data[1]).not.toBe(NaN);
        expect(result.data[2]).not.toBe(NaN);
        expect(result.data[3]).toBe(NaN);
    });

    test('should use previous values if some data missed', async function () {
        const asset = extendObject(assetBase, {
            data: [
                {
                    date: dates[0],
                    value: 0,
                },
                {
                    date: dates[1],
                    value: 1,
                },
                {
                    date: dates[3],
                    value: 3,
                },
            ],
        });

        const result = await prepareSingleDataset(asset, calcOptionsDefault, dates);

        expect(result.data.length).toBe(4);
        expect(result.data[0]).not.toBe(NaN);
        expect(result.data[1]).not.toBe(NaN);
        expect(result.data[2]).not.toBe(NaN);
        expect(result.data[3]).not.toBe(NaN);
        expect(result.data[2]).toEqual(result.data[1]);
    });
});
