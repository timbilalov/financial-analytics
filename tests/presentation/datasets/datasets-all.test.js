import {prepareDatasets} from "@presentation";
import {dates, usdData} from "../../constants";
import {BANK_DEPOSIT_LABEL, CALC_CURRENCIES, CALC_METHODS, OWN_MONEY_LABEL, TOTAL_LABEL} from "@constants";

describe('datasets-all', function () {
    const baseData = [
        {
            title: 'tst1',
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
        },
        {
            title: 'tst2',
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
        },
    ];

    const baseOptions = {
        datesFullArray: dates,
        calcMethod: CALC_METHODS.RELATIVE,
        usdData: usdData,
    };

    test('should return an empty array for wrong arguments', async function () {
        const result1 = await prepareDatasets();
        const result2 = await prepareDatasets(10);
        const result3 = await prepareDatasets(baseData);
        const result4 = await prepareDatasets(baseData, function () {});
        const result5 = await prepareDatasets(baseData, { foo: 'bar' });

        expect(result1).toEqual([]);
        expect(result2).toEqual([]);
        expect(result3).toEqual([]);
        expect(result4).toEqual([]);
        expect(result5).toEqual([]);
    });

    describe('should return an array of datasets', function () {
        test('result should contain at least N datasets for N items', async function () {
            const result = await prepareDatasets(baseData, baseOptions);

            expect(result.length).toBeGreaterThanOrEqual(baseData.length);
        });

        test('result should contain "total" dataset, if items count > 1', async function () {
            const result = await prepareDatasets(baseData, baseOptions);

            expect(result.filter(item => item.label === TOTAL_LABEL).length).toBe(1);
        });

        test('result should not contain "total" dataset, if items count <= 1', async function () {
            const data = baseData.slice(0, 1);
            const result = await prepareDatasets(data, baseOptions);

            expect(result.filter(item => item.label === TOTAL_LABEL).length).toBe(0);
        });

        test('result should contain "bank depo" dataset', async function () {
            const result = await prepareDatasets(baseData, baseOptions);

            expect(result.filter(item => item.label === BANK_DEPOSIT_LABEL).length).toBe(1);
        });

        test('result should contain "own money" dataset, for absolute-total method', async function () {
            const options = Object.assign({}, baseOptions, {
                calcMethod: CALC_METHODS.ABSOLUTE_TOTAL,
            });
            const result = await prepareDatasets(baseData, options);

            expect(result.filter(item => item.label === OWN_MONEY_LABEL).length).toBe(1);
        });
    });
});
