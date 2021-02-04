import {getSingleAssetData} from "@data";
import {isObject} from "@helpers";
import {investcabResponseObject, moexDataRows} from "../../constants";

describe('assets-single', function () {
    test('should return undefined for wrong arguments', async function () {
        const result1 = await getSingleAssetData();
        const result2 = await getSingleAssetData('123');
        const result3 = await getSingleAssetData(['123']);
        const result4 = await getSingleAssetData(100500);
        const result5 = await getSingleAssetData(null);

        expect(result1).toBe(undefined);
        expect(result2).toBe(undefined);
        expect(result3).toBe(undefined);
        expect(result4).toBe(undefined);
        expect(result5).toBe(undefined);
    });

    test('should return undefined for wrong asset data', async function () {
        const asset1 = {
            ticker: 'tst',
        };
        const asset2 = {
            ticker: 100500,
            buyDate: '2010.01.01',
        };
        const asset3 = {
            ticker: 'tst',
            buyDate: '2010.01.01',
            amount: [1, 2],
        };

        const result1 = await getSingleAssetData(asset1);
        const result2 = await getSingleAssetData(asset2);
        const result3 = await getSingleAssetData(asset3);

        expect(result1).toBe(undefined);
        expect(result2).toBe(undefined);
        expect(result3).toBe(undefined);
    });

    test('should return undefined if "hide" property passed', async function () {
        const asset1 = {
            ticker: 'tst',
            buyDate: '2010.01.01',
            amount: 3,
            hide: true,
        };
        const asset2 = Object.assign({}, asset1, {
            hide: '1',
        });
        const asset3 = Object.assign({}, asset1, {
            hide: 1,
        });

        const result1 = await getSingleAssetData(asset1);
        const result2 = await getSingleAssetData(asset2);
        const result3 = await getSingleAssetData(asset3);

        expect(result1).toBe(undefined);
        expect(result2).toBe(undefined);
        expect(result3).toBe(undefined);
    });

    describe('should return undefined if something wrong with parsing', function () {
        global.fetch = jest.fn(() => {
            return Promise.resolve({
                ok: 1,
                json: () => {
                    return Promise.resolve({
                        foo: 'bar',
                    });
                },
            });
        });

        test('investcab', async function () {
            const asset = {
                ticker: 'tst',
                buyDate: '2020.01.01',
                amount: 3,
            };

            const result = await getSingleAssetData(asset);

            expect(result).toBe(undefined);
        });

        test('moex', async function () {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: 1,
                    json: () => Promise.resolve({
                        'history': {
                            data: [],
                        },
                        'history.cursor': {
                            data: [
                                []
                            ],
                        },
                    }),
                })
            );

            const asset = {
                ticker: 'tst4',
                buyDate: '2020.01.01',
                amount: 3,
                moex: true,
            };

            const result = await getSingleAssetData(asset);

            expect(result).toBe(undefined);
        });
    });

    test('should return an object with data', async function () {
        global.fetch = jest.fn(() => {
            return Promise.resolve({
                ok: 1,
                json: () => {
                    return Promise.resolve(investcabResponseObject);
                },
            });
        });

        const asset = {
            ticker: 'tst2',
            buyDate: '2020.01.01',
            amount: 3,
        };

        const result = await getSingleAssetData(asset);

        expect(isObject(result)).toBe(true);
        expect(result).toEqual({
            title: expect.any(String),
            data: expect.any(Array),
            amount: expect.any(Number),
            isUsd: expect.any(Boolean),
        });
        expect(result.data).toContainEqual({
            date: expect.any(String),
            value: expect.any(Number),
        });
        expect(result.data.length).toBe(3);
    });
});
