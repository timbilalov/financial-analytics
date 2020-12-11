import {
    checkImportUrl,
    dateFormat, debounce,
    deepClone,
    errorHandler,
    isArraysSimilar, isLabelCommon,
    isObjectsEqual,
    makeExportUrl
} from "@helpers";
import {BANK_DEPOSIT_LABEL, EXPORT_HREF_PARAM_NAME, OWN_MONEY_LABEL, TOTAL_LABEL} from "@constants";

describe('Helpers', function () {
    test('dateFormat', function () {
        const dateUTC1 = 1577836800000; // 2020.01.01
        const dateUTC2 = 1607525676469; // 2020.12.09

        expect(dateFormat(dateUTC1)).toBe('2020.01.01');
        expect(dateFormat(dateUTC1, 'YYYY')).toBe('2020');

        expect(dateFormat(dateUTC2)).toBe('2020.12.09');
        expect(dateFormat(dateUTC2, 'DD--MM')).toBe('09--12');
    });

    test('errorHandler', function () {
        const consoleSpy = jest.spyOn(console, 'log');

        expect(() => errorHandler()).not.toThrow();
        expect(() => errorHandler('something')).not.toThrow();
        expect(() => errorHandler({
            some: 'value',
        })).not.toThrow();

        expect(consoleSpy).toHaveBeenCalledTimes(3);
    });

    test('makeExportUrl', async function () {
        const {href, hash} = window.location;

        global.navigator.clipboard = {
            writeText: jest.fn(() => new Promise(resolve => setTimeout(resolve, 10))),
        };

        const url = await makeExportUrl();

        expect(() => makeExportUrl()).not.toThrow();
        expect(typeof url).toEqual('string');
        expect(url.length).toBeGreaterThan(1);
        expect(url.indexOf(EXPORT_HREF_PARAM_NAME)).toEqual(href.length - hash.length + 1);
        expect(url.split('').filter(symbol => symbol === '=').length).toEqual(1);
    });

    test('checkImportUrl', function () {
        expect(() => checkImportUrl()).not.toThrow();
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

        expect(object2).toStrictEqual(object1);
        expect(isObjectsEqual(object1, object2)).toEqual(true);
        expect(object2 === object1).toEqual(false);
        expect(object2 == object1).toEqual(false);
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

        expect(array2).not.toStrictEqual(array1);
        expect(isArraysSimilar(array1, array2)).toEqual(true);
        expect(array2 === array1).toEqual(false);
        expect(array2 == array1).toEqual(false);
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
});
