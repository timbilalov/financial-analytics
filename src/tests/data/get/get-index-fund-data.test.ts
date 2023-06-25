import { getIndexFundData } from '@data';
import { assets } from '@test-constants';
import { resetIndexFundData } from '@store';

describe('get-index-fund-data', function () {
    afterEach(() => {
        resetIndexFundData();
    });

    it('should return an array of values', async function () {
        const result = await getIndexFundData(assets);

        expect(result).toEqual([
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
        ]);
    });

    it('should cache fetch result', async function () {
        const result1 = await getIndexFundData(assets);
        const result2 = await getIndexFundData(assets);

        expect(result1).toEqual(result2);
        expect(global.fetch).toBeCalledTimes(1);
    });
});

