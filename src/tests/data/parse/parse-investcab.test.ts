import { parseResponseDataInvestcab } from '@parse';
import { investcabResponseObject } from '@test-constants';
import type { TAssetData } from '@types';

// TODO: Добавить в логику тестов расчёты значений
describe('parse-investcab', function () {
    test('should return an array of data', function () {
        const response1 = investcabResponseObject;
        const response2 = JSON.stringify(investcabResponseObject);

        const result1 = parseResponseDataInvestcab(response1) as TAssetData;
        const result2 = parseResponseDataInvestcab(response2) as TAssetData;

        expect(result1).toContainEqual({
            date: expect.any(String),
            value: expect.any(Number),
        });
        expect(result1.length).toBe(3);
        expect(result2).toEqual(result1);
    });

    test('should check for previous date values', function () {
        const result = parseResponseDataInvestcab({
            c: [10, 20, 30],
            h: [11, 21, 31],
            l: [12, 22, 32],
            o: [13, 23, 33],
            s: 'ok',
            t: [1577894400000, 1577894400000, 1577998800000],
            v: [15, 25, 35],
        }) as TAssetData;

        expect(result).toContainEqual({
            date: expect.any(String),
            value: expect.any(Number),
        });
        expect(result.length).toBe(2);
    });
});
