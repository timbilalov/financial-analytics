import { prepareDatasets } from '@presentation';
import { calcOptionsDefault, dates } from '@test-constants';
import { BANK_DEPOSIT_LABEL, CALC_METHODS, OWN_MONEY_LABEL, TOTAL_LABEL } from '@constants';
import type { TAsset } from '@types';
import { extendObject } from '@helpers';

describe('datasets-all', function () {
    const baseData: TAsset[] = [
        {
            ticker: 'tst1',
            data: [
                {
                    date: dates[0],
                    value: 10,
                },
                {
                    date: dates[1],
                    value: 20,
                },
            ],
            amount: 2,
            isUsd: true,
            buyDate: dates[0],
        },
        {
            ticker: 'tst2',
            data: [
                {
                    date: dates[1],
                    value: 100,
                },
                {
                    date: dates[2],
                    value: 200,
                },
            ],
            amount: 1,
            isUsd: false,
            buyDate: dates[0],
        },
    ];

    describe('should return an array of datasets', function () {
        test('result should contain at least N datasets for N items', async function () {
            const result = await prepareDatasets(baseData, calcOptionsDefault);

            expect(result.length).toBeGreaterThanOrEqual(baseData.length);
        });

        test('result should contain "total" dataset, if items count > 1', async function () {
            const result = await prepareDatasets(baseData, calcOptionsDefault);

            expect(result.filter(item => item.label === TOTAL_LABEL).length).toBe(1);
        });

        test('result should not contain "total" dataset, if items count <= 1', async function () {
            const data = baseData.slice(0, 1);
            const result = await prepareDatasets(data, calcOptionsDefault);

            expect(result.filter(item => item.label === TOTAL_LABEL).length).toBe(0);
        });

        test('result should contain "bank depo" dataset', async function () {
            const result = await prepareDatasets(baseData, calcOptionsDefault);

            expect(result.filter(item => item.label === BANK_DEPOSIT_LABEL).length).toBe(1);
        });

        test('result should contain "own money" dataset, for absolute-total method', async function () {
            const calcOptions = extendObject(calcOptionsDefault, {
                method: CALC_METHODS.ABSOLUTE_TOTAL,
            });
            const result = await prepareDatasets(baseData, calcOptions);

            expect(result.filter(item => item.label === OWN_MONEY_LABEL).length).toBe(1);
        });
    });
});
