import {calcOwnMoney, calcTotal} from "@logic";
import {usdData, dates, valuesData, valuesDataWithMissingItem, datasets, options} from "../../constants";
import {CALC_CURRENCIES, CALC_METHODS} from "@constants";

describe('calc-own-money', function () {
    test('should return an empty array for wrong arguments', function () {
        const result1 = calcOwnMoney();
        const result2 = calcOwnMoney(123);
        const result3 = calcOwnMoney([], 123);

        expect(result1).toEqual([]);
        expect(result2).toEqual([]);
        expect(result3).toEqual([]);
    });

    test('should return an empty array for methods other than absolute-total', function () {
        const result1 = calcOwnMoney(datasets, Object.assign({}, options, {
            calcMethod: CALC_METHODS.RELATIVE,
        }));
        const result2 = calcOwnMoney(datasets, Object.assign({}, options, {
            calcMethod: CALC_METHODS.RELATIVE_ANNUAL,
        }));
        const result3 = calcOwnMoney(datasets, Object.assign({}, options, {
            calcMethod: CALC_METHODS.ABSOLUTE,
        }));

        expect(result1).toEqual([]);
        expect(result2).toEqual([]);
        expect(result3).toEqual([]);
    });

    describe('should return an array of values', function () {
        test('rub', function () {
            expect(calcOwnMoney(datasets, Object.assign({}, options, {
                calcMethod: CALC_METHODS.ABSOLUTE_TOTAL,
            }))).toMatchObject([
                {
                    value: 100,
                    date: dates[0],
                },
                {
                    value: 150, // 100 + 50
                    date: dates[1],
                },
                {
                    value: 150, // 100 + 50
                    date: dates[2],
                },
                {
                    value: 150, // 100 + 50
                    date: dates[3],
                },
            ]);
        });

        test('usd', function () {
            expect(calcOwnMoney(datasets, Object.assign({}, options, {
                calcMethod: CALC_METHODS.ABSOLUTE_TOTAL,
                calcCurrency: CALC_CURRENCIES.USD,
            }))).toMatchObject([
                {
                    value: 100,
                    date: dates[0],
                },
                {
                    value: 148.0392, // 100 * 50 / 51 + 50
                    date: dates[1],
                },
                {
                    value: 145.1923, // 100 * 50 / 52 + 50 * 51 / 52
                    date: dates[2],
                },
                {
                    value: 142.4528, // 100 * 50 / 53 + 50 * 51 / 53
                    date: dates[3],
                },
            ]);
        });
    });
});
