import lz from 'lz-string';
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
        const wrongDateNumber = 2145;
        const wrongDateType = 'some text';
        const wrongDateType2 = {
            prop: 'some value',
        };
        const wrongDateFormat = 'bla bla bla';
        const wrongDateFormat2 = 1234;

        expect(dateFormat(dateUTC1)).toBe('2020.01.01');
        expect(dateFormat(dateUTC1, 'YYYY')).toBe('2020');
        expect(dateFormat(dateUTC1 / 1000)).toBe('2020.01.01');

        expect(dateFormat(dateUTC2)).toBe('2020.12.09');
        expect(dateFormat(dateUTC2, 'DD--MM')).toBe('09--12');

        expect(dateFormat(wrongDateNumber)).toBe('1970.01.01');
        expect(dateFormat(wrongDateType)).toBe(undefined);
        expect(dateFormat(wrongDateType2)).toBe(undefined);
        expect(typeof dateFormat(dateUTC1, wrongDateFormat)).toBe('string');
        expect(dateFormat(dateUTC1, wrongDateFormat2)).toBe(undefined);
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
        const urlToReload = checkImportUrl();

        const encodedString = 'N4IgZg9hIFwgRgQwE4gL5A'; // lz.compressToEncodedURIComponent(JSON.stringify({ foo: 'bar' }))
        const href = "http://dummy.com";
        const hash = `#${EXPORT_HREF_PARAM_NAME}=${encodedString}`;

        global.window = Object.create(window);
        Object.defineProperty(window, 'location', {
            value: {
                href,
                hash,
            }
        });

        const urlToReload2 = checkImportUrl();

        expect(urlToReload).toBe(undefined);
        expect(urlToReload2).toBe(href);
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

        expect(debounce('string')).toEqual(undefined);
        expect(debounce(func, 'string')).toEqual(undefined);

        setTimeout(function () {
            expect(timeoutFunc).toHaveBeenCalledTimes(times);
            expect(func).toHaveBeenCalledTimes(1);
            done();
        }, 500);
    });

    test('isLabelCommon', function () {
        expect(isLabelCommon(1234)).toEqual(undefined);
        expect(isLabelCommon()).toEqual(undefined);

        expect(isLabelCommon(TOTAL_LABEL)).toEqual(true);
        expect(isLabelCommon(BANK_DEPOSIT_LABEL)).toEqual(true);
        expect(isLabelCommon(OWN_MONEY_LABEL)).toEqual(true);
        expect(isLabelCommon(TOTAL_LABEL.toUpperCase())).toEqual(true);
        expect(isLabelCommon(TOTAL_LABEL.toLowerCase())).toEqual(true);
        expect(isLabelCommon('some-label')).toEqual(false);
        expect(isLabelCommon('BAC')).toEqual(false);
    });
});
