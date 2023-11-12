import { dates, investcabResponseObject, moexDataRows } from '@test-constants';
import { fetchData } from '@data';
import { FETCH_SOURCES } from '@constants';

describe('fetch-data', function () {
    test('should return undefined for unsuccessful response', async function () {
        fetchMock.mockResponse(() => {
            return Promise.resolve({
                status: -100500,
            });
        });

        const result = await fetchData('tst', dates[0]);

        expect(result).toBe(undefined);
    });

    test('should return undefined for empty ticker or date from', async function () {
        const result1 = await fetchData('', dates[0]);
        const result2 = await fetchData('tst', '');

        expect(result1).toBe(undefined);
        expect(result2).toBe(undefined);
    });

    test('should return array of data rows, for moex', async function () {
        const dataRow = moexDataRows[0];

        fetchMock.mockResponse(() => {
            return Promise.resolve(JSON.stringify({
                'history': {
                    data: [
                        dataRow,
                    ],
                },
                'history.cursor': {
                    data: [
                        [1, 2, 3],
                    ],
                },
            }));
        });

        const result = await fetchData('tst', dates[0], dates[3], FETCH_SOURCES.MOEX);
        const expected = [
            dataRow,
        ];

        expect(result).toEqual(expected);
    });

    test('should return object with data, for investcab', async function () {
        const result = await fetchData('tst', dates[0], dates[2], FETCH_SOURCES.INVESTCAB);
        const expected = investcabResponseObject;

        expect(result).toEqual(expected);
    });
});
