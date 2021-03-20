import {getAssetsData} from "@data";
import {investcabResponseObject} from "../../constants";
import {isObject} from "@helpers";

describe('assets-all', function () {
    test('should return undefined for wrong arguments', async function () {
        const result1 = await getAssetsData();
        const result2 = await getAssetsData(2);
        const result3 = await getAssetsData('str');
        const result4 = await getAssetsData(function () { return 2 });

        expect(result1).toBe(undefined);
        expect(result2).toBe(undefined);
        expect(result3).toBe(undefined);
        expect(result4).toBe(undefined);
    });

    test('should return an array of single data items', async function () {
        global.fetch = jest.fn(() => {
            return Promise.resolve({
                ok: 1,
                json: () => {
                    return Promise.resolve(investcabResponseObject);
                },
            });
        });

        const assets = [
            {
                ticker: 'f1',
                buyDate: '2020.01.01',
                amount: 1,
            },
            {
                ticker: 'f2',
                buyDate: '2020.01.01',
                amount: 1,
                hide: true,
            },
            {
                ticker: 'f3',
                buyDate: '2020.01.01',
                amount: 1,
            },
        ];
        const result = await getAssetsData(assets);

        expect(Array.isArray(result)).toBe(true);
        expect(result).toContainEqual({
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
            expect(item.data.length).toBe(3);
        }
    });
});
