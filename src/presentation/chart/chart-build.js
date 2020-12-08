import Chart from "chart.js";
import {onLegendClick} from "./chart-legend-click";
import {labelCallback} from "./chart-label-callback";
import {labelsFilter} from "./chart-labels-filter";
import {chartInstanceStore, clearLegendItems, setChartInstance} from "@store";

export function buildChart(datasets, options) {
    console.log('buildChart', datasets);

    if (!datasets || !datasets.length) {
        return;
    }

    const ctx = document.getElementById('myChart');
    const labels = datasets[0].dates;
    const existingChartInstance = chartInstanceStore.getState();

    if (existingChartInstance !== undefined && typeof existingChartInstance.destroy === 'function') {
        existingChartInstance.destroy();
    }

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets,
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                intersect: false,
                mode: 'index',
                callbacks: {
                    label: function (tooltipItem, data) {
                        return labelCallback(tooltipItem, data, options);
                    },
                },
            },
            legend: {
                labels: {
                    filter: labelsFilter,
                },
                onClick: function(e, legendItem) {
                    Chart.defaults.global.legend.onClick.call(this, e, legendItem);
                    onLegendClick.call(this, legendItem, options);
                }
            },
        }
    });

    const optionsYAxes = chart.config.options.scales.yAxes[0];
    const optionsYAxesID = optionsYAxes.id;
    const currentYAxes = chart.scales[optionsYAxesID];
    const currentYMin = currentYAxes.min;
    const currentYMax = currentYAxes.max;

    optionsYAxes.ticks.min = currentYMin;
    optionsYAxes.ticks.max = currentYMax;

    clearLegendItems();
    chart.update();
    setChartInstance(chart);

    return chart;
}
