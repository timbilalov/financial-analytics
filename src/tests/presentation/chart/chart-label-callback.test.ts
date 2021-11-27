import { labelCallback } from '@presentation';
import { calcOptionsDefault, datasets } from '@test-constants';
import { CALC_METHODS } from '@constants';
import type { TTooltipItem } from '@types';
import { deepClone, extendObject } from '@helpers';

describe('chart-label-callback', function () {
    const valueToCheck = '110';
    const nameToCheck = 'tst-1';

    const tooltipItem: TTooltipItem = {
        value: valueToCheck,
        label: '2020.01.01',
        datasetIndex: 0,
    };
    const datasetsItems = datasets.slice().map((item, index) => {
        return Object.assign({}, item, {
            label: `tst-${index + 1}`,
        });
    });
    const data = {
        datasets: datasetsItems,
    };

    test('should return text string with single value', function () {
        const result = labelCallback(tooltipItem, data, calcOptionsDefault);

        expect(typeof result).toBe('string');
        expect(result.includes(nameToCheck)).toBe(true);
        expect(result.includes(valueToCheck)).toBe(true);
    });

    describe('multiple values', function () {
        const tooltipItem2 = extendObject(tooltipItem, {
            label: '2020.01.02',
        });
        const data2 = deepClone(data);
        data2.datasets = data2.datasets.slice();
        data2.datasets.push(Object.assign({}, datasets[0], {
            data: [11, 21, 31, 41],
            label: nameToCheck,
        }));

        test('should return string with array of values', function () {
            const result = labelCallback(tooltipItem2, data2, calcOptionsDefault);

            expect(typeof result).toBe('string');
            expect(result.includes(nameToCheck)).toBe(true);
            expect(result.includes(String(data2.datasets[0].data[1]))).toBe(true);
            expect(result.includes(String(data2.datasets[2].data[1]))).toBe(true);
        });

        test('should contain total value for absolute methods', function () {
            const calcOptions = extendObject(calcOptionsDefault, {
                method: CALC_METHODS.ABSOLUTE,
            });
            const result = labelCallback(tooltipItem2, data2, calcOptions);
            const totalValue = (data2.datasets[0].data[1] + data2.datasets[2].data[1]).toFixed(2);

            expect(typeof result).toBe('string');
            expect(result.includes(nameToCheck)).toBe(true);
            expect(result.includes(totalValue)).toBe(true);
        });

        test('should return empty string for duplicate datasets', function () {
            data2.datasets[0]._tooltipSameIndexes = [7, 6, 5];
            const result = labelCallback(tooltipItem2, data2, calcOptionsDefault);

            expect(result).toBe('');
        });
    });

    test('should return empty string if empty label passed', function () {
        const data2 = {
            datasets: deepClone(datasets),
        };
        data2.datasets[0].label = '';
        const result = labelCallback(tooltipItem, data2, calcOptionsDefault);

        expect(result).toBe('');
    });
});
