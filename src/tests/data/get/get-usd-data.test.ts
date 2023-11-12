import { getUsdData } from '@data';
import { assets } from '@test-constants';
import { resetUsdData } from '@store';

describe('get-usd-data', function () {
    afterEach(() => {
        resetUsdData();
    });

    it('should return an array of values', async function () {
        const result = await getUsdData(assets);

        expect(result).toEqual([
            {
                date: '2020.01.01',
                values: {
                    current: 70,
                },
            },
            {
                date: '2020.01.02',
                values: {
                    current: 71,
                },
            },
            {
                date: '2020.01.03',
                values: {
                    current: 72,
                },
            },
            {
                date: '2020.01.04',
                values: {
                    current: 73,
                },
            },
        ]);
    });

    it('should cache fetch result', async function () {
        const result1 = await getUsdData(assets);
        const result2 = await getUsdData(assets);

        expect(result1).toEqual(result2);
        expect(global.fetch).toBeCalledTimes(1);
    });
});

