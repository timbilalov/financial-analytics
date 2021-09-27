import { LocalStorage } from '@utils';

describe('local-storage', function () {
    describe('set', function () {
        test('should return false if key is empty or value is undefined', function () {
            const result1 = LocalStorage.set('', 'foo');
            const result2 = LocalStorage.set('key', undefined);

            expect(result1).toEqual(false);
            expect(result2).toEqual(false);
        });

        test('should return false if something was wrong', function () {
            const result = LocalStorage.set('key', window);
            expect(result).toEqual(false);
        });
    });

    describe('get', function () {
        test('should return undefined if key is empty', function () {
            const result = LocalStorage.get('');

            expect(result).toEqual(undefined);
        });

        test('should return null if passed a key that doesnt set yet', function () {
            const value = LocalStorage.get('foo');

            expect(value).toEqual(null);
        });

        test('should return same value that was set', function () {
            const key1 = 'str';
            const key2 = 'num';
            const key3 = 'obj';

            const setValue1 = 'some string';
            const setValue2 = 10.6;
            const setValue3 = {
                a: '1',
                b: 2,
                c: {
                    d: '3',
                },
            };

            LocalStorage.set(key1, setValue1);
            LocalStorage.set(key2, setValue2);
            LocalStorage.set(key3, setValue3);

            const getValue1 = LocalStorage.get(key1);
            const getValue2 = LocalStorage.get(key2);
            const getValue3 = LocalStorage.get(key3);

            expect(getValue1).toEqual(setValue1);
            expect(getValue2).toEqual(setValue2);
            expect(getValue3).toEqual(setValue3);
        });
    });

    describe('remove', function () {
        test('should return false if key is empty', function () {
            const result = LocalStorage.set('', 'foo');

            expect(result).toEqual(false);
        });

        test('should remove existing item', function () {
            const key = 'foo';
            const value = 'bar';

            LocalStorage.set(key, value);
            const resultBefore = LocalStorage.get(key);

            LocalStorage.remove(key);
            const resultAfter = LocalStorage.get(key);

            expect(resultBefore).toEqual(value);
            expect(resultAfter).toEqual(null);
        });
    });

    describe('export', function () {
        test('should return encoded string', function () {
            const key1 = 'foo';
            const key2 = 'some-key';
            const value1 = 'bar';
            const value2 = { a: 2, b: 'str' };

            LocalStorage.set(key1, value1);
            LocalStorage.set(key2, value2);

            const result1 = LocalStorage.export([key1]);
            const result2 = LocalStorage.export([key1, key2]);

            expect(result1).toBe('N4IgZg9hIFwgRgQwE4gL5A');
            expect(result2).toBe('N4IgZg9hIFwgRgQwE4gDQgM4QLYFMBaAazwE9ZRFYAmDeWLAF1QF8Wg');

            LocalStorage.remove(key1);
            LocalStorage.remove(key2);
        });
    });

    describe('import', function () {
        test('should return undefined for wrong-encoded string', function () {
            const result = LocalStorage.import('some wrong string');

            expect(result).toBe(undefined);
        });

        test('should return decoded string', function () {
            const key1 = 'foo';
            const key2 = 'some-key';
            const value1 = 'bar';
            const value2 = { a: 2, b: 'str' };

            const result1 = LocalStorage.import('N4IgZg9hIFwgRgQwE4gL5A');
            const result2 = LocalStorage.import('N4IgZg9hIFwgRgQwE4gDQgM4QLYFMBaAazwE9ZRFYAmDeWLAF1QF8Wg');

            const storageValue1 = LocalStorage.get(key1);
            const storageValue2 = LocalStorage.get(key2);
            const object1 = {};
            const object2 = {};

            object1[key1] = value1;
            object2[key1] = value1;
            object2[key2] = value2;

            expect(result1).toEqual(object1);
            expect(result2).toEqual(object2);
            expect(storageValue1).toEqual(value1);
            expect(storageValue2).toEqual(value2);

            LocalStorage.remove(key1);
            LocalStorage.remove(key2);
        });
    });
});
