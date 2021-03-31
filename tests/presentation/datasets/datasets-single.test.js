import {prepareSingleDataset} from "@presentation";
import {dates, usdData} from "../../constants";
import {BANK_DEPOSIT_LABEL, CALC_CURRENCIES, CALC_METHODS, OWN_MONEY_LABEL, TOTAL_LABEL} from "@constants";

describe('datasets-single', function () {
    const baseData = [
        {
            date: dates[0],
            value: 10,
        },
        {
            date: dates[1],
            value: 20,
        },
    ];

    const baseOptions = {
        title: 'tst',
        data: baseData,
        amount: 2,
        isUsd: false,
        datesFullArray: dates,
        calcMethod: CALC_METHODS.ABSOLUTE,
        calcCurrency: CALC_CURRENCIES.RUB,
        usdData: usdData,
        useTaxes: false,
    };

    test('should return undefined for wrong arguments', function () {
        const result1 = prepareSingleDataset();
        const result2 = prepareSingleDataset(123);
        const result3 = prepareSingleDataset('str');
        const result4 = prepareSingleDataset(function () { return 2; });
        const result5 = prepareSingleDataset(null);
        const result6 = prepareSingleDataset([1, 'foo']);

        expect(result1).toBe(undefined);
        expect(result2).toBe(undefined);
        expect(result3).toBe(undefined);
        expect(result4).toBe(undefined);
        expect(result5).toBe(undefined);
        expect(result6).toBe(undefined);
    });

    test('should return an object with data', function () {
        const result = prepareSingleDataset(baseOptions);

        expect(result).toEqual({
            label: expect.any(String),
            backgroundColor: expect.any(String),
            borderColor: expect.any(String),
            data: expect.any(Array),
            dataAbsTotal: expect.any(Array),
            dates: expect.any(Array),
            type: 'line',
            pointRadius: expect.any(Number),
            fill: false,
            lineTension: 0,
            borderWidth: expect.any(Number),
            amount: expect.any(Number),
            isUsd: expect.any(Boolean),
        });
    });

    test('should return an object with same data for common labeled items', function () {
        const values = [
            baseData[0].value,
            baseData[1].value,
            NaN,
            NaN,
        ];

        const optionsTotal = Object.assign({}, baseOptions, {
            title: TOTAL_LABEL,
        });
        const optionsOwnMoney = Object.assign({}, baseOptions, {
            title: OWN_MONEY_LABEL,
        });
        const optionsBankDepo = Object.assign({}, baseOptions, {
            title: BANK_DEPOSIT_LABEL,
        });

        const result1 = prepareSingleDataset(optionsTotal);
        const result2 = prepareSingleDataset(optionsOwnMoney);
        const result3 = prepareSingleDataset(optionsBankDepo);

        expect(result1.data).toEqual(values);
        expect(result2.data).toEqual(values);
        expect(result3.data).toEqual(values);
    });

    test('should fill empty values (by date) with NaN', function () {
        const options = Object.assign({}, baseOptions, {
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
        });

        const result = prepareSingleDataset(options);

        expect(result.data.length).toBe(4);
        expect(result.data[0]).toBe(NaN);
        expect(result.data[1]).not.toBe(NaN);
        expect(result.data[2]).not.toBe(NaN);
        expect(result.data[3]).toBe(NaN);
    });

    test('should use previous values if some data missed', function () {
        const options = Object.assign({}, baseOptions, {
            data: [
                {
                    date: dates[0],
                    value: 0,
                },
                {
                    date: dates[1],
                    value: 1,
                },
                {
                    date: dates[3],
                    value: 3,
                },
            ],
        });

        const result = prepareSingleDataset(options);

        expect(result.data.length).toBe(4);
        expect(result.data[0]).not.toBe(NaN);
        expect(result.data[1]).not.toBe(NaN);
        expect(result.data[2]).not.toBe(NaN);
        expect(result.data[3]).not.toBe(NaN);
        expect(result.data[2]).toEqual(result.data[1]);
    });

    test('should get dates and values from item data, if no dates array passed, or empty', function () {
        const options1 = Object.assign({}, baseOptions, {
            datesFullArray: [],
        });
        const options2 = Object.assign({}, baseOptions, {
            datesFullArray: undefined,
        });

        const result1 = prepareSingleDataset(options1);
        const result2 = prepareSingleDataset(options2);

        expect(result1).toEqual(result2);
        expect(result1.dates).toEqual([
            dates[0],
            dates[1],
        ]);
        expect(result1.data).toEqual([
            0, // for absolute method
            20, // (20 - 10) * 2
        ]);
    });
});
