import {labelCallback} from "@presentation";
import {datasets, options} from "../../constants";
import {CALC_METHODS} from "@constants";

describe('chart-label-callback', function () {
    const valueToCheck = '110';
    const nameToCheck = 'tst-1';

    const tooltipItem = {
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

    test('should return undefined for wrong arguments', function () {
        const result1 = labelCallback();
        const result2 = labelCallback(100);
        const result3 = labelCallback(tooltipItem, 'str');
        const result4 = labelCallback(tooltipItem, data, function () { return 2 });
        const result5 = labelCallback([2, 's'], 100500, options);

        expect(result1).toBe(undefined);
        expect(result2).toBe(undefined);
        expect(result3).toBe(undefined);
        expect(result4).toBe(undefined);
        expect(result5).toBe(undefined);
    });

    test('should return text string with single value', function () {
        const result = labelCallback(tooltipItem, data, options);

        expect(typeof result).toBe('string');
        expect(result.includes(nameToCheck)).toBe(true);
        expect(result.includes(valueToCheck)).toBe(true);
    });

    describe('multiple values', function () {
        const tooltipItem2 = Object.assign({}, tooltipItem, {
            label: '2020.01.02',
        });
        const data2 = Object.assign({}, data);
        data2.datasets = data2.datasets.slice();
        data2.datasets.push(Object.assign({}, datasets[0], {
            data: [11, 21, 31, 41],
            label: nameToCheck,
        }));

        test('should return string with array of values', function () {
            const result = labelCallback(tooltipItem2, data2, options);

            expect(typeof result).toBe('string');
            expect(result.includes(nameToCheck)).toBe(true);
            expect(result.includes(data2.datasets[0].data[1])).toBe(true);
            expect(result.includes(data2.datasets[2].data[1])).toBe(true);
        });

        test('should contain average value for relative method', function () {
            const options2 = Object.assign({}, options, {
                calcMethod: CALC_METHODS.RELATIVE,
            });
            const result = labelCallback(tooltipItem2, data2, options2);
            const averageValue = ((data2.datasets[0].data[1] + data2.datasets[2].data[1]) / 2).toFixed(2);

            expect(typeof result).toBe('string');
            expect(result.includes(nameToCheck)).toBe(true);
            expect(result.includes(averageValue)).toBe(true);
        });

        test('should contain total value for absolute methods', function () {
            const options2 = Object.assign({}, options, {
                calcMethod: CALC_METHODS.ABSOLUTE,
            });
            const result = labelCallback(tooltipItem2, data2, options2);
            const totalValue = (data2.datasets[0].data[1] + data2.datasets[2].data[1]).toFixed(2);

            expect(typeof result).toBe('string');
            expect(result.includes(nameToCheck)).toBe(true);
            expect(result.includes(totalValue)).toBe(true);
        });

        test('should return undefined for duplicate datasets', function () {
            data2.datasets[0]._tooltipSameIndexes = [7, 6, 5];
            const result = labelCallback(tooltipItem2, data2, options);

            expect(result).toBe(undefined);
        });
    });

    test('should return empty string if no label passed', function () {
        const data2 = {
            datasets,
        };
        const result = labelCallback(tooltipItem, data2, options);

        expect(result).toBe('');
    });
});
