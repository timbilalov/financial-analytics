import {
    dateFormat,
    debounce,
    deepClone,
    errorHandler, extendObject,
    isArraysSimilar, isEmptyString,
    isLabelCommon,
    isObject,
    isObjectsEqual,
    toFractionDigits,
} from "@helpers";
import {BANK_DEPOSIT_LABEL, EXPORT_HREF_PARAM_NAME, OWN_MONEY_LABEL, TOTAL_LABEL} from "@constants";

describe('helpers', function () {
    test('dateFormat', function () {
        const dateUTC1 = 1577836800000; // 2020.01.01
        const dateUTC2 = 1607525676469; // 2020.12.09
        const wrongDateNumber = 2145;
        const wrongDateFormat = 'bla bla bla';

        expect(dateFormat(dateUTC1)).toBe('2020.01.01');
        expect(dateFormat(dateUTC1, 'YYYY')).toBe('2020');
        expect(dateFormat(dateUTC1 / 1000)).toBe('2020.01.01');

        expect(dateFormat(dateUTC2)).toBe('2020.12.09');
        expect(dateFormat(dateUTC2, 'DD--MM')).toBe('09--12');

        expect(dateFormat(wrongDateNumber)).toBe('1970.01.01');
        expect(typeof dateFormat(dateUTC1, wrongDateFormat)).toBe('string');
    });

    test('errorHandler', function () {
        const consoleSpy = jest.spyOn(console, 'log');

        expect(() => errorHandler()).not.toThrow();
        expect(() => errorHandler('something')).not.toThrow();

        expect(consoleSpy).toHaveBeenCalledTimes(2);
    });

    test('deepClone', function () {
        const object1 = {
            a: 1,
            b: '2',
            c: {
                d: 'd',
            },
        };
        const array1 = [
            1,
            '2',
            'some-text',
            object1,
        ]

        const object2 = deepClone(object1);
        const array2 = deepClone(array1);

        expect(object2).toStrictEqual(object1);
        expect(object2 === object1).toEqual(false);
        expect(object2 == object1).toEqual(false);

        expect(array2).toStrictEqual(array1);
        expect(array2 === array1).toEqual(false);
        expect(array2 == array1).toEqual(false);
    });

    test('isObjectsEqual', function () {
        const innerObject = {
            single: 'value',
        };
        const object1 = {
            a: 1,
            b: '2',
            c: {
                d: 'd',
                e: 100,
            },
            f: innerObject,
        };
        const object2 = {
            f: innerObject,
            c: {
                e: 100,
                d: 'd',
            },
            b: '2',
            a: 1,
        };
        const object3 = {
            a: 1,
            b: '2',
        };
        const object4 = {
            a: 2,
            b: '3',
        };

        expect(object2).toStrictEqual(object1);
        expect(isObjectsEqual(object1, object2)).toEqual(true);
        expect(object2 === object1).toEqual(false);
        expect(object2 == object1).toEqual(false);

        expect(isObjectsEqual(object1, object3)).toEqual(false);
        expect(isObjectsEqual(object2, object3)).toEqual(false);
        expect(isObjectsEqual(object3, object4)).toEqual(false);
    });

    test('isArraysSimilar', function () {
        const innerObject = {
            single: 'value',
        };
        const array1 = [
            1,
            '2',
            1,
            {
                d: 'd',
                e: 100,
            },
            innerObject,
            '2',
            '2',
        ];
        const array2 = [
            '2',
            innerObject,
            {
                e: 100,
                d: 'd',
            },
            '2',
            1,
            '2',
            1,
        ];
        const array3 = [
            1,
            '2',
            {
                foo: 'bar',
            },
        ];
        const array4 = [
            1,
            '2',
            {
                foo: 'bar2',
            },
        ];

        expect(array2).not.toStrictEqual(array1);
        expect(isArraysSimilar(array1, array2)).toEqual(true);
        expect(array2 === array1).toEqual(false);
        expect(array2 == array1).toEqual(false);

        expect(isArraysSimilar(array1, array3)).toEqual(false);
        expect(isArraysSimilar(array2, array3)).toEqual(false);
        expect(isArraysSimilar(array3, array4)).toEqual(false);
    });

    test('debounce', function (done) {
        const func = jest.fn();
        const debouncedFunc = debounce(func, 300);
        const timeoutFunc = jest.fn(debouncedFunc);
        const times = 5;

        for (let i = 0; i < times; i++) {
            setTimeout(timeoutFunc, i * 20);
        }

        setTimeout(function () {
            expect(timeoutFunc).toHaveBeenCalledTimes(times);
            expect(func).toHaveBeenCalledTimes(1);
            done();
        }, 500);
    });

    test('isLabelCommon', function () {
        expect(isLabelCommon(TOTAL_LABEL)).toEqual(true);
        expect(isLabelCommon(BANK_DEPOSIT_LABEL)).toEqual(true);
        expect(isLabelCommon(OWN_MONEY_LABEL)).toEqual(true);
        expect(isLabelCommon(TOTAL_LABEL.toUpperCase())).toEqual(true);
        expect(isLabelCommon(TOTAL_LABEL.toLowerCase())).toEqual(true);
        expect(isLabelCommon('some-label')).toEqual(false);
        expect(isLabelCommon('BAC')).toEqual(false);
    });

    test('isObject', function () {
        expect(isObject(1234)).toBe(false);
        expect(isObject(undefined)).toBe(false);
        expect(isObject(null)).toBe(false);
        expect(isObject('str')).toBe(false);
        expect(isObject([1, 's', 2])).toBe(false);
        expect(isObject(true)).toBe(false);
        expect(isObject(false)).toBe(false);
        expect(isObject(function() { return 2 })).toBe(false);

        expect(isObject({ a: 1 })).toBe(true);
        expect(isObject({ a: 1, b: { c: 'str' } })).toBe(true);
    });

    test('isEmptyString', function () {
        expect(isEmptyString('')).toBe(true);
        expect(isEmptyString(' ')).toBe(true);
        expect(isEmptyString('abc')).toBe(false);
    });

    test('extendObject', function () {
        const objectBase = {
            foo: 'bar',
            another: {
                a: 2,
            },
        };

        expect(extendObject(objectBase, {
            foo: 'not-foo',
        })).toEqual({
            foo: 'not-foo',
            another: {
                a: 2,
            },
        });

        expect(extendObject(objectBase, {
            another: {
                a: 4,
            },
        })).toEqual({
            foo: 'bar',
            another: {
                a: 4,
            },
        });
    });

    test('toFractionDigits', function () {
        expect(toFractionDigits(28.846153846)).toBe(28.8462);

        expect(toFractionDigits(28.846153846, 4)).toBe(28.8462);
        expect(toFractionDigits(23.076923077, 4)).toBe(23.0769);
        expect(toFractionDigits(6.923076923, 4)).toBe(6.9231);

        expect(toFractionDigits(28.846153846, 5)).toBe(28.84615);
        expect(toFractionDigits(23.076923077, 5)).toBe(23.07692);
        expect(toFractionDigits(6.923076923, 5)).toBe(6.92308);

        expect(toFractionDigits('str', 2)).toBe(NaN);
        expect(toFractionDigits(NaN, 4)).toBe(NaN);
    });
});
