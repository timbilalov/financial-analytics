import {calcIndexFund} from "@data";
import {
    calcOptionsDefault,
    datasets,
    dates,
    indexFundData,
    moexDataRows,
    moexDataRowsBonds, moexDataRowsUsd,
    options,
    usdData
} from "@test-constants";
import {CALC_CURRENCIES, CALC_METHODS} from "@constants";

declare const global: {
    fetch: unknown,
};

describe('calc-index-fund', function () {
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
            const result = await calcIndexFund(datasets, calcOptionsDefault);

            expect(result).toEqual([
                {
                    value: 0,
                    date: dates[0],
                },
                {
                    value: 1.8182, // ((56 - 55) / 55 + (56 - 56) / 56) * 100
                    date: dates[1],
                },
                {
                    value: 5.4221, // ((57 - 55) / 55 + (57 - 56) / 56) * 100
                    date: dates[2],
                },
                {
                    value: 9.0260, // ((58 - 55) / 55 + (58 - 56) / 56) * 100
                    date: dates[3],
                },
            ]);
        });

        test('relative-annual method', async function () {
            const calcOptions = Object.assign({}, calcOptionsDefault, {
                method: CALC_METHODS.RELATIVE_ANNUAL,
            });
            const result = await calcIndexFund(datasets, calcOptions);

            expect(result).toEqual([
                {
                    value: 0, // ((55 - 55) / 55) / 1
                    date: dates[0],
                },
                {
                    value: 0.9091, // (((56 - 55) / 55 + (56 - 56) / 56) / 2) * 100
                    date: dates[1],
                },
                {
                    value: 2.7110, // (((57 - 55) / 55 + (57 - 56) / 56) / 2) * 100
                    date: dates[2],
                },
                {
                    value: 4.5130, // (((58 - 55) / 55 + (58 - 56) / 56) / 2) * 100
                    date: dates[3],
                },
            ]);
        });

        test('absolute method', async function () {
            const calcOptions = Object.assign({}, calcOptionsDefault, {
                method: CALC_METHODS.ABSOLUTE,
            });
            const result = await calcIndexFund(datasets, calcOptions);

            expect(result).toEqual([
                {
                    value: 0, // (55 - 55) * 100 / 55
                    date: dates[0],
                },
                {
                    value: 1.8182, // (56 - 55) * 100 / 55
                    date: dates[1],
                },
                {
                    value: 4.5292, // (57 - 55) * 100 / 55 + (57 - 56) * 50 / 56
                    date: dates[2],
                },
                {
                    value: 7.2403, // (58 - 55) * 100 / 55 + (58 - 56) * 50 / 56
                    date: dates[3],
                },
            ]);
        });

        test('absolute-total method', async function () {
            const calcOptions = Object.assign({}, calcOptionsDefault, {
                method: CALC_METHODS.ABSOLUTE_TOTAL,
            });
            const result = await calcIndexFund(datasets, calcOptions);

            expect(result).toEqual([
                {
                    value: 100, // 100 / 55 * 55
                    date: dates[0],
                },
                {
                    value: 151.8182, // 100 / 55 * 56 + 50 / 56 * 56
                    date: dates[1],
                },
                {
                    value: 154.5292, // 100 / 55 * 57 + 50 / 56 * 57
                    date: dates[2],
                },
                {
                    value: 157.2403, // 100 / 55 * 58 + 50 / 56 * 58
                    date: dates[3],
                },
            ]);
        });
    });

    describe('usd currency', function () {
        const calcOptionsUsdBase = Object.assign({}, calcOptionsDefault, {
            currency: CALC_CURRENCIES.USD,
        });

        test('relative method', async function () {
            const result = await calcIndexFund(datasets, calcOptionsUsdBase);

            expect(result).toEqual([
                {
                    value: 0,
                    date: dates[0],
                },
                {
                    value: 1.7926, // ((56 - 55) / 55 * 70 / 71) * 100
                    date: dates[1],
                },
                {
                    value: 5.2963, // ((57 - 55) / 55 * 70 / 72 + (57 - 56) / 56 * 71 / 72) * 100
                    date: dates[2],
                },
                {
                    value: 8.7040, // ((58 - 55) / 55 * 70 / 73 + (58 - 56) / 56 * 71 / 73) * 100
                    date: dates[3],
                },
            ]);
        });

        test('relative-annual method', async function () {
            const calcOptions = Object.assign({}, calcOptionsUsdBase, {
                method: CALC_METHODS.RELATIVE_ANNUAL,
            });
            const result = await calcIndexFund(datasets, calcOptions);

            expect(result).toEqual([
                {
                    value: 0,
                    date: dates[0],
                },
                {
                    value: 0.8963, // (((56 - 55) / 55 * 70 / 71 + (56 - 56) / 56 * 71 / 71) / 2) * 100
                    date: dates[1],
                },
                {
                    value: 2.6481, // (((57 - 55) / 55 * 70 / 72 + (57 - 56) / 56 * 71 / 72) / 2) * 100
                    date: dates[2],
                },
                {
                    value: 4.3520, // (((58 - 55) / 55 * 70 / 73 + (58 - 56) / 56 * 71 / 73) / 2) * 100
                    date: dates[3],
                },
            ]);
        });

        test('absolute method', async function () {
            const calcOptions = Object.assign({}, calcOptionsUsdBase, {
                method: CALC_METHODS.ABSOLUTE,
            });
            const result = await calcIndexFund(datasets, calcOptions);

            expect(result).toMatchObject([
                {
                    value: 0,
                    date: dates[0],
                },
                {
                    value: 0.3841, // (56 / 71 - 55 / 70) * 100 / (55 / 70)
                    date: dates[1],
                },
                {
                    value: 0.9436, // (57 / 72 - 55 / 70) * 100 / (55 / 70) + (57 / 72 - 56 / 71) * 50 / (56 / 71)
                    date: dates[2],
                },
                {
                    value: 1.4877, // (58 / 73 - 55 / 70) * 100 / (55 / 70) + (58 / 73 - 56 / 71) * 50 / (56 / 71)
                    date: dates[3],
                },
            ]);
        });

        test('absolute-total method', async function () {
            const calcOptions = Object.assign({}, calcOptionsUsdBase, {
                method: CALC_METHODS.ABSOLUTE_TOTAL,
            });
            const result = await calcIndexFund(datasets, calcOptions);

            expect(result).toEqual([
                {
                    value: 100,
                    date: dates[0],
                },
                {
                    value: 150.3841, // (56 / 71) * 100 / (55 / 70) + 50
                    date: dates[1],
                },
                {
                    value: 150.9436, // (57 / 72) * 100 / (55 / 70) + (57 / 72) * 50 / (56 / 71)
                    date: dates[2],
                },
                {
                    value: 151.4877, // (58 / 73) * 100 / (55 / 70) + (58 / 73) * 50 / (56 / 71)
                    date: dates[3],
                },
            ]);
        });
    });
});
