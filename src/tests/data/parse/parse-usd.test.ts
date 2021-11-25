import { parseResponseDataUsd } from '@parse';
import { dates, moexDataRows } from '@test-constants';
import type { TFetchDataItemMoex } from '@types';

// TODO: Добавить в логику тестов расчёты значений
describe('parse-usd', function () {
    test('should return an empty array for wrong market type', function () {
        const result = parseResponseDataUsd([['foo', dates[0], '', '', 10, 20, 30, 40, 50, 60, 70]], dates);

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
    });

    describe('should return an array of data', function () {
        test('usd', function () {
            const responseData = moexDataRows.map(item => ['CETS', ...item.slice(1)] as TFetchDataItemMoex);
            const actual = parseResponseDataUsd(responseData, dates);
            const expected = [
                {
                    date: '2020.01.01',
                    value: 70,
                },
                {
                    date: '2020.01.02',
                    value: 71,
                },
                {
                    date: '2020.01.03',
                    value: 72,
                },
                {
                    date: '2020.01.04',
                    value: 73,
                },
                {
                    date: '2020.01.05',
                    value: 74,
                },
                {
                    date: '2020.01.06',
                    value: 75,
                },
                {
                    date: '2020.01.07',
                    value: 76,
                },
            ];

            expect(actual).toEqual(expected);
        });

        test('index-fund', function () {
            const responseData = moexDataRows.map(item => ['TQTF', ...item.slice(1)] as TFetchDataItemMoex);
            const actual = parseResponseDataUsd(responseData, dates, true);
            const expected = [
                {
                    date: '2020.01.01',
                    value: 55, // (30 + 80) / 2
                },
                {
                    date: '2020.01.02',
                    value: 56, // (31 + 81) / 2
                },
                {
                    date: '2020.01.03',
                    value: 57, // (32 + 82) / 2
                },
                {
                    date: '2020.01.04',
                    value: 58, // (33 + 83) / 2
                },
                {
                    date: '2020.01.05',
                    value: 59, // (34 + 84) / 2
                },
                {
                    date: '2020.01.06',
                    value: 60, // (35 + 85) / 2
                },
                {
                    date: '2020.01.07',
                    value: 61, // (36 + 86) / 2
                },
            ];

            expect(actual).toEqual(expected);
        });
    });

    test('should check for previous date values', function () {
        const result = parseResponseDataUsd([
            ['CETS', dates[0], '', '', 10, 20, 30, 40, 50, 60, 70],
            ['CETS', dates[1], '', '', 10, 20, 30, 40, 50, 60, 70],
            ['CETS', dates[1], '', '', 10, 20, 30, 40, 50, 60, 70],
            ['CETS', dates[2], '', '', 10, 20, 30, 40, 50, 60, 70],
        ], dates);

        expect(result).toContainEqual({
            date: expect.any(String),
            value: expect.any(Number),
        });
        expect(result.length).toBe(dates.length);
        expect(result[1].value).toBe(result[2].value);
        expect(result[1].date).not.toBe(result[2].date);
    });
});
