import Chart from "chart.js";
import {onLegendClick} from "./chart-legend-click";
import {labelCallback} from "./chart-label-callback";
import {labelsFilter} from "./chart-labels-filter";

export function buildChart(datasets, calcMethod, datesFullArray, chartToLink, legendItemsToLink, usdData, calcCurrency) {
    console.log('buildChart', datasets);

    if (!datasets || !datasets.length) {
        return;
    }

    const ctx = document.getElementById('myChart');
    const labels = datasets[0].dates;

    if (chartToLink !== undefined && typeof chartToLink.destroy === 'function') {
        chartToLink.destroy();
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
                        return labelCallback(tooltipItem, data, calcMethod);
                    },
                },
            },
            legend: {
                labels: {
                    filter: function (item) {
                        return labelsFilter(item, legendItemsToLink);
                    },
                },
                onClick: function(e, legendItem) {
                    Chart.defaults.global.legend.onClick.call(this, e, legendItem);
                    onLegendClick.call(this, legendItem, chart, calcMethod, datasets, datesFullArray, legendItemsToLink, usdData, calcCurrency);
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

    legendItemsToLink.splice(0, legendItemsToLink.length);
    chart.update();

    return chart;
}
