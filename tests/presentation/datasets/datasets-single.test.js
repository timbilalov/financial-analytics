import {prepareSingleDataset} from "@presentation";
import {dates, usdData} from "../../constants";
import {CALC_CURRENCIES, CALC_METHODS} from "@constants";

describe('datasets-single', function () {
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
        const options = {
            title: 'tst',
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
            isUsd: false,
            datesFullArray: dates,
            calcMethod: CALC_METHODS.ABSOLUTE,
            calcCurrency: CALC_CURRENCIES.RUB,
            usdData: usdData,
            useTaxes: false,
        };

        const result = prepareSingleDataset(options);

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
});
