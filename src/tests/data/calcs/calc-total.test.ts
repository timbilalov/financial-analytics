import { calcTotal } from '@data';
import { calcOptionsDefault, datasets, dates } from '@test-constants';
import { CALC_METHODS } from '@constants';
import { extendObject } from '@helpers';

describe('calc-total', function () {
    test('relative method', function () {
        const result = calcTotal(datasets, calcOptionsDefault);

        expect(result).toMatchObject([
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
        const calcOptions = extendObject(calcOptionsDefault, {
            method: CALC_METHODS.RELATIVE_ANNUAL,
        });
        const result = calcTotal(datasets, calcOptions);

        expect(result).toMatchObject([
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
        const calcOptions = extendObject(calcOptionsDefault, {
            method: CALC_METHODS.ABSOLUTE,
        });
        const result = calcTotal(datasets, calcOptions);

        expect(result).toMatchObject([
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
        const calcOptions = extendObject(calcOptionsDefault, {
            method: CALC_METHODS.ABSOLUTE_TOTAL,
        });
        const result = calcTotal(datasets, calcOptions);

        expect(result).toMatchObject([
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
