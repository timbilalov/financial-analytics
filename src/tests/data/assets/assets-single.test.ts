import moment from 'moment';
import { getSingleAssetData } from '@data';
import { isObject } from '@helpers';
import type { TAsset, TAssetRaw } from '@types';
import { resetAssetsData } from '@store';
import { DATE_FORMATS } from '@constants';

describe('assets-single', function () {
    test('should return undefined for empty ticker', async function () {
        const assetRaw: TAssetRaw = {
            ticker: '',
            buyDate: '2010.01.01',
            amount: 3,
            hide: false,
        };

        const result = await getSingleAssetData(assetRaw);

        expect(result).toBe(undefined);
    });

    test('should return undefined if "hide" property passed', async function () {
        const assetRaw1: TAssetRaw = {
            ticker: 'tst',
            buyDate: '2010.01.01',
            amount: 3,
            hide: true,
        };
        const assetRaw2 = Object.assign({}, assetRaw1, {
            hide: '1',
        });
        const assetRaw3 = Object.assign({}, assetRaw1, {
            hide: 1,
        });

        const result1 = await getSingleAssetData(assetRaw1);
        const result2 = await getSingleAssetData(assetRaw2);
        const result3 = await getSingleAssetData(assetRaw3);

        expect(result1).toBe(undefined);
        expect(result2).toBe(undefined);
        expect(result3).toBe(undefined);
    });

    describe('should return empty data if something wrong with parsing', function () {
        beforeEach(function () {
            resetAssetsData();

            fetchMock.mockResponse(() => {
                return Promise.resolve(JSON.stringify({
                    foo: 'bar',
                }));
            });
        });

        test('investcab', async function () {
            const assetRaw: TAssetRaw = {
                ticker: 'tst',
                buyDate: '2020.01.01',
                amount: 3,
            };

            const actual = await getSingleAssetData(assetRaw);
            const expected: TAsset = {
                ticker: 'tst',
                title: 'TST',
                data: [],
                amount: 3,
                isUsd: false,
                isBond: false,
                buyDate: '2020.01.01',
                sellDate: moment().add(-1, 'days').format(DATE_FORMATS.default),
            };

            expect(actual).toEqual(expected);
        });

        test('moex', async function () {
            fetchMock.mockResponse(() => {
                return Promise.resolve(JSON.stringify({
                    'history': {
                        data: [],
                    },
                    'history.cursor': {
                        data: [
                            [],
                        ],
                    },
                }));
            });

            const assetRaw: TAssetRaw = {
                ticker: 'tst4',
                buyDate: '2020.01.01',
                amount: 3,
                moex: true,
            };

            const actual = await getSingleAssetData(assetRaw);
            const expected: TAsset = {
                ticker: 'tst4',
                title: 'TST4',
                data: [],
                amount: 3,
                isUsd: false,
                isBond: false,
                buyDate: '2020.01.01',
                sellDate: moment().add(-1, 'days').format(DATE_FORMATS.default),
            };

            expect(actual).toEqual(expected);
        });
    });

    test('should return an object with data', async function () {
        const assetRaw: TAssetRaw = {
            ticker: 'tst2',
            buyDate: '2020.01.01',
            sellDate: '2020.01.03',
            amount: 3,
        };

        const result = await getSingleAssetData(assetRaw) as TAsset;

        expect(isObject(result)).toBe(true);
        expect(result).toEqual({
            ticker: expect.any(String),
            title: expect.any(String),
            data: expect.any(Array),
            amount: expect.any(Number),
            isUsd: expect.any(Boolean),
            isBond: expect.any(Boolean),
            buyDate: expect.any(String),
            sellDate: expect.any(String),
        });
        expect(result.data).toContainEqual({
            date: expect.any(String),
            values: {
                current: expect.any(Number),
            },
        });
        expect(result.data.length).toBe(3);
    });
});
