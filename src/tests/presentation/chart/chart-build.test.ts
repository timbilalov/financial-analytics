import Chart from "chart.js";
import {buildChart} from "@presentation";
import {calcOptionsDefault, datasets, dates, indexFundData, options, usdData} from "@test-constants";
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
            // return config.options.tooltips.callbacks.label();
        }),
        legendClick: jest.fn(function () {
            // return config.options.legend.onClick();
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

    test('should return chart instance', async function () {
        const chartInstance = await buildChart(datasets, calcOptionsDefault);

        expect(isObject(chartInstance)).toBe(true);
        expect(chartMockUpdate).toHaveBeenCalledTimes(1);
        expect(chartMockDestroy).toHaveBeenCalledTimes(0);
    });

    test('should return undefined if no datasets passed', async function () {
        const result = await buildChart([], calcOptionsDefault);

        expect(result).toBe(undefined);
    });

    test('should destroy previous chart instance', async function () {
        const chartInstance1 = await buildChart(datasets, calcOptionsDefault);
        const chartInstance2 = await buildChart(datasets, calcOptionsDefault);
        const chartInstance3 = await buildChart(datasets, calcOptionsDefault);

        expect(chartMockDestroy).toHaveBeenCalledTimes(2);
        expect(chartInstance2).not.toBe(chartInstance1);
        expect(chartInstance3).not.toBe(chartInstance2);
    });
});
