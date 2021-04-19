import {parseResponseDataMoex} from "@parse";
import {dates, moexDataRows} from "@test-constants";
import type {TFetchDataItemMoex, TFetchDataMoex} from "@types";

// TODO: Добавить в логику тестов расчёты значений
describe('parse-moex', function () {
    test('should return an empty array for wrong market type', function () {
        const result1 = parseResponseDataMoex([['foo', dates[0], '', '', 10, 20, 30, 40, 50, 60, 70]]);
        const result2 = parseResponseDataMoex([['foo', dates[0], '', '', 10, 20, 30, 40, 50, 60, 70]], true);

        expect(result1).toEqual([]);
        expect(result1.length).toBe(0);
        expect(result2).toEqual([]);
        expect(result2.length).toBe(0);
    });

    describe('should return an array of data', function () {
        test('stocks', function () {
            const result = parseResponseDataMoex(moexDataRows);

            expect(result).toContainEqual({
                date: expect.any(String),
                value: expect.any(Number),
            });
            expect(result.length).toBe(4);
        });

        test('bonds', function () {
            const responseData: TFetchDataMoex = moexDataRows.map(item => ['TQCB', ...item.slice(1)] as TFetchDataItemMoex);
            const result = parseResponseDataMoex(responseData, true);

            expect(result).toContainEqual({
                date: expect.any(String),
                value: expect.any(Number),
            });
            expect(result.length).toBe(4);
        });
    });

    test('should check for previous date values', function () {
        const result = parseResponseDataMoex([
            ['TQTF', dates[0], '', '', 10, 20, 30, 40, 50, 60, 70],
            ['TQTF', dates[0], '', '', 10, 20, 30, 40, 50, 60, 70],
            ['TQTF', dates[1], '', '', 10, 20, 30, 40, 50, 60, 70],
            ['TQTF', dates[2], '', '', 10, 20, 30, 40, 50, 60, 70],
        ]);

        expect(result).toContainEqual({
            date: expect.any(String),
            value: expect.any(Number),
        });
        expect(result.length).toBe(3);
    });
});
