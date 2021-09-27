import { calcOwnMoney } from '@data';
import { datasets, dates, moexDataRowsUsd } from '@test-constants';
import { CALC_CURRENCIES, CALC_METHODS } from '@constants';
import { deepClone } from '@helpers';
import type { TCalcOptions } from '@types';

declare const global: {
    fetch: unknown,
};

describe('calc-own-money', function () {
    const datasetsUsd = deepClone(datasets);
    datasetsUsd.forEach(item => item.isUsd = true);

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

    const calcOptionsBase: TCalcOptions = {
        method: CALC_METHODS.ABSOLUTE_TOTAL,
        currency: CALC_CURRENCIES.RUB,
        uses: {
            taxes: false,
        },
    };

    test('should return an empty array for methods other than absolute-total', async function () {
        const calcOptions1: TCalcOptions = Object.assign({}, calcOptionsBase, {
            method: CALC_METHODS.RELATIVE,
        });
        const calcOptions2: TCalcOptions = Object.assign({}, calcOptionsBase, {
            method: CALC_METHODS.RELATIVE_ANNUAL,
        });
        const calcOptions3: TCalcOptions = Object.assign({}, calcOptionsBase, {
            method: CALC_METHODS.ABSOLUTE,
        });

        const result1 = await calcOwnMoney(datasets, calcOptions1);
        const result2 = await calcOwnMoney(datasets, calcOptions2);
        const result3 = await calcOwnMoney(datasets, calcOptions3);

        expect(result1).toEqual([]);
        expect(result2).toEqual([]);
        expect(result3).toEqual([]);
    });

    describe('should return an array of values', function () {
        test('rub', async function () {
            const calcOptions = calcOptionsBase;
            const result1 = await calcOwnMoney(datasets, calcOptions);
            const result2 = await calcOwnMoney(datasetsUsd, calcOptions);

            expect(result1).toEqual(result2);
            expect(result1).toEqual([
                {
                    value: 100, // 100 + 0
                    date: dates[0],
                },
                {
                    value: 150, // 100 + 50
                    date: dates[1],
                },
                {
                    value: 150, // 100 + 50
                    date: dates[2],
                },
                {
                    value: 150, // 100 + 50
                    date: dates[3],
                },
            ]);
        });

        test('usd', async function () {
            const calcOptions: TCalcOptions = Object.assign({}, calcOptionsBase, {
                currency: CALC_CURRENCIES.USD,
            });
            const result1 = await calcOwnMoney(datasets, calcOptions);
            const result2 = await calcOwnMoney(datasetsUsd, calcOptions);

            expect(result1).toEqual(result2);
            expect(result1).toEqual([
                {
                    value: 100, // 100 / 70 * 70
                    date: dates[0],
                },
                {
                    value: 148.5915, // 100 / 71 * 70 + 50 / 71 * 71
                    date: dates[1],
                },
                {
                    value: 146.5278, // 100 / 72 * 70 + 50 / 72 * 71
                    date: dates[2],
                },
                {
                    value: 144.5205, // 100 / 73 * 70 + 50 / 73 * 71
                    date: dates[3],
                },
            ]);
        });
    });
});
