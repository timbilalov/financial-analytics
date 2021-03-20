import {dates, investcabResponseObject} from '../../constants';
import {fetchInvestcab} from "@data";

describe('fetch-investcab', function () {
    beforeEach(() => {
        global.fetch = jest.fn(() => {
            return Promise.resolve({
                ok: 1,
                json: () => {
                    return Promise.resolve(investcabResponseObject);
                },
            });
        });
    });

    test('should return undefined for wrong arguments', async function () {
        const result1 = await fetchInvestcab(undefined, dates[0]);
        const result2 = await fetchInvestcab('undefined', undefined);

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

        const result = await fetchInvestcab('tst', dates[0]);

        expect(result).toBe(undefined);
    });

    test('should return object with data', async function () {
        const result1 = await fetchInvestcab('tst', dates[0]);
        const result2 = await fetchInvestcab('tst', dates[0], dates[3]);
        const expected = investcabResponseObject;

        expect(result1).toEqual(expected);
        expect(result2).toEqual(expected);
    });
});
