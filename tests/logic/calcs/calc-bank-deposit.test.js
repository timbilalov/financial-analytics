import {calcBankDeposit} from "@logic";
import {datasets, dates, options} from "../../constants";
import {CALC_CURRENCIES, CALC_METHODS} from "@constants";

describe('calc-bank-deposit', function () {
    describe('rub currency', function () {
        test('relative method', function () {
            expect(calcBankDeposit(datasets, Object.assign({}, options, {
                calcMethod: CALC_METHODS.RELATIVE,
            }))).toMatchObject([
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

        test('relative-annual method', function () {
            expect(calcBankDeposit(datasets, Object.assign({}, options, {
                calcMethod: CALC_METHODS.RELATIVE_ANNUAL,
            }))).toMatchObject([
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

        test('absolute method', function () {
            expect(calcBankDeposit(datasets, Object.assign({}, options, {
                calcMethod: CALC_METHODS.ABSOLUTE,
            }))).toMatchObject([
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

        test('absolute-total method', function () {
            expect(calcBankDeposit(datasets, Object.assign({}, options, {
                calcMethod: CALC_METHODS.ABSOLUTE_TOTAL,
            }))).toMatchObject([
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
        const optionsUsd = Object.assign({}, options, {
            calcCurrency: CALC_CURRENCIES.USD,
        });

        test('relative method', function () {
            expect(calcBankDeposit(datasets, Object.assign({}, optionsUsd, {
                calcMethod: CALC_METHODS.RELATIVE,
            }))).toMatchObject([
                {
                    value: 0,
                    date: dates[0],
                },
                {
                    value: 0.0134, // (5 / 365 * 1) * 50 / 51
                    date: dates[1],
                },
                {
                    value: 0.0398, // (5 / 365 * 2) * 50 / 52 + (5 / 365 * 1) * 51 / 52
                    date: dates[2],
                },
                {
                    value: 0.0651, // (5 / 365 * 3) * 50 / 53 + (5 / 365 * 2) * 51 / 53
                    date: dates[3],
                },
            ]);
        });

        test('relative-annual method', function () {
            expect(calcBankDeposit(datasets, Object.assign({}, optionsUsd, {
                calcMethod: CALC_METHODS.RELATIVE_ANNUAL,
            }))).toMatchObject([
                {
                    value: 0,
                    date: dates[0],
                },
                {
                    value: 0.0134, // (5 / 365 * 1) * 50 / 51
                    date: dates[1],
                },
                {
                    value: 0.0263, // (5 / 365 * 2) * 50 / 52
                    date: dates[2],
                },
                {
                    value: 0.0388, // (5 / 365 * 3) * 50 / 53
                    date: dates[3],
                },
            ]);
        });

        test('absolute method', function () {
            expect(calcBankDeposit(datasets, Object.assign({}, optionsUsd, {
                calcMethod: CALC_METHODS.ABSOLUTE,
            }))).toMatchObject([
                {
                    value: 0,
                    date: dates[0],
                },
                {
                    value: 0.0134, // (100 * 0.05 / 365 * 1) * 50 / 51
                    date: dates[1],
                },
                {
                    value: 0.0331, // (100 * 0.05 / 365 * 2) * 50 / 52 + (50 * 0.05 / 365 * 1) * 51 / 52
                    date: dates[2],
                },
                {
                    value: 0.0520, // (100 * 0.05 / 365 * 3) * 50 / 53 + (50 * 0.05 / 365 * 2) * 51 / 53
                    date: dates[3],
                },
            ]);
        });

        test('absolute-total method', function () {
            expect(calcBankDeposit(datasets, Object.assign({}, optionsUsd, {
                calcMethod: CALC_METHODS.ABSOLUTE_TOTAL,
            }))).toMatchObject([
                {
                    value: 100,
                    date: dates[0],
                },
                {
                    value: 148.0526, // 100 * 50 / 51 + 50 + (100 * 0.05 / 365 * 1) * 50 / 51
                    date: dates[1],
                },
                {
                    value: 145.2254, // 100 * 50 / 52 + 50 * 51 / 52 + (100 * 0.05 / 365 * 2) * 50 / 52 + (50 * 0.05 / 365 * 1) * 51 / 52
                    date: dates[2],
                },
                {
                    value: 142.5048, // 100 * 50 / 53 + 50 * 51 / 53 + (100 * 0.05 / 365 * 3) * 50 / 53 + (50 * 0.05 / 365 * 2) * 51 / 53
                    date: dates[3],
                },
            ]);
        });
    });
});
