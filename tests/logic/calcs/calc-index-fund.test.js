import {calcIndexFund} from "@logic";
import {datasets, dates, options} from "../../constants";
import {CALC_CURRENCIES, CALC_METHODS} from "@constants";

describe('calc-index-fund', function () {
    describe('rub currency', function () {
        test('relative method', function () {
            expect(calcIndexFund(datasets, Object.assign({}, options, {
                calcMethod: CALC_METHODS.RELATIVE,
            }))).toMatchObject([
                {
                    value: 0,
                    date: dates[0],
                },
                {
                    value: 2.5, // ((4100 - 4000) / 4000 + (4100 - 4100) / 4100) * 100
                    date: dates[1],
                },
                {
                    value: 7.4390, // ((4200 - 4000) / 4000 + (4200 - 4100) / 4100) * 100
                    date: dates[2],
                },
                {
                    value: 12.3780, // ((4300 - 4000) / 4000 + (4300 - 4100) / 4100) * 100
                    date: dates[3],
                },
            ]);
        });

        test('relative-annual method', function () {
            expect(calcIndexFund(datasets, Object.assign({}, options, {
                calcMethod: CALC_METHODS.RELATIVE_ANNUAL,
            }))).toMatchObject([
                {
                    value: 0, // ((4000 - 4000) / 4000) / 1
                    date: dates[0],
                },
                {
                    value: 1.25, // (((4100 - 4000) / 4000 + (4100 - 4100) / 4100) / 2) * 100
                    date: dates[1],
                },
                {
                    value: 3.7195, // (((4200 - 4000) / 4000 + (4200 - 4100) / 4100) / 2) * 100
                    date: dates[2],
                },
                {
                    value: 6.1890, // (((4300 - 4000) / 4000 + (4300 - 4100) / 4100) / 2) * 100
                    date: dates[3],
                },
            ]);
        });

        test('absolute method', function () {
            expect(calcIndexFund(datasets, Object.assign({}, options, {
                calcMethod: CALC_METHODS.ABSOLUTE,
            }))).toMatchObject([
                {
                    value: 0, // (4000 - 4000) * 100 / 4000
                    date: dates[0],
                },
                {
                    value: 2.5, // (4100 - 4000) * 100 / 4000
                    date: dates[1],
                },
                {
                    value: 6.2195, // (4200 - 4000) * 100 / 4000 + (4200 - 4100) * 50 / 4100
                    date: dates[2],
                },
                {
                    value: 9.9390, // (4300 - 4000) * 100 / 4000 + (4300 - 4100) * 50 / 4100
                    date: dates[3],
                },
            ]);
        });

        test('absolute-total method', function () {
            expect(calcIndexFund(datasets, Object.assign({}, options, {
                calcMethod: CALC_METHODS.ABSOLUTE_TOTAL,
            }))).toMatchObject([
                {
                    value: 100, // 100 / 4000 * 4000
                    date: dates[0],
                },
                {
                    value: 152.5, // 100 / 4000 * 4100 + 50 / 4100 * 4100
                    date: dates[1],
                },
                {
                    value: 156.2195, // 100 / 4000 * 4200 + 50 / 4100 * 4200
                    date: dates[2],
                },
                {
                    value: 159.9390, // 100 / 4000 * 4300 + 50 / 4100 * 4300
                    date: dates[3],
                },
            ]);
        });
    });

    describe('usd currency', function () {
        const optionsUsd = Object.assign({}, options, {
            calcCurrency: CALC_CURRENCIES.USD,
        });

        test('relative method', function () {
            expect(calcIndexFund(datasets, Object.assign({}, optionsUsd, {
                calcMethod: CALC_METHODS.RELATIVE,
            }))).toMatchObject([
                {
                    value: 0,
                    date: dates[0],
                },
                {
                    value: 2.4510, // ((4100 - 4000) / 4000 * 50 / 51) * 100
                    date: dates[1],
                },
                {
                    value: 7.1998, // ((4200 - 4000) / 4000 * 50 / 52 + (4200 - 4100) / 4100 * 51 / 52) * 100
                    date: dates[2],
                },
                {
                    value: 11.7694, // ((4300 - 4000) / 4000 * 50 / 53 + (4300 - 4100) / 4100 * 51 / 53) * 100
                    date: dates[3],
                },
            ]);
        });

        test('relative-annual method', function () {
            expect(calcIndexFund(datasets, Object.assign({}, optionsUsd, {
                calcMethod: CALC_METHODS.RELATIVE_ANNUAL,
            }))).toMatchObject([
                {
                    value: 0,
                    date: dates[0],
                },
                {
                    value: 1.2255, // (((4100 - 4000) / 4000 * 50 / 51 + (4100 - 4100) / 4100 * 51 / 51) / 2) * 100
                    date: dates[1],
                },
                {
                    value: 3.5999, // (((4200 - 4000) / 4000 * 50 / 52 + (4200 - 4100) / 4100 * 51 / 52) / 2) * 100
                    date: dates[2],
                },
                {
                    value: 5.8847, // (((4300 - 4000) / 4000 * 50 / 53 + (4300 - 4100) / 4100 * 51 / 53) / 2) * 100
                    date: dates[3],
                },
            ]);
        });

        test('absolute method', function () {
            expect(calcIndexFund(datasets, Object.assign({}, optionsUsd, {
                calcMethod: CALC_METHODS.ABSOLUTE,
            }))).toMatchObject([
                {
                    value: 0,
                    date: dates[0],
                },
                {
                    value: 0.4902, // (4100 / 51 - 4000 / 50) * 100 / (4000 / 50)
                    date: dates[1],
                },
                {
                    value: 1.1961, // (4200 / 52 - 4000 / 50) * 100 / (4000 / 50) + (4200 / 52 - 4100 / 51) * 50 / (4100 / 51)
                    date: dates[2],
                },
                {
                    value: 1.8753, // (4300 / 53 - 4000 / 50) * 100 / (4000 / 50) + (4300 / 53 - 4100 / 51) * 50 / (4100 / 51)
                    date: dates[3],
                },
            ]);
        });

        test('absolute-total method', function () {
            expect(calcIndexFund(datasets, Object.assign({}, optionsUsd, {
                calcMethod: CALC_METHODS.ABSOLUTE_TOTAL,
            }))).toMatchObject([
                {
                    value: 100, // 100
                    date: dates[0],
                },
                {
                    value: 150.4902, // (4100 / 51) * 100 / (4000 / 50) + 50
                    date: dates[1],
                },
                {
                    value: 151.1961, // (4200 / 52) * 100 / (4000 / 50) + (4200 / 52) * 50 / (4100 / 51)
                    date: dates[2],
                },
                {
                    value: 151.8753, // (4300 / 53) * 100 / (4000 / 50) + (4300 / 53) * 50 / (4100 / 51)
                    date: dates[3],
                },
            ]);
        });
    });
});
