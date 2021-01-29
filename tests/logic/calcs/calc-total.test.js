import {calcTotal} from "@logic";
import {datasets, dates, options} from "../../constants";
import {CALC_CURRENCIES, CALC_METHODS} from "@constants";

describe('calc-total', function () {
    test('relative method', function () {
        expect(calcTotal(datasets, Object.assign({}, options, {
            calcMethod: CALC_METHODS.RELATIVE,
        }))).toMatchObject([
            {
                value: 0,
                date: dates[0],
            },
            {
                value: 10, // 10 + 0
                date: dates[1],
            },
            {
                value: 18, // 20 + (-2)
                date: dates[2],
            },
            {
                value: 34, // 30 + 4
                date: dates[3],
            },
        ]);
    });

    test('relative-annual method', function () {
        expect(calcTotal(datasets, Object.assign({}, options, {
            calcMethod: CALC_METHODS.RELATIVE_ANNUAL,
        }))).toMatchObject([
            {
                value: 0,
                date: dates[0],
            },
            {
                value: 5, // (10 + 0) / 2
                date: dates[1],
            },
            {
                value: 9, // (20 + (-2)) / 2
                date: dates[2],
            },
            {
                value: 17, // (30 + 4) / 2
                date: dates[3],
            },
        ]);
    });

    test('absolute method', function () {
        expect(calcTotal(datasets, Object.assign({}, options, {
            calcMethod: CALC_METHODS.ABSOLUTE,
        }))).toMatchObject([
            {
                value: 0,
                date: dates[0],
            },
            {
                value: 10, // 10 + 0
                date: dates[1],
            },
            {
                value: 18, // 20 + (-2)
                date: dates[2],
            },
            {
                value: 34, // 30 + 4
                date: dates[3],
            },
        ]);
    });

    test('absolute-total method', function () {
        expect(calcTotal(datasets, Object.assign({}, options, {
            calcMethod: CALC_METHODS.ABSOLUTE_TOTAL,
        }))).toMatchObject([
            {
                value: 0,
                date: dates[0],
            },
            {
                value: 10, // 10 + 0
                date: dates[1],
            },
            {
                value: 18, // 20 + (-2)
                date: dates[2],
            },
            {
                value: 34, // 30 + 4
                date: dates[3],
            },
        ]);
    });
});
