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
                    values: {
                        current: 70,
                    },
                },
                {
                    date: '2020.01.02',
                    values: {
                        current: 71,
                    },
                },
                {
                    date: '2020.01.03',
                    values: {
                        current: 72,
                    },
                },
                {
                    date: '2020.01.04',
                    values: {
                        current: 73,
                    },
                },
                {
                    date: '2020.01.05',
                    values: {
                        current: 74,
                    },
                },
                {
                    date: '2020.01.06',
                    values: {
                        current: 75,
                    },
                },
                {
                    date: '2020.01.07',
                    values: {
                        current: 76,
                    },
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
                    values: {
                        current: 55,
                    },
                },
                {
                    date: '2020.01.02',
                    values: {
                        current: 56,
                    },
                },
                {
                    date: '2020.01.03',
                    values: {
                        current: 57,
                    },
                },
                {
                    date: '2020.01.04',
                    values: {
                        current: 58,
                    },
                },
                {
                    date: '2020.01.05',
                    values: {
                        current: 59,
                    },
                },
                {
                    date: '2020.01.06',
                    values: {
                        current: 60,
                    },
                },
                {
                    date: '2020.01.07',
                    values: {
                        current: 61,
                    },
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
            values: {
                current: expect.any(Number),
            },
        });
        expect(result.length).toBe(dates.length);
        expect(result[1].values.current).toBe(result[2].values.current);
        expect(result[1].date).not.toBe(result[2].date);
    });
});
