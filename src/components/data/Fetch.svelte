<script>
    import { CALC_METHODS, STORAGE_KEYS } from "../../utils/constants";
    import Chart from 'chart.js';
    import Storage from '../../utils/storage';
    import { calcTotal, calcBankDeposit, calcOwnMoney } from '../../logic';
    import { getData } from '../../data';
    import { prepareDatasets } from '../../presentation';
    import Personal from './Personal.svelte';

    let chart;
    let datasets = Storage.get(STORAGE_KEYS.datasets) || [];
    let datesFullArray = Storage.get(STORAGE_KEYS.datesFullArray) || [];
    let currentAssets = Storage.get(STORAGE_KEYS.assets) || [];
    let calcMethod = Storage.get(STORAGE_KEYS.calcMethod) || CALC_METHODS.RELATIVE;
    let calcMethodSaved = calcMethod;
    let usdData = Storage.get(STORAGE_KEYS.usdData) || [];
    let legendItems = [];
    let datasetsColors = {};

    $: {
        // TODO: Хз как добиться внятного поведения без такого хака. Поизучать...
        if (calcMethod && calcMethod !== calcMethodSaved) {
            calcMethodSaved = calcMethod;
            Storage.set(STORAGE_KEYS.calcMethod, calcMethod);
            update2(currentAssets, true);
        }
    }

    function buildChart(datasets) {
        console.log('buildChart', datasets);

        if (!datasets || !datasets.length) {
            return;
        }

        const ctx = document.getElementById('myChart');
        const labels = datasets[0].dates;

        if (chart !== undefined && typeof chart.destroy === 'function') {
            chart.destroy();
        }

        chart = new Chart(ctx, {
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
                        label: function(tooltipItem, data) {
                            const dataset = data.datasets[tooltipItem.datasetIndex];
                            const label = dataset.label;
                            const date = tooltipItem.label;
                            const sameLabelDatasets = data.datasets.filter(item => item.label === label);

                            const nonZeroLabelValues = (function () {
                                const index = sameLabelDatasets[0].dates.indexOf(date);
                                return sameLabelDatasets.filter(item => !!item.data[index]).map(item => item.data[index]);
                            })();
                            let labelText = '';

                            if (label === undefined) {
                                return '';
                            }

                            const value = tooltipItem.value;

                            sameLabelDatasets[0]._tooltipSameIndexes = sameLabelDatasets[0]._tooltipSameIndexes || [];
                            if (!sameLabelDatasets[0]._tooltipSameIndexes.includes(tooltipItem.datasetIndex)) {
                                sameLabelDatasets[0]._tooltipSameIndexes.push(tooltipItem.datasetIndex);
                            }

                            labelText = `${label}: ${parseFloat(value).toFixed(2)}`;
                            if (nonZeroLabelValues.length > 1) {
                                if (sameLabelDatasets[0]._tooltipSameIndexes.indexOf(tooltipItem.datasetIndex) > 0) {
                                    labelText = undefined;
                                } else {
                                    labelText = `${label}: [${nonZeroLabelValues.map(item => item.toFixed(2)).join(',')}]`;

                                    if (calcMethod === CALC_METHODS.RELATIVE) {
                                        labelText += `, avg ${(nonZeroLabelValues.reduce((p, c) => p + c) / nonZeroLabelValues.length).toFixed(2)}`;
                                    } else if (calcMethod === CALC_METHODS.ABSOLUTE || calcMethod === CALC_METHODS.ABSOLUTE_TOTAL) {
                                        labelText += `, total ${(nonZeroLabelValues.reduce((p, c) => p + c)).toFixed(2)}`;
                                    }
                                }
                            }

                            return labelText;
                        }
                    }
                },
                legend: {
                    labels: {
                        filter: function(item) {
                            const title = item.text.toLowerCase();

                            if (!legendItems.includes(title)) {
                                legendItems.push(title);
                                return true;
                            } else {
                                return false;
                            }
                        },
                    },
                    onClick: function(e, legendItem) {
                        Chart.defaults.global.legend.onClick.call(this, e, legendItem);
                        onLegendClick.call(this, legendItem)
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

        legendItems = [];
        chart.update();

        return chart;
    }

    function onLegendClick(legendItem) {
        const hidden = !legendItem.hidden;
        const label = datasets[legendItem.datasetIndex].label;

        datasets.filter(item => item.label === label).forEach(dataset => dataset.hidden = hidden);

        let fromEndCount = 2;

        if (calcMethod === CALC_METHODS.ABSOLUTE_TOTAL) {
            fromEndCount = 3;
        }

        const innerDatasets = datasets.slice(0, datasets.length - fromEndCount);
        const chartDatasets = chart.config.data.datasets;

        const newTotal = calcTotal(innerDatasets, datesFullArray, calcMethod);
        const currentTotalDataset = chartDatasets[chartDatasets.length - fromEndCount];
        currentTotalDataset.data = newTotal.map(item => item.value);
        currentTotalDataset.dates = newTotal.map(item => item.date);

        const newDepo = calcBankDeposit(innerDatasets, datesFullArray, calcMethod);
        const currentDepoDataset = chartDatasets[chartDatasets.length - fromEndCount + 1];
        currentDepoDataset.data = newDepo.map(item => item.value);
        currentDepoDataset.dates = newDepo.map(item => item.date);

        if (calcMethod === CALC_METHODS.ABSOLUTE_TOTAL) {
            const newOwn = calcOwnMoney(innerDatasets, datesFullArray);
            const currentOwnDataset = chartDatasets[chartDatasets.length - fromEndCount + 2];
            currentOwnDataset.data = newOwn.map(item => item.value);
            currentOwnDataset.dates = newOwn.map(item => item.date);
        }

        legendItems = [];
        chart.update();
    }

    function handleUpdateAssets(event) {
        const { assets } = event.detail;
        update2(assets);
    }

    async function getAssetsData(assets = currentAssets, force = false) {
        if (!force && (JSON.stringify(assets) === JSON.stringify(currentAssets))) { // TODO
            return;
        }

        const items = [];
        currentAssets = Array.from(assets);

        for (const { ticker, buyDate, sellDate, amount, moex, usd, hide } of assets) {
            const isMoex = moex === true || moex === '1';
            const isUsd = usd === true || usd === '1';
            const shouldHide = hide === true || hide === '1';

            if (shouldHide) {
                continue;
            }

            const data = await getData(ticker, buyDate, sellDate, amount, isMoex, isUsd);
            console.log('ticker', ticker, isUsd, buyDate, sellDate, amount, data)
            if (data) {
                items.push(data);
            }
        }

        datasets = await prepareDatasets(items, datesFullArray, usdData, calcMethod, datasetsColors);
        Storage.set(STORAGE_KEYS.datasets, datasets);
    }

    async function update2(assets = currentAssets, force = false) {
        await getAssetsData(assets, force);

        setTimeout(() => {
            buildChart(datasets);
        }, 200);
    }

    update2();
</script>

<style>
    .chart-container {
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    .controls {
        position: fixed;
        left: 10px;
        top: 40px;
        background-color: #fff;
        padding: 10px;
        overflow: auto;
        max-height: calc(100% - 40px);
        box-sizing: border-box;
        z-index: 2;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        opacity: 0.5;
    }

    .controls:hover {
        opacity: 1;
    }

    .controls input {
        text-transform: uppercase;
    }
</style>

<div class="controls">
    <div>Data count: {datasets[0]?.data?.length || 0}</div>

    <div>
        <br>
        <button on:click={() => update2(currentAssets, true)}>force refresh</button>
    </div>

    <hr>
    <label>
        <input type="radio" bind:group={calcMethod} value={CALC_METHODS.RELATIVE}>
        <span>relative</span>
    </label>
    <label>
        <input type="radio" bind:group={calcMethod} value={CALC_METHODS.ABSOLUTE}>
        <span>absolute</span>
    </label>
    <label>
        <input type="radio" bind:group={calcMethod} value={CALC_METHODS.ABSOLUTE_TOTAL}>
        <span>absolute total</span>
    </label>

    <hr>

    <Personal on:updateAssets={handleUpdateAssets} />
</div>

<div class="chart-container">
    <canvas id="myChart" width="400" height="400"></canvas>
</div>
