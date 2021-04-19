import {calcAssetData} from "@data";
import {
    assetBase,
    calcOptionsDefault,
    dates,
    moexDataRows,
    moexDataRowsUsd,
    usdData,
    valuesData
} from "@test-constants";
import {CALC_CURRENCIES, CALC_METHODS} from "@constants";
import {extendObject} from "@helpers";

declare const global: {
    fetch: unknown,
};

describe('calc-asset-data', function () {
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

    const calcOptionsTaxes = extendObject(calcOptionsDefault, {
        uses: {
            taxes: true,
        },
    });

    const calcOptionsUsd = extendObject(calcOptionsDefault, {
        currency: CALC_CURRENCIES.USD,
    });

    test('should return same result for different amount, for relative methods', async function () {
        const assetAmount7 = extendObject(assetBase, {
            amount: 7,
        });

        const assetUsd = extendObject(assetBase, {
            isUsd: true,
        });

        const assetUsdAmount5 = extendObject(assetUsd, {
            amount: 5,
        });

        const calcOptionsRelativeAnnual = extendObject(calcOptionsDefault, {
            method: CALC_METHODS.RELATIVE_ANNUAL,
        });

        const calcOptionsRelativeAnnualUsd = extendObject(calcOptionsRelativeAnnual, {
            currency: CALC_CURRENCIES.USD,
        });

        const calcOptionsRelativeAnnualTaxes = extendObject(calcOptionsRelativeAnnual, {
            uses: {
                taxes: true,
            },
        });

        expect(await calcAssetData(assetBase, calcOptionsDefault)).toEqual(await calcAssetData(assetAmount7, calcOptionsDefault));
        expect(await calcAssetData(assetBase, calcOptionsUsd)).toEqual(await calcAssetData(assetAmount7, calcOptionsUsd));
        expect(await calcAssetData(assetBase, calcOptionsTaxes)).toEqual(await calcAssetData(assetAmount7, calcOptionsTaxes));
        expect(await calcAssetData(assetUsd, calcOptionsDefault)).toEqual(await calcAssetData(assetUsdAmount5, calcOptionsDefault));

        expect(await calcAssetData(assetBase, calcOptionsRelativeAnnual)).toEqual(await calcAssetData(assetAmount7, calcOptionsRelativeAnnual));
        expect(await calcAssetData(assetBase, calcOptionsRelativeAnnualUsd)).toEqual(await calcAssetData(assetAmount7, calcOptionsRelativeAnnualUsd));
        expect(await calcAssetData(assetBase, calcOptionsRelativeAnnualTaxes)).toEqual(await calcAssetData(assetAmount7, calcOptionsRelativeAnnualTaxes));
        expect(await calcAssetData(assetUsd, calcOptionsRelativeAnnual)).toEqual(await calcAssetData(assetUsdAmount5, calcOptionsRelativeAnnual));

        expect(await calcAssetData(assetBase, calcOptionsDefault)).toEqual(await calcAssetData(assetAmount7, calcOptionsRelativeAnnual));
        expect(await calcAssetData(assetBase, calcOptionsUsd)).toEqual(await calcAssetData(assetAmount7, calcOptionsRelativeAnnualUsd));
        expect(await calcAssetData(assetBase, calcOptionsTaxes)).toEqual(await calcAssetData(assetAmount7, calcOptionsRelativeAnnualTaxes));
        expect(await calcAssetData(assetUsd, calcOptionsDefault)).toEqual(await calcAssetData(assetUsdAmount5, calcOptionsRelativeAnnual));
    });

    describe('should return a flat array of values', function () {
        describe('relative method', function () {
            test('default calc', async function () {
                expect(await calcAssetData(assetBase, calcOptionsDefault)).toEqual([
                    {
                        value: 0,
                        date: dates[0],
                    },
                    {
                        value: 400, // (20 - 4) / 4 * 100
                        date: dates[1],
                    },
                    {
                        value: -275, // (-7 - 4) / 4 * 100
                        date: dates[2],
                    },
                    {
                        value: 275, // (15 - 4) / 4 * 100
                        date: dates[3],
                    },
                ]);
            });

            test('with taxes', async function () {
                expect(await calcAssetData(assetBase, calcOptionsTaxes)).toEqual([
                    {
                        value: 0,
                        date: dates[0],
                    },
                    {
                        value: 348, // (20 - 4) / 4 * 100 * 0.87
                        date: dates[1],
                    },
                    {
                        value: -239.25, // (-7 - 4) / 4 * 100 * 0.87
                        date: dates[2],
                    },
                    {
                        value: 239.25, // (15 - 4) / 4 * 100 * 0.87
                        date: dates[3],
                    },
                ]);
            });

            test('rub to usd currency',  async function () {
                expect(await calcAssetData(assetBase, calcOptionsUsd)).toEqual([
                    {
                        value: 0,
                        date: dates[0],
                    },
                    {
                        value: 392.9577, // (20 / 71 - 4 / 70) / (4 / 70) * 100
                        date: dates[1],
                    },
                    {
                        value: -270.1389, // (-7 / 72 - 4 / 70) / (4 / 70) * 100
                        date: dates[2],
                    },
                    {
                        value: 259.5890, // (15 / 73 - 4 / 70) / (4 / 70) * 100
                        date: dates[3],
                    },
                ]);
            });

            test('usd to rub currency', async function () {
                const asset = extendObject(assetBase, {
                    isUsd: true,
                });

                expect(await calcAssetData(asset, calcOptionsDefault)).toEqual([
                    {
                        value: 0,
                        date: dates[0],
                    },
                    {
                        value: 407.1429, // (20 * 71 - 4 * 70) / (4 * 70) * 100
                        date: dates[1],
                    },
                    {
                        value: -280, // (-7 * 72 - 4 * 70) / (4 * 70) * 100
                        date: dates[2],
                    },
                    {
                        value: 291.0714, // (15 * 73 - 4 * 70) / (4 * 70) * 100
                        date: dates[3],
                    },
                ]);
            });
        });

        describe('absolute method', function () {
            const calcOptionsAbsolute = extendObject(calcOptionsDefault, {
                method: CALC_METHODS.ABSOLUTE,
            });

            test('default calc', async function () {
                const asset = extendObject(assetBase, {
                    amount: 3,
                });

                expect(await calcAssetData(asset, calcOptionsAbsolute)).toEqual([
                    {
                        value: 0,
                        date: dates[0],
                    },
                    {
                        value: 48, // (20 - 4) * 3
                        date: dates[1],
                    },
                    {
                        value: -33, // (-7 - 4) * 3
                        date: dates[2],
                    },
                    {
                        value: 33, // (15 - 4) * 3
                        date: dates[3],
                    },
                ]);
            });

            test('with taxes', async function () {
                const asset = extendObject(assetBase, {
                    amount: 6,
                });

                const calcOptions = extendObject(calcOptionsAbsolute, {
                    uses: {
                        taxes: true,
                    },
                });

                expect(await calcAssetData(asset, calcOptions)).toEqual([
                    {
                        value: 0,
                        date: dates[0],
                    },
                    {
                        value: 83.52, // (20 - 4) * 6 * 0.87
                        date: dates[1],
                    },
                    {
                        value: -57.42, // (-7 - 4) * 6 * 0.87
                        date: dates[2],
                    },
                    {
                        value: 57.42, // (15 - 4) * 6 * 0.87
                        date: dates[3],
                    },
                ]);
            });

            test('rub to usd currency', async function () {
                const calcOptions = extendObject(calcOptionsAbsolute, {
                    currency: CALC_CURRENCIES.USD,
                });

                expect(await calcAssetData(assetBase, calcOptions)).toEqual([
                    {
                        value: 0,
                        date: dates[0],
                    },
                    {
                        value: 0.2245, // 20 / 71 - 4 / 70
                        date: dates[1],
                    },
                    {
                        value: -0.1544, // -7 / 72 - 4 / 70
                        date: dates[2],
                    },
                    {
                        value: 0.1483, // 15 / 73 - 4 / 70
                        date: dates[3],
                    },
                ]);
            });

            test('usd to rub currency', async function () {
                const asset = extendObject(assetBase, {
                    amount: 2,
                    isUsd: true,
                });

                expect(await calcAssetData(asset, calcOptionsAbsolute)).toEqual([
                    {
                        value: 0,
                        date: dates[0],
                    },
                    {
                        value: 2280, // (20 * 71 - 4 * 70) * 2
                        date: dates[1],
                    },
                    {
                        value: -1568, // (-7 * 72 - 4 * 70) * 2
                        date: dates[2],
                    },
                    {
                        value: 1630, // (15 * 73 - 4 * 70) * 2
                        date: dates[3],
                    },
                ]);
            });
        });

        describe('absolute-total method', function () {
            const calcOptionsAbsoluteTotal = extendObject(calcOptionsDefault, {
                method: CALC_METHODS.ABSOLUTE_TOTAL,
            });

            test('default calc', async function () {
                const asset = extendObject(assetBase, {
                    amount: 13,
                });

                expect(await calcAssetData(asset, calcOptionsAbsoluteTotal)).toEqual([
                    {
                        value: 52, // 4 * 13
                        date: dates[0],
                    },
                    {
                        value: 260, // 20 * 13
                        date: dates[1],
                    },
                    {
                        value: -91, // -7 * 13
                        date: dates[2],
                    },
                    {
                        value: 195, // 15 * 13
                        date: dates[3],
                    },
                ]);
            });

            test('with taxes', async function () {
                const asset = extendObject(assetBase, {
                    amount: 16,
                });

                const calcOptions = extendObject(calcOptionsAbsoluteTotal, {
                    uses: {
                        taxes: true,
                    },
                });

                expect(await calcAssetData(asset, calcOptions)).toEqual([
                    {
                        value: 64, // 4 * 16
                        date: dates[0],
                    },
                    {
                        value: 286.72, // (20 - 4) * 16 * 0.87 + 4 * 16
                        date: dates[1],
                    },
                    {
                        value: -89.12, // (-7 - 4) * 16 * 0.87 + 4 * 16
                        date: dates[2],
                    },
                    {
                        value: 217.12, // (15 - 4) * 16 * 0.87 + 4 * 16
                        date: dates[3],
                    },
                ]);
            });

            test('rub to usd currency', async function () {
                const asset = extendObject(assetBase, {
                    amount: 20,
                });

                const calcOptions = extendObject(calcOptionsAbsoluteTotal, {
                    currency: CALC_CURRENCIES.USD,
                });

                expect(await calcAssetData(asset, calcOptions)).toEqual([
                    {
                        value: 1.1429, // 4 / 70 * 20
                        date: dates[0],
                    },
                    {
                        value: 5.6338, // (20 / 71) * 20
                        date: dates[1],
                    },
                    {
                        value: -1.9444, // (-7 / 72) * 20
                        date: dates[2],
                    },
                    {
                        value: 4.1096, // (15 / 73) * 20
                        date: dates[3],
                    },
                ]);
            });

            test('usd to rub currency', async function () {
                const asset = extendObject(assetBase, {
                    amount: 4,
                    isUsd: true,
                });

                expect(await calcAssetData(asset, calcOptionsAbsoluteTotal)).toEqual([
                    {
                        value: 1120, // (4 * 70) * 4
                        date: dates[0],
                    },
                    {
                        value: 5680, // (20 * 71) * 4
                        date: dates[1],
                    },
                    {
                        value: -2016, // (-7 * 72) * 4
                        date: dates[2],
                    },
                    {
                        value: 4380, // (15 * 73) * 4
                        date: dates[3],
                    },
                ]);
            });
        });
    });
});
