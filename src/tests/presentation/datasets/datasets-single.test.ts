import { prepareSingleDataset } from '@presentation';
import { assetBase, calcOptionsDefault, dates } from '@test-constants';
import { BANK_DEPOSIT_LABEL, OWN_MONEY_LABEL, TOTAL_LABEL } from '@constants';
import { extendObject } from '@helpers';
import type { TDataset } from '@types';

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

    test('should return an object with data', async function () {
        const result = await prepareSingleDataset(assetBase, calcOptionsDefault, dates);

        expect(result).toEqual({
            asset: {
                ticker: expect.any(String),
                amount: expect.any(Number),
                isUsd: expect.any(Boolean),
                buyDate: expect.any(String),
                data: expect.any(Array),
            },
            label: expect.any(String),
            backgroundColor: expect.any(String),
            borderColor: expect.any(String),
            data: expect.any(Array),
            dataAbsTotal: expect.any(Array),
            dates: expect.any(Array),
            type: 'line',
            pointRadius: expect.any(Number),
            showLine: expect.any(Boolean),
            fill: false,
            lineTension: 0,
            borderWidth: expect.any(Number),
        });
    });

    test('should return an object with same data for common labeled items', async function () {
        const values = [
            baseData[0].value,
            baseData[1].value,
            NaN,
            NaN,
            NaN,
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

        const result1 = await prepareSingleDataset(assetTotal, calcOptionsDefault, dates) as TDataset;
        const result2 = await prepareSingleDataset(assetOwnMoney, calcOptionsDefault, dates) as TDataset;
        const result3 = await prepareSingleDataset(assetBankDepo, calcOptionsDefault, dates) as TDataset;

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

        const result = await prepareSingleDataset(asset, calcOptionsDefault, dates) as TDataset;

        expect(result.data.length).toBe(dates.length);
        expect(result.data[0]).toBe(NaN);
        expect(result.data[1]).not.toBe(NaN);
        expect(result.data[2]).not.toBe(NaN);
        expect(result.data[3]).toBe(NaN);
        expect(result.data[4]).toBe(NaN);
        expect(result.data[5]).toBe(NaN);
        expect(result.data[6]).toBe(NaN);
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

        const result = await prepareSingleDataset(asset, calcOptionsDefault, dates) as TDataset;

        expect(result.data.length).toBe(dates.length);
        expect(result.data[0]).not.toBe(NaN);
        expect(result.data[1]).not.toBe(NaN);
        expect(result.data[2]).not.toBe(NaN);
        expect(result.data[3]).not.toBe(NaN);
        expect(result.data[2]).toEqual(result.data[1]);
        expect(result.data[4]).toBe(NaN);
        expect(result.data[5]).toBe(NaN);
        expect(result.data[6]).toBe(NaN);
    });
});
