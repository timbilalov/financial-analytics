import {parseResponseDataMoex} from "@parse";
import {dates, moexDataRows} from "../../constants";

// TODO: Добавить в логику тестов расчёты значений
describe('parse-moex', function () {
    test('should return undefined for wrong arguments', function () {
        const result1 = parseResponseDataMoex();
        const result2 = parseResponseDataMoex(2);
        const result3 = parseResponseDataMoex('str');
        const result4 = parseResponseDataMoex(null);
        const result5 = parseResponseDataMoex(function () { return 2 });
        const result6 = parseResponseDataMoex({ foo: 'bar' });

        expect(result1).toBe(undefined);
        expect(result2).toBe(undefined);
        expect(result3).toBe(undefined);
        expect(result4).toBe(undefined);
        expect(result5).toBe(undefined);
        expect(result6).toBe(undefined);
    });

    test('should return an empty array for wrong market type', function () {
        const result1 = parseResponseDataMoex([['foo', dates[0], undefined, undefined, 10, 20, 30, 40, 50, 60, 70]]);
        const result2 = parseResponseDataMoex([['foo', dates[0], undefined, undefined, 10, 20, 30, 40, 50, 60, 70]], true);

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
            const responseData = moexDataRows.map(item => ['TQCB', ...item.slice(1)]);
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
            ['TQTF', dates[0], undefined, undefined, 10, 20, 30, 40, 50, 60, 70],
            ['TQTF', dates[0], undefined, undefined, 10, 20, 30, 40, 50, 60, 70],
            ['TQTF', dates[1], undefined, undefined, 10, 20, 30, 40, 50, 60, 70],
            ['TQTF', dates[2], undefined, undefined, 10, 20, 30, 40, 50, 60, 70],
        ]);

        expect(result).toContainEqual({
            date: expect.any(String),
            value: expect.any(Number),
        });
        expect(result.length).toBe(3);
    });
});
