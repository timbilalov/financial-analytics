import { dates, moexDataRows } from '@test-constants';
import { fetchMoex } from '@fetch';

describe('fetch-moex', function () {
    const dataRow1 = moexDataRows[0];
    const dataRow2 = moexDataRows[1];
    const dataRow3 = moexDataRows[2];

    test('should return undefined for unsuccessful response', async function () {
        fetchMock.mockResponse(() => {
            return Promise.resolve({
                status: -100500,
            });
        });

        const result = await fetchMoex('tst', dates[0]);

        expect(result).toBe(undefined);
    });

    test('should return undefined for empty ticker of date from', async function () {
        const result1 = await fetchMoex('', dates[0]);
        const result2 = await fetchMoex('tst', '');

        expect(result1).toBe(undefined);
        expect(result2).toBe(undefined);
    });

    test('should return array of data rows', async function () {
        const result = await fetchMoex('tst', dates[0]);
        const expected = [
            moexDataRows[0],
            moexDataRows[1],
            moexDataRows[2],
            moexDataRows[3],
            moexDataRows[4],
            moexDataRows[5],
            moexDataRows[6],
        ];

        expect(result).toEqual(expected);
    });

    test('should return full array of data rows, if index + pageSize < total', async function () {
        function* generator() {
            yield {
                'history': {
                    columns: ['BOARDID', 'TRADEDATE', 'SHORTNAME', 'SECID', 'OPEN', 'LOW', 'HIGH', 'CLOSE', 'NUMTRADES', 'VOLRUR', 'WAPRICE'],
                    data: [
                        dataRow1,
                    ],
                },
                'history.cursor': {
                    columns: ['INDEX', 'TOTAL', 'PAGESIZE'],
                    data: [
                        [0, 60, 20],
                    ],
                },
            };

            yield {
                'history': {
                    columns: ['BOARDID', 'TRADEDATE', 'SHORTNAME', 'SECID', 'OPEN', 'LOW', 'HIGH', 'CLOSE', 'NUMTRADES', 'VOLRUR', 'WAPRICE'],
                    data: [
                        dataRow2,
                    ],
                },
                'history.cursor': {
                    columns: ['INDEX', 'TOTAL', 'PAGESIZE'],
                    data: [
                        [20, 60, 20],
                    ],
                },
            };

            return {
                'history': {
                    columns: ['BOARDID', 'TRADEDATE', 'SHORTNAME', 'SECID', 'OPEN', 'LOW', 'HIGH', 'CLOSE', 'NUMTRADES', 'VOLRUR', 'WAPRICE'],
                    data: [
                        dataRow3,
                    ],
                },
                'history.cursor': {
                    columns: ['INDEX', 'TOTAL', 'PAGESIZE'],
                    data: [
                        [40, 60, 20],
                    ],
                },
            };
        }

        const generatorInstance = generator();
        fetchMock.mockResponse(() => {
            return Promise.resolve(JSON.stringify(generatorInstance.next().value));
        });

        const result = await fetchMoex('tst', dates[0]);

        expect(result).toEqual([
            dataRow1,
            dataRow2,
            dataRow3,
        ]);
    });

    test('should return undefined, if index + pageSize < total, and something wrong with response', async function () {
        function* generator() {
            yield JSON.stringify({
                'history': {
                    columns: ['BOARDID', 'TRADEDATE', 'SHORTNAME', 'SECID', 'OPEN', 'LOW', 'HIGH', 'CLOSE', 'NUMTRADES', 'VOLRUR', 'WAPRICE'],
                    data: [
                        dataRow1,
                    ],
                },
                'history.cursor': {
                    columns: ['INDEX', 'TOTAL', 'PAGESIZE'],
                    data: [
                        [0, 60, 20],
                    ],
                },
            });

            yield {
                status: -100500,
            };

            return JSON.stringify({
                'history': {
                    columns: ['BOARDID', 'TRADEDATE', 'SHORTNAME', 'SECID', 'OPEN', 'LOW', 'HIGH', 'CLOSE', 'NUMTRADES', 'VOLRUR', 'WAPRICE'],
                    data: [
                        dataRow3,
                    ],
                },
                'history.cursor': {
                    columns: ['INDEX', 'TOTAL', 'PAGESIZE'],
                    data: [
                        [40, 60, 20],
                    ],
                },
            });
        }

        const generatorInstance = generator();

        fetchMock.mockResponse(() => Promise.resolve(generatorInstance.next().value));

        const result = await fetchMoex('tst', dates[0]);

        expect(result).toBe(undefined);
    });
});
