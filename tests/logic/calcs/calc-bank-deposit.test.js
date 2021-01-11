import {calcBankDeposit} from "@logic";
import {datasets, dates, options} from "../../constants";
import {CALC_METHODS} from "@constants";

describe('calc-bank-deposit', function () {
    test('right calc for relative method', function () {
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

    test('right calc for relative-annual method', function () {
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

    test('right calc for absolute method', function () {
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

    test('right calc for absolute-total method', function () {
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
