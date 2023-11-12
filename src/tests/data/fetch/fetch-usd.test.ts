import { fetchUsd } from '@data';
import { dates, moexDataRowsUsd } from '@test-constants';

describe('fetch-usd', function () {
    test('should return an array of values', async function () {
        const result = await fetchUsd(dates);

        expect(result).toEqual([
            moexDataRowsUsd[0],
            moexDataRowsUsd[1],
            moexDataRowsUsd[2],
            moexDataRowsUsd[3],
            moexDataRowsUsd[4],
            moexDataRowsUsd[5],
            moexDataRowsUsd[6],
        ]);
    });
});
