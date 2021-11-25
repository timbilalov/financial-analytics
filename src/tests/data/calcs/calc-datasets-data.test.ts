import { calcOptionsDefault, datasets, moexDataRowsUsd } from '@test-constants';
import { CALC_CURRENCIES, CALC_METHODS } from '@constants';
import { deepClone, extendObject } from '@helpers';
import type { TCalcOptions, TDatasetsData } from '@types';
import { prepareTestDataset } from '../../test-helpers';
import { calcDatasetsData } from '@data';
import { resetIndexFundData } from '@store';

declare const global: {
    fetch: unknown,
};

describe('calc-datasets-data', function () {
    const datasetsUsd = deepClone(datasets);
    datasetsUsd.forEach(item => item.asset.isUsd = true);

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
                        moexDataRowsUsd[4],
                        moexDataRowsUsd[5],
                        moexDataRowsUsd[6],
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

    beforeEach(function () {
        resetIndexFundData();
    });

    const calcOptionsBase: TCalcOptions = extendObject(calcOptionsDefault, {
        method: CALC_METHODS.ABSOLUTE_TOTAL,
    });

    // index fund data: [55, 56, 57, 58, 59, 60, 61, 61...]
    // usd data: [70, 71, 72, 73, 74, 75, 76, 76...]
    describe('should return an array of values', function () {
        describe('case 1', function () {
            const datasets = [
                prepareTestDataset([100, 130, NaN, NaN, NaN]),
                prepareTestDataset([NaN, NaN, 160, 220, NaN]),
            ];

            test('absolute-total calc method', async function () {
                const actual = await calcDatasetsData(datasets, calcOptionsBase);
                const expected: TDatasetsData = [
                    {
                        date: '2020.01.01',
                        values: {
                            total: 100,
                            own: 100,
                            earned: 0,
                            bankDeposit: 100,
                            indexFund: 100,
                            free: 0,
                            absolute: 0,
                        },
                    },
                    {
                        date: '2020.01.02',
                        values: {
                            total: 130,
                            own: 100,
                            earned: 30,
                            bankDeposit: 100.0137, // 100 + 100 * (1 / 365) * 0.05
                            indexFund: 101.8182, // 100 * (56 / 55)
                            free: 130,
                            absolute: 30,
                        },
                    },
                    {
                        date: '2020.01.03',
                        values: {
                            total: 160,
                            own: 130,
                            earned: 30,
                            bankDeposit: 130.0274, // 100 * (1 + (2 / 365) * 0.05) + 30 * (1 + (0 / 365) * 0.05
                            indexFund: 133.6364, // 100 * (57 / 55) + 30 * (57 / 57)
                            free: 0,
                            absolute: 30,
                        },
                    },
                    {
                        date: '2020.01.04',
                        values: {
                            total: 220,
                            own: 130,
                            earned: 90,
                            bankDeposit: 130.0452, // 100 * (1 + (3 / 365) * 0.05) + 30 * (1 + (1 / 365) * 0.05
                            indexFund: 135.9809, // 100 * (58 / 55) + 30 * (58 / 57)
                            free: 220,
                            absolute: 90,
                        },
                    },
                    {
                        date: '2020.01.05',
                        values: {
                            total: 220,
                            own: 130,
                            earned: 90,
                            bankDeposit: 130.0630, // 100 * (1 + (4 / 365) * 0.05) + 30 * (1 + (2 / 365) * 0.05
                            indexFund: 138.3254, // 100 * (59 / 55) + 30 * (59 / 57)
                            free: 220,
                            absolute: 90,
                        },
                    },
                ];

                expect(actual).toEqual(expected);
            });

            test('absolute calc method', async function () {
                const calcOptions = extendObject(calcOptionsBase, {
                    method: CALC_METHODS.ABSOLUTE,
                })
                const actual = await calcDatasetsData(datasets, calcOptions);
                const expected: TDatasetsData = [
                    {
                        date: '2020.01.01',
                        values: {
                            total: 0,
                            own: 100,
                            earned: 0,
                            bankDeposit: 0,
                            indexFund: 0,
                            free: 0,
                            absolute: 0,
                        },
                    },
                    {
                        date: '2020.01.02',
                        values: {
                            total: 30,
                            own: 100,
                            earned: 30,
                            bankDeposit: 0.0137, // 100 * (1 / 365) * 0.05
                            indexFund: 1.8182, // 100 * (56 / 55 - 1)
                            free: 130,
                            absolute: 30,
                        },
                    },
                    {
                        date: '2020.01.03',
                        values: {
                            total: 30,
                            own: 130,
                            earned: 30,
                            bankDeposit: 0.0274, // 100 * (2 / 365) * 0.05 + 30 * (0 / 365) * 0.05
                            indexFund: 3.6364, // 100 * (57 / 55 - 1) + 30 * (57 / 57 - 1)
                            free: 0,
                            absolute: 30,
                        },
                    },
                    {
                        date: '2020.01.04',
                        values: {
                            total: 90,
                            own: 130,
                            earned: 90,
                            bankDeposit: 0.0452, // 100 * (3 / 365) * 0.05 + 30 * (1 / 365) * 0.05
                            indexFund: 5.9809, // 100 * (58 / 55 - 1) + 30 * (58 / 57 - 1)
                            free: 220,
                            absolute: 90,
                        },
                    },
                    {
                        date: '2020.01.05',
                        values: {
                            total: 90,
                            own: 130,
                            earned: 90,
                            bankDeposit: 0.0630, // 100 * (4 / 365) * 0.05 + 30 * (2 / 365) * 0.05
                            indexFund: 8.3254, // 100 * (59 / 55 - 1) + 30 * (59 / 57 - 1)
                            free: 220,
                            absolute: 90,
                        },
                    },
                ];

                expect(actual).toEqual(expected);
            });

            test('usd currency', async function () {
                const calcOptions = extendObject(calcOptionsBase, {
                    currency: CALC_CURRENCIES.USD,
                });
                const actual = await calcDatasetsData(datasets, calcOptions);
                const expected: TDatasetsData = [
                    {
                        date: '2020.01.01',
                        values: {
                            total: 100,
                            own: 100, // 100 * (70 / 70)
                            earned: 0,
                            bankDeposit: 100,
                            indexFund: 100,
                            free: 0,
                            absolute: 0,
                        },
                    },
                    {
                        date: '2020.01.02',
                        values: {
                            total: 130, // 130
                            own: 98.5915, // 100 * (70 / 71)
                            earned: 30, // 30 * (71 / 71)
                            // earned: 31.4085, // (130 * 71 - 100 * 70) / 71
                            bankDeposit: 98.6051, // 100 * (70 / 71) * (1 + (1 / 365) * 0.05)
                            indexFund: 100.3841, // 100 * (70 / 71) * (56 / 55)
                            free: 130,
                            absolute: 30,
                        },
                    },
                    {
                        date: '2020.01.03',
                        values: {
                            total: 160, // 160
                            own: 129.0278, // 100 * (70 / 72) + (160 - 130 * (71 / 72)) * (72 / 72)
                            earned: 29.5833, // 30 * (71 / 72)
                            // earned: 30.9722, // (130 * 71 - 100 * 70) / 72
                            bankDeposit: 129.0544, // 100 * (70 / 72) * (1 + (2 / 365) * 0.05) + (160 - 130 * (71 / 72)) * (72 / 72) * (1 + (0 / 365) * 0.05)
                            indexFund: 132.5631, // 100 * (70 / 72) * (57 / 55) + (160 - 130 * (71 / 72)) * (72 / 72) * (57 / 57)
                            free: 0,
                            absolute: 30,
                        },
                    },
                    {
                        date: '2020.01.04',
                        values: {
                            total: 220, // 220
                            own: 127.2603, // 100 * (70 / 73) + (160 - 130 * (71 / 72)) * (72 / 73)
                            earned: 89.1781, // 30 * (71 / 73) + 60 * (73 / 73)
                            // earned: 92.7397, // (130 * 71 - 100 * 70) / 73 + (220 * 73 - 160 * 72) / 73
                            bankDeposit: 127.3040, // 100 * (70 / 73) * (1 + (3 / 365) * 0.05) + (160 - 130 * (71 / 72)) * (72 / 73) * (1 + (1 / 365) * 0.05)
                            indexFund: 133.0410, // 100 * (70 / 73) * (58 / 55) + (160 - 130 * (71 / 72)) * (72 / 73) * (58 / 57)
                            free: 220,
                            absolute: 90,
                        },
                    },
                    {
                        date: '2020.01.05',
                        values: {
                            total: 217.0270, // 220 * (73 / 74)
                            // total: 220, // 220 * (73 / 74)
                            own: 125.5405, // 100 * (70 / 74) + (160 - 130 * (71 / 72)) * (72 / 74)
                            earned: 87.9730, // 30 * (71 / 74) + 60 * (73 / 74)
                            // earned: 91.4865, // (130 * 71 - 100 * 70) / 74 + (220 * 73 - 160 * 72) / 74
                            bankDeposit: 125.6009, // 100 * (70 / 74) * (1 + (4 / 365) * 0.05) + (160 - 130 * (71 / 72)) * (72 / 74) * (1 + (2 / 365) * 0.05)
                            indexFund: 133.5060, // 100 * (70 / 74) * (59 / 55) + (160 - 130 * (71 / 72)) * (72 / 74) * (59 / 57)
                            free: 217.0270, // 220 * (73 / 74)
                            absolute: 90,
                        },
                    },
                ];

                expect(actual).toEqual(expected);
            });
        });

        describe('case 2', function () {
            const datasets = [
                prepareTestDataset([100, 120, NaN, NaN, NaN, NaN, NaN, NaN]),
                prepareTestDataset([120, 150, 110, NaN, NaN, NaN, NaN, NaN]),
                prepareTestDataset([NaN, 90, 70, 105, NaN, NaN, NaN, NaN]),
                prepareTestDataset([NaN, NaN, NaN, NaN, NaN, 400, 430, 390]),
            ];

            test('absolute-total calc method', async function () {
                const actual = await calcDatasetsData(datasets, calcOptionsBase);
                const expected: TDatasetsData = [
                    {
                        date: '2020.01.01',
                        values: {
                            total: 220,
                            own: 220,
                            earned: 0,
                            bankDeposit: 220, // 220 * (1 + (0 / 365) * 0.05)
                            indexFund: 220, // 220 * (55 / 55)
                            free: 0,
                            absolute: 0,
                        },
                    },
                    {
                        date: '2020.01.02',
                        values: {
                            total: 270,
                            own: 220,
                            earned: 20,
                            bankDeposit: 220.0301, // 220 * (1 + (1 / 365) * 0.05)
                            indexFund: 224, // 220 * (56 / 55)
                            free: 30,
                            absolute: 50,
                        },
                    },
                    {
                        date: '2020.01.03',
                        values: {
                            total: 210,
                            own: 220,
                            earned: 10,
                            bankDeposit: 220.0603, // 220 * (1 + (2 / 365) * 0.05)
                            indexFund: 228, // 220 * (57 / 55)
                            free: 140,
                            absolute: -10,
                        },
                    },
                    {
                        date: '2020.01.04',
                        values: {
                            total: 245,
                            own: 220,
                            earned: 25,
                            bankDeposit: 220.0904, // 220 * (1 + (3 / 365) * 0.05)
                            indexFund: 232, // 220 * (58 / 55)
                            free: 245,
                            absolute: 25,
                        },
                    },
                    {
                        date: '2020.01.05',
                        values: {
                            total: 245,
                            own: 220,
                            earned: 25,
                            bankDeposit: 220.1205, // 220 * (1 + (4 / 365) * 0.05)
                            indexFund: 236, // 220 * (59 / 55)
                            free: 245,
                            absolute: 25,
                        },
                    },
                    {
                        date: '2020.01.06',
                        values: {
                            total: 400,
                            own: 375, // 220 + (400 - 245)
                            earned: 25,
                            bankDeposit: 375.1507, // 220 * (1 + (5 / 365) * 0.05) + (400 - 245) * (1 + (0 / 365) * 0.05
                            indexFund: 395, // 220 * (60 / 55) + (400 - 245) * (60 / 60)
                            free: 0,
                            absolute: 25,
                        },
                    },
                    {
                        date: '2020.01.07',
                        values: {
                            total: 430,
                            own: 375,
                            earned: 25,
                            bankDeposit: 375.2021, // 220 * (1 + (6 / 365) * 0.05) + (400 - 245) * (1 + (1 / 365) * 0.05
                            indexFund: 401.5833, // 220 * (61 / 55) + (400 - 245) * (61 / 60)
                            free: 0,
                            absolute: 55,
                        },
                    },
                    {
                        date: '2020.01.08',
                        values: {
                            total: 390,
                            own: 375,
                            earned: 25,
                            bankDeposit: 375.2534, // 220 * (1 + (7 / 365) * 0.05) + (400 - 245) * (1 + (2 / 365) * 0.05
                            indexFund: 401.5833, // 220 * (61 / 55) + (400 - 245) * (61 / 60)
                            free: 0,
                            absolute: 15,
                        },
                    },
                ];

                expect(actual).toEqual(expected);
            });

            test('absolute calc method', async function () {
                const calcOptions = extendObject(calcOptionsBase, {
                    method: CALC_METHODS.ABSOLUTE,
                });
                const actual = await calcDatasetsData(datasets, calcOptions);
                const expected: TDatasetsData = [
                    {
                        date: '2020.01.01',
                        values: {
                            total: 0,
                            own: 220,
                            earned: 0,
                            bankDeposit: 0,
                            indexFund: 0,
                            free: 0,
                            absolute: 0,
                        },
                    },
                    {
                        date: '2020.01.02',
                        values: {
                            total: 50,
                            own: 220,
                            earned: 20,
                            bankDeposit: 0.0301, // 220 * (1 / 365) * 0.05
                            indexFund: 4, // 220 * (56 / 55 - 1)
                            free: 30,
                            absolute: 50,
                        },
                    },
                    {
                        date: '2020.01.03',
                        values: {
                            total: -10,
                            own: 220,
                            earned: 10,
                            bankDeposit: 0.0603, // 220 * (2 / 365) * 0.05
                            indexFund: 8, // 220 * (57 / 55 - 1)
                            free: 140,
                            absolute: -10,
                        },
                    },
                    {
                        date: '2020.01.04',
                        values: {
                            total: 25,
                            own: 220,
                            earned: 25,
                            bankDeposit: 0.0904, // 220 * (3 / 365) * 0.05
                            indexFund: 12, // 220 * (58 / 55 - 1)
                            free: 245,
                            absolute: 25,
                        },
                    },
                    {
                        date: '2020.01.05',
                        values: {
                            total: 25,
                            own: 220,
                            earned: 25,
                            bankDeposit: 0.1205, // 220 * (4 / 365) * 0.05
                            indexFund: 16, // 220 * (59 / 55 - 1)
                            free: 245,
                            absolute: 25,
                        },
                    },
                    {
                        date: '2020.01.06',
                        values: {
                            total: 25,
                            own: 375,
                            earned: 25,
                            bankDeposit: 0.1507, // 220 * (5 / 365) * 0.05 + 155 * (0 / 365) * 0.05
                            indexFund: 20, // 220 * (60 / 55 - 1) + 155 * (60 / 60 - 1)
                            free: 0,
                            absolute: 25,
                        },
                    },
                    {
                        date: '2020.01.07',
                        values: {
                            total: 55,
                            own: 375,
                            earned: 25,
                            bankDeposit: 0.2021, // 220 * (6 / 365) * 0.05 + 155 * (1 / 365) * 0.05
                            indexFund: 26.5833, // 220 * (61 / 55 - 1) + 155 * (61 / 60 - 1)
                            free: 0,
                            absolute: 55,
                        },
                    },
                    {
                        date: '2020.01.08',
                        values: {
                            total: 15,
                            own: 375,
                            earned: 25,
                            bankDeposit: 0.2534, // 220 * (7 / 365) * 0.05 + 155 * (2 / 365) * 0.05
                            indexFund: 26.5833, // 220 * (61 / 55 - 1) + 155 * (61 / 60 - 1)
                            free: 0,
                            absolute: 15,
                        },
                    },
                ];

                expect(actual).toEqual(expected);
            });
        });

        describe('case 3, mixed rub and usd assets', function () {
            const datasets = [
                prepareTestDataset([30, 40, NaN, NaN, NaN, NaN], true),
                prepareTestDataset([NaN, NaN, NaN, 50, 55, NaN], false),
                prepareTestDataset([NaN, NaN, NaN, NaN, 70, 77], true),
            ];

            test('rub calc options', async function () {
                const actual = await calcDatasetsData(datasets, calcOptionsBase);
                const expected: TDatasetsData = [
                    {
                        date: '2020.01.01',
                        values: {
                            total: 30,
                            own: 30,
                            earned: 0,
                            bankDeposit: 30, // 30 * (1 + (0 / 365) * 0.05)
                            indexFund: 30, // 30 * (55 / 55)
                            free: 0,
                            absolute: 0,
                        },
                    },
                    {
                        date: '2020.01.02',
                        values: {
                            total: 40,
                            own: 30,
                            earned: 10, // 10 * (71 / 71)
                            bankDeposit: 30.0041, // 30 * (1 + (1 / 365) * 0.05)
                            indexFund: 30.5455, // 30 * (56 / 55)
                            free: 40, // 40 * (71 / 71)
                            absolute: 10,
                        },
                    },
                    {
                        date: '2020.01.03',
                        values: {
                            // total: 40,
                            total: 40.5634, // free money
                            own: 30,
                            earned: 10.1408, // 10 * (72 / 71)
                            bankDeposit: 30.0082, // 30 * (1 + (2 / 365) * 0.05)
                            indexFund: 31.0909, // 30 * (57 / 55)
                            free: 40.5634, // 40 * (72 / 71)
                            absolute: 10,
                        },
                    },
                    {
                        date: '2020.01.04',
                        values: {
                            total: 50,
                            own: 38.8732, // 30 + (50 - 40 * (73 / 71))
                            earned: 10.2817, // 10 * (73 / 71)
                            bankDeposit: 38.8856, // 30 * (1 + (3 / 365) * 0.05) + (50 - 40 * (73 / 71)) * (1 + (0 / 365) * 0.05)
                            indexFund: 40.5096, // 30 * (58 / 55) + (50 - 40 * (73 / 71)) * (58 / 58)
                            free: 0,
                            absolute: 10,
                        },
                    },
                    {
                        date: '2020.01.05',
                        values: {
                            total: 70,
                            own: 53.8732, // 30 + (50 - 40 * (73 / 71)) + 15
                            earned: 15.4225, // 10 * (74 / 71) + 5
                            bankDeposit: 53.8909, // 30 * (1 + (4 / 365) * 0.05) + (50 - 40 * (73 / 71)) * (1 + (1 / 365) * 0.05) + 15 * (1 + (0 / 365) * 0.05)
                            indexFund: 56.2080, // 30 * (59 / 55) + (50 - 40 * (73 / 71)) * (59 / 58) + 15 * (59 / 59)
                            free: 0,
                            absolute: 15,
                        },
                    },
                    {
                        date: '2020.01.06',
                        values: {
                            total: 77,
                            own: 53.8732, // 30 + (50 - 40 * (73 / 71)) + 15
                            earned: 15.5634, // 10 * (75 / 71) + 5
                            bankDeposit: 53.8983, // 30 * (1 + (5 / 365) * 0.05) + (50 - 40 * (73 / 71)) * (1 + (2 / 365) * 0.05) + 15 * (1 + (1 / 365) * 0.05)
                            indexFund: 57.1607, // 30 * (60 / 55) + (50 - 40 * (73 / 71)) * (60 / 58) + 15 * (60 / 59)
                            free: 0,
                            absolute: 22,
                        },
                    },
                ];

                expect(actual).toEqual(expected);
            });

            test('usd calc options', async function () {
                const calcOptions = extendObject(calcOptionsBase, {
                    currency: CALC_CURRENCIES.USD,
                });
                const actual = await calcDatasetsData(datasets, calcOptions);
                const expected: TDatasetsData = [
                    {
                        date: '2020.01.01',
                        values: {
                            total: 30,
                            own: 30, // 30 * (70 / 70)
                            earned: 0,
                            bankDeposit: 30, // 30 * (70 / 70) * (1 + (0 / 365) * 0.05)
                            indexFund: 30, // 30 * (70 / 70) * (55 / 55)
                            free: 0,
                            absolute: 0,
                        },
                    },
                    {
                        date: '2020.01.02',
                        values: {
                            total: 40,
                            own: 29.5775, // 30 * (70 / 71)
                            earned: 10,
                            bankDeposit: 29.5815, // 30 * (70 / 71) * (1 + (1 / 365) * 0.05)
                            indexFund: 30.1152, // 30 * (70 / 71) * (56 / 55)
                            free: 40,
                            absolute: 10,
                        },
                    },
                    {
                        date: '2020.01.03',
                        values: {
                            total: 40,
                            own: 29.1667, // 30 * (70 / 72)
                            earned: 10,
                            bankDeposit: 29.1747, // 30 * (70 / 72) * (1 + (2 / 365) * 0.05)
                            indexFund: 30.2273, // 30 * (70 / 72) * (57 / 55)
                            free: 40,
                            absolute: 10,
                        },
                    },
                    {
                        date: '2020.01.04',
                        values: {
                            total: 50,
                            own: 38.7671, // 30 * (70 / 73) + (50 - 40) * (73 / 73)
                            earned: 10,
                            bankDeposit: 38.7789, // 30 * (70 / 73) * (1 + (3 / 365) * 0.05) + (50 - 40) * (1 + (0 / 365) * 0.05)
                            indexFund: 40.3362, // 30 * (70 / 73) * (58 / 55) + (50 - 40) * (58 / 58)
                            free: 0,
                            absolute: 10,
                        },
                    },
                    {
                        date: '2020.01.05',
                        values: {
                            total: 70,
                            own: 53.2432, // 30 * (70 / 74) + (50 - 40) * (73 / 74) + 15 * (74 / 74)
                            earned: 15, // 10 + 5 * (74 / 74)
                            bankDeposit: 53.2601, // 30 * (70 / 74) * (1 + (4 / 365) * 0.05) + (50 - 40) * (73 / 74) * (1 + (1 / 365) * 0.05) + 15 * (1 + (0 / 365) * 0.05)
                            indexFund: 55.4772, // 30 * (70 / 74) * (59 / 55) + (50 - 40) * (73 / 74) * (59 / 58) + 15 * (59 / 59)
                            free: 0,
                            absolute: 15,
                        },
                    },
                    {
                        date: '2020.01.06',
                        values: {
                            total: 77,
                            own: 52.5333, // 30 * (70 / 75) + (50 - 40) * (73 / 75) + 15 * (74 / 75)
                            earned: 14.9333, // 10 + 5 * (74 / 75)
                            bankDeposit: 52.5572, // 30 * (70 / 75) * (1 + (5 / 365) * 0.05) + (50 - 40) * (73 / 75) * (1 + (2 / 365) * 0.05) + 15 * (74 / 75) * (1 + (1 / 365) * 0.05)
                            indexFund: 55.6653, // 30 * (70 / 75) * (60 / 55) + (50 - 40) * (73 / 75) * (60 / 58) + 15 * (74 / 75) * (60 / 59)
                            free: 0,
                            absolute: 22,
                        },
                    },
                ];

                expect(actual).toEqual(expected);
            });
        });

        test('should be equal for different positions of datasets in array', async function () {
            const d1 = prepareTestDataset([30, 100, NaN, NaN, NaN, NaN]);
            const d2 = prepareTestDataset([NaN, 80, 60, 50, NaN, NaN]);
            const d3 = prepareTestDataset([NaN, NaN, NaN, NaN, 200, 220]);

            const datasets1 = [d1, d2, d3];
            const datasets2 = [d1, d3, d2];
            const datasets3 = [d2, d1, d3];
            const datasets4 = [d2, d3, d1];
            const datasets5 = [d3, d1, d2];
            const datasets6 = [d3, d2, d1];

            const expected: TDatasetsData = [
                {
                    date: '2020.01.01',
                    values: {
                        total: 30,
                        own: 30,
                        earned: 0,
                        bankDeposit: 30, // 30 * (1 + (0 / 365) * 0.05)
                        indexFund: 30, // 30 * (55 / 55)
                        free: 0,
                        absolute: 0,
                    },
                },
                {
                    date: '2020.01.02',
                    values: {
                        total: 100,
                        own: 30,
                        earned: 70,
                        bankDeposit: 30.0041, // 30 * (1 + (1 / 365) * 0.05)
                        indexFund: 30.5455, // 30 * (56 / 55)
                        free: 20,
                        absolute: 70,
                    },
                },
                {
                    date: '2020.01.03',
                    values: {
                        total: 80,
                        own: 30,
                        earned: 70,
                        bankDeposit: 30.0082, // 30 * (1 + (2 / 365) * 0.05)
                        indexFund: 31.0909, // 30 * (57 / 55)
                        free: 20,
                        absolute: 50,
                    },
                },
                {
                    date: '2020.01.04',
                    values: {
                        total: 70,
                        own: 30,
                        earned: 40,
                        bankDeposit: 30.0123, // 30 * (1 + (3 / 365) * 0.05)
                        indexFund: 31.6364, // 30 * (58 / 55)
                        free: 70,
                        absolute: 40,
                    },
                },
                {
                    date: '2020.01.05',
                    values: {
                        total: 200,
                        own: 160,
                        earned: 40,
                        bankDeposit: 160.0164, // 30 * (1 + (4 / 365) * 0.05) + 130 * (1 + (0 / 365) * 0.05
                        indexFund: 162.1818, // 30 * (59 / 55) + 130 * (59 / 59)
                        free: 0,
                        absolute: 40,
                    },
                },
                {
                    date: '2020.01.06',
                    values: {
                        total: 220,
                        own: 160,
                        earned: 40,
                        bankDeposit: 160.0384, // 30 * (1 + (5 / 365) * 0.05) + 130 * (1 + (1 / 365) * 0.05
                        indexFund: 164.9307, // 30 * (60 / 55) + 130 * (60 / 59)
                        free: 0,
                        absolute: 60,
                    },
                },
            ];

            const actual1 = await calcDatasetsData(datasets1, calcOptionsBase);
            const actual2 = await calcDatasetsData(datasets2, calcOptionsBase);
            const actual3 = await calcDatasetsData(datasets3, calcOptionsBase);
            const actual4 = await calcDatasetsData(datasets4, calcOptionsBase);
            const actual5 = await calcDatasetsData(datasets5, calcOptionsBase);
            const actual6 = await calcDatasetsData(datasets6, calcOptionsBase);

            expect(actual1).toEqual(expected);
            expect(actual2).toEqual(expected);
            expect(actual3).toEqual(expected);
            expect(actual4).toEqual(expected);
            expect(actual5).toEqual(expected);
            expect(actual6).toEqual(expected);
        });
    });
});