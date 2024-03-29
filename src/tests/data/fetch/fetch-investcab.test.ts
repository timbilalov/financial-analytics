import { dates, investcabResponseObject } from '@test-constants';
import { fetchInvestcab } from '@data';

describe('fetch-investcab', function () {
    test('should return undefined for unsuccessful response', async function () {
        fetchMock.mockResponse(() => {
            return Promise.resolve({
                status: -100500,
            });
        });

        const result = await fetchInvestcab('tst', dates[0]);

        expect(result).toBe(undefined);
    });

    // TODO: Подумать, может есть вариант проверять на пустую строку с помощью TS
    test('should return undefined for empty ticker or date from', async function () {
        const result1 = await fetchInvestcab('', dates[0]);
        const result2 = await fetchInvestcab('tst', '');

        expect(result1).toBe(undefined);
        expect(result2).toBe(undefined);
    });

    test('should return object with data', async function () {
        const result1 = await fetchInvestcab('tst', dates[0]);
        const result2 = await fetchInvestcab('tst', dates[0], dates[3]);
        const expected = investcabResponseObject;

        expect(result1).toEqual(expected);
        expect(result2).toEqual(expected);
    });
});
