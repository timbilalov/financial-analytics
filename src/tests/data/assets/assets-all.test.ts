import { getAssetsData } from '@data';
import { investcabResponseObject } from '@test-constants';
import type { TAssetRaw } from '@types';

declare const global: {
    fetch: unknown,
};

describe('assets-all', function () {
    test('should return an array of single data items', async function () {
        // TODO: Вынести куда-то этот глобальный fetch — он везде одинаковый.
        global.fetch = jest.fn(() => {
            return Promise.resolve({
                ok: 1,
                json: () => {
                    return Promise.resolve(investcabResponseObject);
                },
            });
        });

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
        });
        expect(result.length).toBe(2);
        for (const item of result) {
            expect(item.data).toContainEqual({
                date: expect.any(String),
                value: expect.any(Number),
            });
            expect(item.data.length).toBe(6);
        }
    });
});
