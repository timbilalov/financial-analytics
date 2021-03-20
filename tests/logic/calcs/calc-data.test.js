import {calcData} from "@logic";
import {usdData, dates, valuesData} from "../../constants";
import {CALC_CURRENCIES, CALC_METHODS} from "@constants";

describe('calc-data', function () {
    test('should return an empty array if method isnt supported', function () {
        const result = calcData();

        expect(result).toEqual([]);
    });

    test('should return same result for different amount, for relative methods', function () {
        const arguments_1_1 = ['tst', valuesData, 1, false, CALC_METHODS.RELATIVE, usdData, CALC_CURRENCIES.RUB, false];
        const arguments_1_2 = ['tst', valuesData, 7, false, CALC_METHODS.RELATIVE, usdData, CALC_CURRENCIES.RUB, false];
        const arguments_2_1 = ['tst', valuesData, 3, false, CALC_METHODS.RELATIVE, usdData, CALC_CURRENCIES.USD, false];
        const arguments_2_2 = ['tst', valuesData, 38, false, CALC_METHODS.RELATIVE, usdData, CALC_CURRENCIES.USD, false];
        const arguments_3_1 = ['tst', valuesData, 4, false, CALC_METHODS.RELATIVE, usdData, CALC_CURRENCIES.RUB, true];
        const arguments_3_2 = ['tst', valuesData, 9, false, CALC_METHODS.RELATIVE, usdData, CALC_CURRENCIES.RUB, true];
        const arguments_4_1 = ['tst', valuesData, 2, true, CALC_METHODS.RELATIVE, usdData, CALC_CURRENCIES.RUB, true];
        const arguments_4_2 = ['tst', valuesData, 10, true, CALC_METHODS.RELATIVE, usdData, CALC_CURRENCIES.RUB, true];

        const arguments_5_1 = ['tst', valuesData, 1, false, CALC_METHODS.RELATIVE_ANNUAL, usdData, CALC_CURRENCIES.RUB, false];
        const arguments_5_2 = ['tst', valuesData, 7, false, CALC_METHODS.RELATIVE_ANNUAL, usdData, CALC_CURRENCIES.RUB, false];
        const arguments_6_1 = ['tst', valuesData, 3, false, CALC_METHODS.RELATIVE_ANNUAL, usdData, CALC_CURRENCIES.USD, false];
        const arguments_6_2 = ['tst', valuesData, 38, false, CALC_METHODS.RELATIVE_ANNUAL, usdData, CALC_CURRENCIES.USD, false];
        const arguments_7_1 = ['tst', valuesData, 4, false, CALC_METHODS.RELATIVE_ANNUAL, usdData, CALC_CURRENCIES.RUB, true];
        const arguments_7_2 = ['tst', valuesData, 9, false, CALC_METHODS.RELATIVE_ANNUAL, usdData, CALC_CURRENCIES.RUB, true];
        const arguments_8_1 = ['tst', valuesData, 2, true, CALC_METHODS.RELATIVE_ANNUAL, usdData, CALC_CURRENCIES.RUB, true];
        const arguments_8_2 = ['tst', valuesData, 10, true, CALC_METHODS.RELATIVE_ANNUAL, usdData, CALC_CURRENCIES.RUB, true];

        expect(calcData.apply(null, arguments_1_1)).toEqual(calcData.apply(null, arguments_1_2));
        expect(calcData.apply(null, arguments_2_1)).toEqual(calcData.apply(null, arguments_2_2));
        expect(calcData.apply(null, arguments_3_1)).toEqual(calcData.apply(null, arguments_3_2));
        expect(calcData.apply(null, arguments_4_1)).toEqual(calcData.apply(null, arguments_4_2));

        expect(calcData.apply(null, arguments_5_1)).toEqual(calcData.apply(null, arguments_5_2));
        expect(calcData.apply(null, arguments_6_1)).toEqual(calcData.apply(null, arguments_6_2));
        expect(calcData.apply(null, arguments_7_1)).toEqual(calcData.apply(null, arguments_7_2));
        expect(calcData.apply(null, arguments_8_1)).toEqual(calcData.apply(null, arguments_8_2));

        expect(calcData.apply(null, arguments_1_1)).toEqual(calcData.apply(null, arguments_5_1));
        expect(calcData.apply(null, arguments_1_2)).toEqual(calcData.apply(null, arguments_5_2));
        expect(calcData.apply(null, arguments_2_1)).toEqual(calcData.apply(null, arguments_6_1));
        expect(calcData.apply(null, arguments_2_2)).toEqual(calcData.apply(null, arguments_6_2));
        expect(calcData.apply(null, arguments_3_1)).toEqual(calcData.apply(null, arguments_7_1));
        expect(calcData.apply(null, arguments_3_2)).toEqual(calcData.apply(null, arguments_7_2));
        expect(calcData.apply(null, arguments_4_1)).toEqual(calcData.apply(null, arguments_8_1));
        expect(calcData.apply(null, arguments_4_2)).toEqual(calcData.apply(null, arguments_8_2));
    });

    describe('should return a flat array of values', function () {
        describe('relative method', function () {
            test('default calc', function () {
                expect(calcData('tst', valuesData, 1, false, CALC_METHODS.RELATIVE, usdData, CALC_CURRENCIES.RUB, false)).toEqual([
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

            test('with taxes', function () {
                expect(calcData('tst', valuesData, 1, false, CALC_METHODS.RELATIVE, usdData, CALC_CURRENCIES.RUB, true)).toEqual([
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

            test('rub to usd currency', function () {
                expect(calcData('tst', valuesData, 1, false, CALC_METHODS.RELATIVE, usdData, CALC_CURRENCIES.USD, false)).toEqual([
                    {
                        value: 0,
                        date: dates[0],
                    },
                    {
                        value: 390.1961, // (20 / 51 - 4 / 50) / (4 / 50) * 100
                        date: dates[1],
                    },
                    {
                        value: -268.2692, // (-7 / 52 - 4 / 50) / (4 / 50) * 100
                        date: dates[2],
                    },
                    {
                        value: 253.7736, // (15 / 53 - 4 / 50) / (4 / 50) * 100
                        date: dates[3],
                    },
                ]);
            });

            test('usd to rub currency', function () {
                expect(calcData('tst', valuesData, 1, true, CALC_METHODS.RELATIVE, usdData, CALC_CURRENCIES.RUB, false)).toEqual([
                    {
                        value: 0,
                        date: dates[0],
                    },
                    {
                        value: 410, // (20 * 51 - 4 * 50) / (4 * 50) * 100
                        date: dates[1],
                    },
                    {
                        value: -282, // (-7 * 52 - 4 * 50) / (4 * 50) * 100
                        date: dates[2],
                    },
                    {
                        value: 297.5, // (15 * 53 - 4 * 50) / (4 * 50) * 100
                        date: dates[3],
                    },
                ]);
            });
        });

        describe('absolute method', function () {
            test('default calc', function () {
                expect(calcData('tst', valuesData, 3, false, CALC_METHODS.ABSOLUTE, usdData, CALC_CURRENCIES.RUB, false)).toEqual([
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

            test('with taxes', function () {
                expect(calcData('tst', valuesData, 6, false, CALC_METHODS.ABSOLUTE, usdData, CALC_CURRENCIES.RUB, true)).toEqual([
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

            test('rub to usd currency', function () {
                expect(calcData('tst', valuesData, 1, false, CALC_METHODS.ABSOLUTE, usdData, CALC_CURRENCIES.USD, false)).toEqual([
                    {
                        value: 0,
                        date: dates[0],
                    },
                    {
                        value: 0.3122, // 20 / 51 - 4 / 50
                        date: dates[1],
                    },
                    {
                        value: -0.2146, // -7 / 52 - 4 / 50
                        date: dates[2],
                    },
                    {
                        value: 0.2030, // 15 / 53 - 4 / 50
                        date: dates[3],
                    },
                ]);
            });

            test('usd to rub currency', function () {
                expect(calcData('tst', valuesData, 2, true, CALC_METHODS.ABSOLUTE, usdData, CALC_CURRENCIES.RUB, false)).toEqual([
                    {
                        value: 0,
                        date: dates[0],
                    },
                    {
                        value: 1640, // (20 * 51 - 4 * 50) * 2
                        date: dates[1],
                    },
                    {
                        value: -1128, // (-7 * 52 - 4 * 50) * 2
                        date: dates[2],
                    },
                    {
                        value: 1190, // (15 * 53 - 4 * 50) * 2
                        date: dates[3],
                    },
                ]);
            });
        });

        describe('absolute-total method', function () {
            test('default calc', function () {
                expect(calcData('tst', valuesData, 13, false, CALC_METHODS.ABSOLUTE_TOTAL, usdData, CALC_CURRENCIES.RUB, false)).toEqual([
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

            test('with taxes', function () {
                expect(calcData('tst', valuesData, 16, false, CALC_METHODS.ABSOLUTE_TOTAL, usdData, CALC_CURRENCIES.RUB, true)).toEqual([
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

            test('rub to usd currency', function () {
                expect(calcData('tst', valuesData, 20, false, CALC_METHODS.ABSOLUTE_TOTAL, usdData, CALC_CURRENCIES.USD, false)).toEqual([
                    {
                        value: 1.6, // 4 / 50 * 20
                        date: dates[0],
                    },
                    {
                        value: 7.8431, // (20 / 51) * 20
                        date: dates[1],
                    },
                    {
                        value: -2.6923, // (-7 / 52) * 20
                        date: dates[2],
                    },
                    {
                        value: 5.6604, // (15 / 53) * 20
                        date: dates[3],
                    },
                ]);
            });

            test('usd to rub currency', function () {
                expect(calcData('tst', valuesData, 4, true, CALC_METHODS.ABSOLUTE_TOTAL, usdData, CALC_CURRENCIES.RUB, false)).toEqual([
                    {
                        value: 800, // (4 * 50) * 4
                        date: dates[0],
                    },
                    {
                        value: 4080, // (20 * 51) * 4
                        date: dates[1],
                    },
                    {
                        value: -1456, // (-7 * 52) * 4
                        date: dates[2],
                    },
                    {
                        value: 3180, // (15 * 53) * 4
                        date: dates[3],
                    },
                ]);
            });
        });
    });
});
