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
        ]);
    });

    it('should cache fetch result', async function () {
        const result1 = await getIndexFundData(assets);
        const result2 = await getIndexFundData(assets);

        expect(result1).toEqual(result2);
        expect(global.fetch).toBeCalledTimes(1);
    });
});

