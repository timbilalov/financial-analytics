import Chart from "chart.js";
import {buildChart} from "@presentation";
import {datasets, options} from "../../constants";
import {isObject} from "@helpers";
import {resetChartInstance} from "@store";

jest.mock("chart.js");

const chartMockUpdate = jest.fn();
const chartMockDestroy = jest.fn();
const chartMock = (ctx, config) => {
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
        destroy: chartMockDestroy,
        labelCallback: jest.fn(function () {
            return config.options.tooltips.callbacks.label();
        }),
        legendClick: jest.fn(function () {
            return config.options.legend.onClick();
        }),
    };
};

Chart.mockImplementation(chartMock);

describe('chart-build', function () {
    beforeEach(() => {
        Chart.mockClear();
        chartMockUpdate.mockClear();
        chartMockDestroy.mockClear();
        resetChartInstance();
    });

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
        const chartInstance = buildChart(datasets, options);
        chartInstance.labelCallback();
        chartInstance.legendClick();

        expect(isObject(chartInstance)).toBe(true);
        expect(chartMockUpdate).toHaveBeenCalledTimes(1);
        expect(chartMockDestroy).toHaveBeenCalledTimes(0);
    });

    test('should destroy existing chart instance', function () {
        buildChart(datasets, options);
        buildChart(datasets, options);
        buildChart(datasets, options);

        expect(chartMockDestroy).toHaveBeenCalledTimes(2);
    });
});
