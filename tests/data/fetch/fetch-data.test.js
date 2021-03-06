import {dates, investcabResponseObject, moexDataRows} from '../../constants';
import {fetchData} from "@data";
import LocalStorage from "@utils/local-storage";
import {DATE_FORMATS, STORAGE_KEYS} from "@constants";
import moment from "moment";

describe('fetch-data', function () {
    test('should return undefined for wrong arguments', async function () {
        const result1 = await fetchData(undefined, dates[0]);
        const result2 = await fetchData('undefined', undefined);

        expect(result1).toBe(undefined);
        expect(result2).toBe(undefined);
    });

    test('should return undefined for unsuccessful response', async function () {
        global.fetch = jest.fn(() => {
            return Promise.resolve({
                ok: 0,
                status: 'test error',
            });
        });

        const result = await fetchData('tst', dates[0]);

        expect(result).toBe(undefined);
    });

    test('should return array of data rows, for moex', async function () {
        const dataRow = moexDataRows[0];

        global.fetch = jest.fn(() => {
            return Promise.resolve({
                ok: 1,
                json: () => {
                    return Promise.resolve({
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
                    });
                },
            });
        });

        const result = await fetchData('tst', dates[0], dates[3], true);
        const expected = [
            dataRow,
        ];

        expect(result).toEqual(expected);
    });

    test('should return object with data, for investcab', async function () {
        global.fetch = jest.fn(() => {
            return Promise.resolve({
                ok: 1,
                json: () => {
                    return Promise.resolve(investcabResponseObject);
                },
            });
        });

        const result = await fetchData('tst', dates[0], dates[2], false);
        const expected = investcabResponseObject;

        expect(result).toEqual(expected);
    });

    test('should cache items', async function () {
        const ticker = 'tst';
        const dateFrom = moment().add(-1, 'days').format(DATE_FORMATS.default);
        const dateTo = moment().format(DATE_FORMATS.default);
        const storageItemData = [
            1,
            'foo',
            2,
        ];
        const storageItems = [
            {
                ticker: ticker,
                manualDateFrom: dateFrom,
                manualDateTo: dateTo,
                data: storageItemData,
            }
        ];

        LocalStorage.set(STORAGE_KEYS.fetchData, storageItems);

        const result = await fetchData(ticker, dateFrom, dateTo);

        expect(result).toEqual(storageItems[0].data);
    });
});
