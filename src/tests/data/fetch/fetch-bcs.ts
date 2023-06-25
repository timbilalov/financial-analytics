import { bcsResponseObject, dates } from '@test-constants';
import { fetchBcs } from 'src/data/fetch/fetch-bcs';

describe('fetch-investcab', function () {
    test('should return undefined for unsuccessful response', async function () {
        fetchMock.mockResponse(() => {
            return Promise.resolve({
                status: -100500,
            });
        });

        const result = await fetchBcs('tst', dates[0]);

        expect(result).toBe(undefined);
    });

    test('should return undefined for empty ticker or date from', async function () {
        const result1 = await fetchBcs('', dates[0]);
        const result2 = await fetchBcs('tst', '');

        expect(result1).toBe(undefined);
        expect(result2).toBe(undefined);
    });

    test('should return object with data', async function () {
        const result = await fetchBcs('tst', dates[0]);
        const expected = bcsResponseObject;

        expect(result).toEqual(expected);
    });
});
