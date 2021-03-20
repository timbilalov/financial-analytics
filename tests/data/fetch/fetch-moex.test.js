import {dates, moexDataRows} from '../../constants';
import {fetchMoex} from "@fetch";

describe('fetch-moex', function () {
    const dataRow1 = moexDataRows[0];
    const dataRow2 = moexDataRows[1];
    const dataRow3 = moexDataRows[2];
    const dataRow4 = moexDataRows[3];

    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: 1,
                json: () => Promise.resolve({
                    'history': {
                        columns: ['BOARDID', 'TRADEDATE', 'SHORTNAME', 'SECID', 'OPEN', 'LOW', 'HIGH', 'CLOSE', 'NUMTRADES', 'VOLRUR', 'WAPRICE'],
                        data: [
                            dataRow1,
                            dataRow2,
                            dataRow3,
                            dataRow4,
                        ],
                    },
                    'history.cursor': {
                        columns: ['INDEX', 'TOTAL', 'PAGESIZE'],
                        data: [
                            [1, 2, 3],
                        ],
                    },
                }),
            })
        );
    });

    test('should return undefined for wrong arguments', async function () {
        const result1 = await fetchMoex(undefined, dates[0]);
        const result2 = await fetchMoex('undefined', undefined);

        expect(result1).toBe(undefined);
        expect(result2).toBe(undefined);
    });

    test('should return undefined for unsuccessful response', async function () {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: 0,
                status: 'test error',
            })
        );

        const result = await fetchMoex('tst', dates[0]);

        expect(result).toBe(undefined);
    });

    test('should return array of data rows', async function () {
        const result1 = await fetchMoex('tst', dates[0], dates[3], false, false);
        const result2 = await fetchMoex('tst', dates[0], dates[3], true, false);
        const result3 = await fetchMoex('tst', dates[0], dates[3], false, true);
        const expected = [
            dataRow1,
            dataRow2,
            dataRow3,
            dataRow4,
        ];

        expect(result1).toEqual(expected);
        expect(result2).toEqual(expected);
        expect(result3).toEqual(expected);
    });

    test('should return full array of data rows, if index + pageSize < total', async function () {
        function* generator() {
            yield jest.fn(() => {
                return Promise.resolve({
                    ok: 1,
                    json: () => Promise.resolve({
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
                    }),
                })
            });

            yield jest.fn(() => {
                return Promise.resolve({
                    ok: 1,
                    json: () => Promise.resolve({
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
                    }),
                })
            });

            return jest.fn(() => {
                return Promise.resolve({
                    ok: 1,
                    json: () => Promise.resolve({
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
                    }),
                })
            });
        }

        const generatorInstance = generator();
        global.fetch = () => generatorInstance.next().value();

        const result = await fetchMoex('tst', dates[0]);

        expect(result).toEqual([
            dataRow1,
            dataRow2,
            dataRow3,
        ]);
    });

    test('should return undefined, if index + pageSize < total, and something wrong with response', async function () {
        function* generator() {
            yield jest.fn(() => {
                return Promise.resolve({
                    ok: 1,
                    json: () => Promise.resolve({
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
                    }),
                })
            });

            yield jest.fn(() => {
                return Promise.resolve({
                    ok: 0,
                    status: 'test error 2',
                    json: () => Promise.resolve({
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
                    }),
                })
            });

            return jest.fn(() => {
                return Promise.resolve({
                    ok: 1,
                    json: () => Promise.resolve({
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
                    }),
                })
            });
        }

        const generatorInstance = generator();
        global.fetch = () => generatorInstance.next().value();

        const result = await fetchMoex('tst', dates[0]);

        expect(result).toBe(undefined);
    });
});
