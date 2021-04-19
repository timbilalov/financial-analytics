import {calcBankDeposit} from "@data";
import {calcOptionsDefault, datasets, dates, moexDataRows, moexDataRowsUsd, options, usdData} from "@test-constants";
import {CALC_CURRENCIES, CALC_METHODS} from "@constants";
import {extendObject} from "@helpers";

declare const global: {
    fetch: unknown,
};

describe('calc-bank-deposit', function () {
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
        })
    );

    describe('rub currency', function () {
        test('relative method', async function () {
            expect(await calcBankDeposit(datasets, calcOptionsDefault)).toMatchObject([
                {
                    value: 0,
                    date: dates[0],
                },
                {
                    value: 0.0137, // 5 / 365 * 1
                    date: dates[1],
                },
                {
                    value: 0.0411, // 5 / 365 * 2 + 5 / 365 * 1
                    date: dates[2],
                },
                {
                    value: 0.0685, // 5 / 365 * 3 + 5 / 365 * 2
                    date: dates[3],
                },
            ]);
        });

        test('relative-annual method', async function () {
            const calcOptions = extendObject(calcOptionsDefault, {
                method: CALC_METHODS.RELATIVE_ANNUAL,
            });

            expect(await calcBankDeposit(datasets, calcOptions)).toMatchObject([
                {
                    value: 0,
                    date: dates[0],
                },
                {
                    value: 0.0137, // 5 / 365 * 1
                    date: dates[1],
                },
                {
                    value: 0.0274, // 5 / 365 * 2
                    date: dates[2],
                },
                {
                    value: 0.0411, // 5 / 365 * 3
                    date: dates[3],
                },
            ]);
        });

        test('absolute method', async function () {
            const calcOptions = extendObject(calcOptionsDefault, {
                method: CALC_METHODS.ABSOLUTE,
            });

            expect(await calcBankDeposit(datasets, calcOptions)).toMatchObject([
                {
                    value: 0,
                    date: dates[0],
                },
                {
                    value: 0.0137, // 100 * 0.05 / 365 * 1
                    date: dates[1],
                },
                {
                    value: 0.0342, // 100 * 0.05 / 365 * 2 + 50 * 0.05 / 365 * 1
                    date: dates[2],
                },
                {
                    value: 0.0548, // 100 * 0.05 / 365 * 3 + 50 * 0.05 / 365 * 2
                    date: dates[3],
                },
            ]);
        });

        test('absolute-total method', async function () {
            const calcOptions = extendObject(calcOptionsDefault, {
                method: CALC_METHODS.ABSOLUTE_TOTAL,
            });

            expect(await calcBankDeposit(datasets, calcOptions)).toMatchObject([
                {
                    value: 100,
                    date: dates[0],
                },
                {
                    value: 150.0137, // 100 + 50 + 100 * 0.05 / 365 * 1
                    date: dates[1],
                },
                {
                    value: 150.0342, // 100 + 50 + 100 * 0.05 / 365 * 2 + 50 * 0.05 / 365 * 1
                    date: dates[2],
                },
                {
                    value: 150.0548, // 100 + 50 + 100 * 0.05 / 365 * 3 + 50 * 0.05 / 365 * 2
                    date: dates[3],
                },
            ]);
        });
    });

    describe('usd currency', function () {
        const calcOptionsUsd = extendObject(calcOptionsDefault, {
            currency: CALC_CURRENCIES.USD,
        });

        test('relative method', async function () {
            expect(await calcBankDeposit(datasets, calcOptionsUsd)).toMatchObject([
                {
                    value: 0,
                    date: dates[0],
                },
                {
                    value: 0.0135, // (5 / 365 * 1) * 70 / 71
                    date: dates[1],
                },
                {
                    value: 0.0401, // (5 / 365 * 2) * 70 / 72 + (5 / 365 * 1) * 71 / 72
                    date: dates[2],
                },
                {
                    value: 0.0661, // (5 / 365 * 3) * 70 / 73 + (5 / 365 * 2) * 71 / 73
                    date: dates[3],
                },
            ]);
        });

        test('relative-annual method', async function () {
            const calcOptions = extendObject(calcOptionsUsd, {
                method: CALC_METHODS.RELATIVE_ANNUAL,
            });

            expect(await calcBankDeposit(datasets, calcOptions)).toMatchObject([
                {
                    value: 0,
                    date: dates[0],
                },
                {
                    value: 0.0135, // (5 / 365 * 1) * 70 / 71
                    date: dates[1],
                },
                {
                    value: 0.0266, // (5 / 365 * 2) * 70 / 72
                    date: dates[2],
                },
                {
                    value: 0.0394, // (5 / 365 * 3) * 70 / 73
                    date: dates[3],
                },
            ]);
        });

        test('absolute method', async function () {
            const calcOptions = extendObject(calcOptionsUsd, {
                method: CALC_METHODS.ABSOLUTE,
            });

            expect(await calcBankDeposit(datasets, calcOptions)).toMatchObject([
                {
                    value: 0,
                    date: dates[0],
                },
                {
                    value: 0.0135, // (100 * 0.05 / 365 * 1) * 70 / 71
                    date: dates[1],
                },
                {
                    value: 0.0334, // (100 * 0.05 / 365 * 2) * 70 / 72 + (50 * 0.05 / 365 * 1) * 71 / 72
                    date: dates[2],
                },
                {
                    value: 0.0527, // (100 * 0.05 / 365 * 3) * 70 / 73 + (50 * 0.05 / 365 * 2) * 71 / 73
                    date: dates[3],
                },
            ]);
        });

        test('absolute-total method', async function () {
            const calcOptions = extendObject(calcOptionsUsd, {
                method: CALC_METHODS.ABSOLUTE_TOTAL,
            });

            expect(await calcBankDeposit(datasets, calcOptions)).toMatchObject([
                {
                    value: 100,
                    date: dates[0],
                },
                {
                    value: 148.6051, // 100 * 70 / 71 + 50 + (100 * 0.05 / 365 * 1) * 70 / 71
                    date: dates[1],
                },
                {
                    value: 146.5612, // 100 * 70 / 72 + 50 * 71 / 72 + (100 * 0.05 / 365 * 2) * 70 / 72 + (50 * 0.05 / 365 * 1) * 71 / 72
                    date: dates[2],
                },
                {
                    value: 144.5733, // 100 * 70 / 73 + 50 * 71 / 73 + (100 * 0.05 / 365 * 3) * 70 / 73 + (50 * 0.05 / 365 * 2) * 71 / 73
                    date: dates[3],
                },
            ]);
        });
    });
});
