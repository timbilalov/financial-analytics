import Chart from "chart.js";
import {buildChart} from "@presentation";
import {datasets, options} from "../../constants";
import {isObject} from "@helpers";

jest.mock("chart.js");

const chartMockUpdate = jest.fn();
const chartMock = () => {
    return {
        config: {
            options: {
                scales: {
                    yAxes: [
                        {
                            id: 'tst-axes-y-1',
                            ticks: {
                                min: -5,
                                max: 20,
                            },
                        },
                    ],
                },
            },
        },
        scales: {
            'tst-axes-y-1': {
                min: 5,
                max: 10,
            },
        },
        update: chartMockUpdate,
    };
};

Chart.mockImplementation(chartMock);

beforeEach(() => {
    Chart.mockClear();
});

describe('chart-build', function () {
    test('should return undefined for wrong arguments', function () {
        const result1 = buildChart();
        const result2 = buildChart(100);
        const result3 = buildChart(datasets, 'str');
        const result4 = buildChart(null, options);
        const result5 = buildChart(function () { return 2}, [2, 5, 's']);

        expect(result1).toBe(undefined);
        expect(result2).toBe(undefined);
        expect(result3).toBe(undefined);
        expect(result4).toBe(undefined);
        expect(result5).toBe(undefined);
    });

    test('should return chart instance', function () {
        const result = buildChart(datasets, options);

        expect(isObject(result)).toBe(true);
        expect(chartMockUpdate).toHaveBeenCalledTimes(1);
    });
});
