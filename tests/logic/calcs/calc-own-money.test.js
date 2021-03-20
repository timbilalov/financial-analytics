import {calcOwnMoney, calcTotal} from "@logic";
import {usdData, dates, valuesData, valuesDataWithMissingItem, datasets, options} from "../../constants";
import {CALC_CURRENCIES, CALC_METHODS} from "@constants";
import {deepClone} from "@helpers";

describe('calc-own-money', function () {
    const datasetsUsd = deepClone(datasets).map(item => Object.assign(item, {
        isUsd: true,
    }));

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
            const result1 = calcOwnMoney(datasets, Object.assign({}, options, {
                calcMethod: CALC_METHODS.ABSOLUTE_TOTAL,
                currency: CALC_CURRENCIES.RUB,
            }));
            const result2 = calcOwnMoney(datasetsUsd, Object.assign({}, options, {
                calcMethod: CALC_METHODS.ABSOLUTE_TOTAL,
                currency: CALC_CURRENCIES.RUB,
            }));

            expect(result1).toEqual(result2);
            expect(result1).toEqual([
                {
                    value: 100, // 100 + 0
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
            const result1 = calcOwnMoney(datasets, Object.assign({}, options, {
                calcMethod: CALC_METHODS.ABSOLUTE_TOTAL,
                calcCurrency: CALC_CURRENCIES.USD,
            }));
            const result2 = calcOwnMoney(datasetsUsd, Object.assign({}, options, {
                calcMethod: CALC_METHODS.ABSOLUTE_TOTAL,
                calcCurrency: CALC_CURRENCIES.USD,
            }));

            expect(result1).toEqual(result2);
            expect(result1).toEqual([
                {
                    value: 100, // 100 / 50 * 50
                    date: dates[0],
                },
                {
                    value: 148.0392, // 100 / 51 * 50 + 50 / 51 * 51
                    date: dates[1],
                },
                {
                    value: 145.1923, // 100 / 52 * 50 + 50 / 52 * 51
                    date: dates[2],
                },
                {
                    value: 142.4528, // 100 / 53 * 50 + 50 / 53 * 51
                    date: dates[3],
                },
            ]);
        });
    });
});
