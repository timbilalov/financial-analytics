import { calcOptionsDefault, datasets, dates } from '@test-constants';
import { BANK_DEPOSIT_LABEL, CALC_CURRENCIES, CALC_METHODS, EARNED_MONEY_LABEL, FREE_MONEY_LABEL, INDEX_FUND_LABEL, OWN_MONEY_LABEL, TOTAL_LABEL } from '@constants';
import { extendObject, toFractionDigits } from '@helpers';
import type { TAsset, TCalcOptions, TDatasetsData } from '@types';
import { prepareTestDataset } from '../../test-helpers';
import { calcDatasetsData, getAssetsFromDatasets } from '@data';

describe('calc-datasets-data', function () {
    const calcOptionsBase: TCalcOptions = extendObject(calcOptionsDefault, {
        method: CALC_METHODS.ABSOLUTE_TOTAL,
    });

    // index fund data: [55, 56, 57, 58, 59, 60, 61, 61...]
    const usdData = [70, 71, 72, 73, 74, 75, 76];

    let datasetsDataAbsoluteTotal!: TDatasetsData;

    describe('case 1', function () {
        const datasets = [
            prepareTestDataset([100, 130, NaN, NaN]),
            prepareTestDataset([NaN, NaN, 160, 220]),
        ];
        const assets = getAssetsFromDatasets(datasets);

        beforeEach(async () => {
            datasetsDataAbsoluteTotal = await calcDatasetsData(assets, calcOptionsBase);
        });

        test('absolute-total calc method', async function () {
            const datasetsData = datasetsDataAbsoluteTotal;

            expect(datasetsData.get(assets[0])).toEqual([
                100,
                NaN,
                NaN,
                NaN,
            ]);

            expect(datasetsData.get(assets[1])).toEqual([
                NaN,
                NaN,
                160,
                220,
            ]);

            expect(datasetsData.get(TOTAL_LABEL)).toMatchSnapshot('TOTAL_LABEL');
            expect(datasetsData.get(OWN_MONEY_LABEL)).toMatchSnapshot('OWN_MONEY_LABEL');
            expect(datasetsData.get(EARNED_MONEY_LABEL)).toMatchSnapshot('EARNED_MONEY_LABEL');
            expect(datasetsData.get(FREE_MONEY_LABEL)).toMatchSnapshot('FREE_MONEY_LABEL');
            expect(datasetsData.get(BANK_DEPOSIT_LABEL)).toMatchSnapshot('BANK_DEPOSIT_LABEL');
            expect(datasetsData.get(INDEX_FUND_LABEL)).toMatchSnapshot('INDEX_FUND_LABEL');
        });

        test('absolute calc method', async function () {
            const calcOptions = extendObject(calcOptionsBase, {
                method: CALC_METHODS.ABSOLUTE,
            })

            const datasetsData = await calcDatasetsData(assets, calcOptions);

            expect(datasetsData.get(assets[0])).toEqual([
                0,
                NaN,
                NaN,
                NaN,
            ]);

            expect(datasetsData.get(assets[1])).toEqual([
                NaN,
                NaN,
                0,
                60,
            ]);

            expect(datasetsData.get(TOTAL_LABEL)).toMatchSnapshot('TOTAL_LABEL');
            expect(datasetsData.get(BANK_DEPOSIT_LABEL)).toMatchSnapshot('BANK_DEPOSIT_LABEL');
            expect(datasetsData.get(INDEX_FUND_LABEL)).toMatchSnapshot('INDEX_FUND_LABEL');

            // The remaining datasets are the same as for the absolute-total calc method.
            expect(datasetsData.get(OWN_MONEY_LABEL)).toEqual(datasetsDataAbsoluteTotal.get(OWN_MONEY_LABEL));
            expect(datasetsData.get(EARNED_MONEY_LABEL)).toEqual(datasetsDataAbsoluteTotal.get(EARNED_MONEY_LABEL));
            expect(datasetsData.get(FREE_MONEY_LABEL)).toEqual(datasetsDataAbsoluteTotal.get(FREE_MONEY_LABEL));
        });

        test('usd currency', async function () {
            const calcOptions = extendObject(calcOptionsBase, {
                currency: CALC_CURRENCIES.USD,
            })

            const datasetsData = await calcDatasetsData(assets, calcOptions);

            // All datasets are similar to the absolute-total calc method, but divided by the value of the currency.
            expect(datasetsData.get(assets[0])).toEqual(datasetsDataAbsoluteTotal.get(assets[0])!.map((item, index) => toFractionDigits(item / usdData[index])));
            expect(datasetsData.get(assets[1])).toEqual(datasetsDataAbsoluteTotal.get(assets[1])!.map((item, index) => toFractionDigits(item / usdData[index])));
            expect(datasetsData.get(TOTAL_LABEL)).toEqual(datasetsDataAbsoluteTotal.get(TOTAL_LABEL)!.map((item, index) => toFractionDigits(item / usdData[index])));
            expect(datasetsData.get(OWN_MONEY_LABEL)).toEqual(datasetsDataAbsoluteTotal.get(OWN_MONEY_LABEL)!.map((item, index) => toFractionDigits(item / usdData[index])));
            expect(datasetsData.get(INDEX_FUND_LABEL)).toEqual(datasetsDataAbsoluteTotal.get(INDEX_FUND_LABEL)!.map((item, index) => toFractionDigits(item / usdData[index])));
            expect(datasetsData.get(EARNED_MONEY_LABEL)).toEqual(datasetsDataAbsoluteTotal.get(EARNED_MONEY_LABEL)!.map((item, index) => toFractionDigits(item / usdData[index])));
            expect(datasetsData.get(FREE_MONEY_LABEL)).toEqual(datasetsDataAbsoluteTotal.get(FREE_MONEY_LABEL)!.map((item, index) => toFractionDigits(item / usdData[index])));
        });

        test('should be equal for different positions of datasets in array', async () => {
            const datasetsReversed = datasets.slice().reverse();
            const assets = getAssetsFromDatasets(datasetsReversed);
            const datasetsData = await calcDatasetsData(assets, calcOptionsBase);

            expect(datasetsData).toEqual(datasetsDataAbsoluteTotal);
        });
    });

    describe('case 2', function () {
        const assets = getAssetsFromDatasets([
            prepareTestDataset([100, 120, NaN, NaN, NaN, NaN, NaN, NaN], false, 2),
            prepareTestDataset([120, 150, 110, NaN, NaN, NaN, NaN, NaN], false, 3),
            prepareTestDataset([NaN, 90, 70, 105, NaN, NaN, NaN, NaN], false, 4),
            prepareTestDataset([NaN, NaN, NaN, NaN, NaN, 400, 430, 390], false, 5),
        ]);

        beforeEach(async () => {
            datasetsDataAbsoluteTotal = await calcDatasetsData(assets, calcOptionsBase);
        });

        test('absolute-total calc method', async function () {
            const datasetsData = datasetsDataAbsoluteTotal;

            expect(datasetsData.get(assets[0])).toEqual([
                200, // 100 * 2
                NaN,
                NaN,
                NaN,
                NaN,
                NaN,
                NaN,
                NaN,
            ]);

            expect(datasetsData.get(assets[1])).toEqual([
                360, // 120 * 3
                450, // 150 * 3
                NaN,
                NaN,
                NaN,
                NaN,
                NaN,
                NaN,
            ]);

            expect(datasetsData.get(assets[2])).toEqual([
                NaN,
                360, // 90 * 4
                280, // 70 * 4
                NaN,
                NaN,
                NaN,
                NaN,
                NaN,
            ]);

            expect(datasetsData.get(assets[3])).toEqual([
                NaN,
                NaN,
                NaN,
                NaN,
                NaN,
                2000, // 400 * 5
                2150, // 430 * 5
                1950, // 390 * 5
            ]);

            expect(datasetsData.get(TOTAL_LABEL)).toMatchSnapshot('TOTAL_LABEL');
            expect(datasetsData.get(OWN_MONEY_LABEL)).toMatchSnapshot('OWN_MONEY_LABEL');
            expect(datasetsData.get(EARNED_MONEY_LABEL)).toMatchSnapshot('EARNED_MONEY_LABEL');
            expect(datasetsData.get(FREE_MONEY_LABEL)).toMatchSnapshot('FREE_MONEY_LABEL');
            expect(datasetsData.get(BANK_DEPOSIT_LABEL)).toMatchSnapshot('BANK_DEPOSIT_LABEL');
            expect(datasetsData.get(INDEX_FUND_LABEL)).toMatchSnapshot('INDEX_FUND_LABEL');
        });

        test('absolute calc method', async function () {
            const calcOptions = extendObject(calcOptionsBase, {
                method: CALC_METHODS.ABSOLUTE,
            })

            const datasetsData = await calcDatasetsData(assets, calcOptions);

            expect(datasetsData.get(assets[0])).toEqual([
                0,
                NaN,
                NaN,
                NaN,
                NaN,
                NaN,
                NaN,
                NaN,
            ]);

            expect(datasetsData.get(assets[1])).toEqual([
                0,
                90, // 30 * 3
                NaN,
                NaN,
                NaN,
                NaN,
                NaN,
                NaN,
            ]);

            expect(datasetsData.get(assets[2])).toEqual([
                NaN,
                0,
                -80, // -20 * 4
                NaN,
                NaN,
                NaN,
                NaN,
                NaN,
            ]);

            expect(datasetsData.get(assets[3])).toEqual([
                NaN,
                NaN,
                NaN,
                NaN,
                NaN,
                0,
                150, // 30 * 5
                -50, // -10 * 5
            ]);

            expect(datasetsData.get(TOTAL_LABEL)).toMatchSnapshot('TOTAL_LABEL');
            expect(datasetsData.get(TOTAL_LABEL)).toMatchSnapshot('TOTAL_LABEL');
            expect(datasetsData.get(BANK_DEPOSIT_LABEL)).toMatchSnapshot('BANK_DEPOSIT_LABEL');
            expect(datasetsData.get(INDEX_FUND_LABEL)).toMatchSnapshot('INDEX_FUND_LABEL');

            // The remaining datasets are the same as for the absolute-total calc method.
            expect(datasetsData.get(OWN_MONEY_LABEL)).toEqual(datasetsDataAbsoluteTotal.get(OWN_MONEY_LABEL));
            expect(datasetsData.get(EARNED_MONEY_LABEL)).toEqual(datasetsDataAbsoluteTotal.get(EARNED_MONEY_LABEL));
            expect(datasetsData.get(FREE_MONEY_LABEL)).toEqual(datasetsDataAbsoluteTotal.get(FREE_MONEY_LABEL));
        });
    });

    describe('case 3, mixed rub and usd assets', function () {
        const assets = getAssetsFromDatasets([
            prepareTestDataset([30, 40, NaN, NaN, NaN, NaN], true),
            prepareTestDataset([NaN, NaN, NaN, 50, 55, NaN], false),
            prepareTestDataset([NaN, NaN, NaN, NaN, 70, 77], true),
        ]);

        beforeEach(async () => {
            datasetsDataAbsoluteTotal = await calcDatasetsData(assets, calcOptionsBase);
        });

        test('rub calc options', async function () {
            const datasetsData = datasetsDataAbsoluteTotal;

            expect(datasetsData.get(assets[0])).toEqual([
                2100, // 30 * 70
                NaN,
                NaN,
                NaN,
                NaN,
                NaN,
            ]);

            expect(datasetsData.get(assets[1])).toEqual([
                NaN,
                NaN,
                NaN,
                50,
                NaN,
                NaN,
            ]);

            expect(datasetsData.get(assets[2])).toEqual([
                NaN,
                NaN,
                NaN,
                NaN,
                5180, // 70 * 74
                5775, // 77 * 75
            ]);

            expect(datasetsData.get(TOTAL_LABEL)).toMatchSnapshot('TOTAL_LABEL');
            expect(datasetsData.get(OWN_MONEY_LABEL)).toMatchSnapshot('OWN_MONEY_LABEL');
            expect(datasetsData.get(EARNED_MONEY_LABEL)).toMatchSnapshot('EARNED_MONEY_LABEL');
            expect(datasetsData.get(FREE_MONEY_LABEL)).toMatchSnapshot('FREE_MONEY_LABEL');
            expect(datasetsData.get(BANK_DEPOSIT_LABEL)).toMatchSnapshot('BANK_DEPOSIT_LABEL');
            expect(datasetsData.get(INDEX_FUND_LABEL)).toMatchSnapshot('INDEX_FUND_LABEL');
        });

        test('usd calc options', async function () {
            const calcOptions = extendObject(calcOptionsBase, {
                currency: CALC_CURRENCIES.USD,
            });
            const datasetsData = await calcDatasetsData(assets, calcOptions);

            // All datasets are similar to the absolute-total calc method, but divided by the value of the currency.
            expect(datasetsData.get(assets[0])).toEqual(datasetsDataAbsoluteTotal.get(assets[0])!.map((item, index) => toFractionDigits(item / usdData[index])));
            expect(datasetsData.get(assets[1])).toEqual(datasetsDataAbsoluteTotal.get(assets[1])!.map((item, index) => toFractionDigits(item / usdData[index])));
            expect(datasetsData.get(assets[2])).toEqual(datasetsDataAbsoluteTotal.get(assets[2])!.map((item, index) => toFractionDigits(item / usdData[index])));
            expect(datasetsData.get(TOTAL_LABEL)).toEqual(datasetsDataAbsoluteTotal.get(TOTAL_LABEL)!.map((item, index) => toFractionDigits(item / usdData[index])));
            expect(datasetsData.get(OWN_MONEY_LABEL)).toEqual(datasetsDataAbsoluteTotal.get(OWN_MONEY_LABEL)!.map((item, index) => toFractionDigits(item / usdData[index])));
            expect(datasetsData.get(INDEX_FUND_LABEL)).toEqual(datasetsDataAbsoluteTotal.get(INDEX_FUND_LABEL)!.map((item, index) => toFractionDigits(item / usdData[index])));
            expect(datasetsData.get(EARNED_MONEY_LABEL)).toEqual(datasetsDataAbsoluteTotal.get(EARNED_MONEY_LABEL)!.map((item, index) => toFractionDigits(item / usdData[index])));
            expect(datasetsData.get(FREE_MONEY_LABEL)).toEqual(datasetsDataAbsoluteTotal.get(FREE_MONEY_LABEL)!.map((item, index) => toFractionDigits(item / usdData[index])));
        });
    });

    describe('case 4, bond with decreasing body', () => {
        const asset1: TAsset = {
            ticker: 'bond',
            amount: 2,
            isBond: true,
            isUsd: false,
            buyDate: dates[0],
            data: [
                {
                    date: dates[0],
                    values: {
                        current: 999,
                        bond: {
                            currentNkd: 5,
                            nominalNkd: 10,
                            nominalValue: 1000,
                        },
                    },
                },
                {
                    date: dates[1],
                    values: {
                        current: 502,
                        bond: {
                            currentNkd: 0,
                            nominalNkd: 7,
                            nominalValue: 500,
                        },
                    },
                },
                {
                    date: dates[2],
                    values: {
                        current: 492,
                        bond: {
                            currentNkd: 4,
                            nominalNkd: 7,
                            nominalValue: 500,
                        },
                    },
                },
                {
                    date: dates[3],
                    values: {
                        current: 249,
                        bond: {
                            currentNkd: 2,
                            nominalNkd: 7,
                            nominalValue: 250,
                        },
                    },
                },
                {
                    date: dates[4],
                    values: {
                        current: 253,
                        bond: {
                            currentNkd: 0,
                            nominalNkd: 7,
                            nominalValue: 250,
                        },
                    },
                },
            ],
        };

        const asset2: TAsset = {
            ticker: 'stock',
            amount: 3,
            isBond: false,
            isUsd: false,
            buyDate: dates[2],
            data: [
                {
                    date: dates[2],
                    values: {
                        current: 700,
                    },
                },
                {
                    date: dates[3],
                    values: {
                        current: 750,
                    },
                },
                {
                    date: dates[4],
                    values: {
                        current: 800,
                    },
                },
                {
                    date: dates[5],
                    values: {
                        current: 850,
                    },
                },
            ],
        };

        const assets = [
            asset1,
            asset2,
        ];

        beforeEach(async () => {
            datasetsDataAbsoluteTotal = await calcDatasetsData(assets, calcOptionsBase);
        });

        test('absolute-total calc method', async () => {
            const datasetsData = datasetsDataAbsoluteTotal;

            expect(datasetsData.get(assets[0])).toEqual([
                2008, // (5 + 999) * 2
                1004, // (502 + 0) * 2
                992, // (492 + 4) * 2
                502, // (249 + 2) * 2
                NaN,
                NaN,
            ]);

            expect(datasetsData.get(assets[1])).toEqual([
                NaN,
                NaN,
                2100, // 700 * 3
                2250, // 750 * 3
                2400, // 800 * 3
                2550, // 850 * 3
            ]);

            expect(datasetsData.get(TOTAL_LABEL)).toMatchSnapshot('TOTAL_LABEL');
            expect(datasetsData.get(OWN_MONEY_LABEL)).toMatchSnapshot('OWN_MONEY_LABEL');
            expect(datasetsData.get(EARNED_MONEY_LABEL)).toMatchSnapshot('EARNED_MONEY_LABEL');
            expect(datasetsData.get(FREE_MONEY_LABEL)).toMatchSnapshot('FREE_MONEY_LABEL');
            expect(datasetsData.get(BANK_DEPOSIT_LABEL)).toMatchSnapshot('BANK_DEPOSIT_LABEL');
            expect(datasetsData.get(INDEX_FUND_LABEL)).toMatchSnapshot('INDEX_FUND_LABEL');
        });

        test('absolute calc method', async () => {
            const calcOptions = extendObject(calcOptionsBase, {
                method: CALC_METHODS.ABSOLUTE,
            });
            const datasetsData = await calcDatasetsData(assets, calcOptions);

            expect(datasetsData.get(assets[0])).toEqual([
                0,
                16, // ((500 + 10 + 502) - 1004) * 2
                4, // ((500 + 10 + 496) - 1004) * 2
                28, // ((500 + 250 + 10 + 7 + 251) - 1004) * 2
                NaN,
                NaN,
            ]);

            expect(datasetsData.get(assets[1])).toEqual([
                NaN,
                NaN,
                0,
                150, // 50 * 3
                300, // 100 * 3
                450, // 150 * 3
            ]);

            expect(datasetsData.get(TOTAL_LABEL)).toMatchSnapshot('TOTAL_LABEL');
            expect(datasetsData.get(BANK_DEPOSIT_LABEL)).toMatchSnapshot('BANK_DEPOSIT_LABEL');
            expect(datasetsData.get(INDEX_FUND_LABEL)).toMatchSnapshot('INDEX_FUND_LABEL');

            // The remaining datasets are the same as for the absolute-total calc method.
            expect(datasetsData.get(OWN_MONEY_LABEL)).toEqual(datasetsDataAbsoluteTotal.get(OWN_MONEY_LABEL));
            expect(datasetsData.get(EARNED_MONEY_LABEL)).toEqual(datasetsDataAbsoluteTotal.get(EARNED_MONEY_LABEL));
            expect(datasetsData.get(FREE_MONEY_LABEL)).toEqual(datasetsDataAbsoluteTotal.get(FREE_MONEY_LABEL));
        });
    });
});
