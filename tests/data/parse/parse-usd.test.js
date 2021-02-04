import {parseResponseDataUsd} from "@parse";
import {dates, moexDataRows} from "../../constants";

// TODO: Добавить в логику тестов расчёты значений
describe('parse-usd', function () {
    test('should return undefined for wrong arguments', function () {
        const result1 = parseResponseDataUsd();
        const result2 = parseResponseDataUsd(2);
        const result3 = parseResponseDataUsd('str');
        const result4 = parseResponseDataUsd(null);
        const result5 = parseResponseDataUsd(function () { return 2 });
        const result6 = parseResponseDataUsd({ foo: 'bar' });

        expect(result1).toBe(undefined);
        expect(result2).toBe(undefined);
        expect(result3).toBe(undefined);
        expect(result4).toBe(undefined);
        expect(result5).toBe(undefined);
        expect(result6).toBe(undefined);
    });

    test('should return an empty array for wrong market type', function () {
        const result = parseResponseDataUsd([['foo', dates[0], undefined, undefined, 10, 20, 30, 40, 50, 60, 70]], dates);

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
    });

    test('should return an array of data', function () {
        const responseData = moexDataRows.map(item => ['CETS', ...item.slice(1)]);
        const result = parseResponseDataUsd(responseData, dates);

        expect(result).toContainEqual({
            date: expect.any(String),
            value: expect.any(Number),
        });
        expect(result.length).toBe(4);
    });

    test('should check for previous date values', function () {
        const result = parseResponseDataUsd([
            ['CETS', dates[0], undefined, undefined, 10, 20, 30, 40, 50, 60, 70],
            ['CETS', dates[1], undefined, undefined, 10, 20, 30, 40, 50, 60, 70],
            ['CETS', dates[1], undefined, undefined, 10, 20, 30, 40, 50, 60, 70],
            ['CETS', dates[2], undefined, undefined, 10, 20, 30, 40, 50, 60, 70],
        ], dates);

        expect(result).toContainEqual({
            date: expect.any(String),
            value: expect.any(Number),
        });
        expect(result.length).toBe(4);
        expect(result[1].value).toBe(result[2].value);
        expect(result[1].date).not.toBe(result[2].date);
    });
});
