import { getAssetsData } from '@data';
import type { TAssetRaw } from '@types';

describe('assets-all', function () {
    test('should return an array of single data items', async function () {
        const assetsRaw: TAssetRaw[] = [
            {
                ticker: 'f1',
                buyDate: '2020.01.01',
                sellDate: '2020.01.06',
                amount: 1,
            },
            {
                ticker: 'f2',
                buyDate: '2020.01.01',
                sellDate: '2020.01.06',
                amount: 1,
                hide: true,
            },
            {
                ticker: 'f3',
                buyDate: '2020.01.01',
                sellDate: '2020.01.06',
                amount: 1,
            },
        ];
        const result = await getAssetsData(assetsRaw);

        expect(Array.isArray(result)).toBe(true);
        expect(result).toContainEqual({
            ticker: expect.any(String),
            title: expect.any(String),
            data: expect.any(Array),
            amount: expect.any(Number),
            isUsd: expect.any(Boolean),
            isBond: expect.any(Boolean),
            buyDate: expect.any(String),
            sellDate: expect.any(String),
        });
        expect(result.length).toBe(2);
        for (const item of result) {
            expect(item.data).toContainEqual({
                date: expect.any(String),
                values: {
                    current: expect.any(Number),
                },
            });
            expect(item.data.length).toBe(6);
        }
    });
});
