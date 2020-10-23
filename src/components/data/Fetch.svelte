<script>
    import debounce from 'lodash/debounce';
    import moment from 'moment';
    import { dateFormat } from '../../utils/helpers';
    import {DATE_FORMATS} from "../../utils/constants";
    import Chart from 'chart.js';
    import Storage from '../../utils/storage';
    import Personal from './Personal.svelte';

    const STORAGE_KEYS = {
        query: 'query',
        datasets: 'datasets',
        datesFullArray: 'datesFullArray',
        assets: 'assets', // TODO
    };

    let currentQuery = Storage.get(STORAGE_KEYS.query) || '';
    let parsedQuery = currentQuery;
    let fetched = false;
    let chart;
    let datasets = Storage.get(STORAGE_KEYS.datasets) || [];
    let datesFullArray = Storage.get(STORAGE_KEYS.datesFullArray) || [];
    let currentAssets = Storage.get(STORAGE_KEYS.assets) || [];

    const handleInput = debounce(event => {
        currentQuery = event.target.value;
    }, 1500);

    $: {
        Storage.set(STORAGE_KEYS.query, currentQuery);
        // update();
    }

    async function update(force = false) {
        await parseQuery(currentQuery, force);
        setTimeout(() => {
            buildChart(datasets);
        }, 200);
    }

    async function parseQuery(query, force = false) {
        if (query === parsedQuery && force !== true) {
            return;
        }

        parsedQuery = query;

        const symbols = query.split(',').map(item => item.trim());
        const items = [];
        for (const symbol of symbols) {
            const data = await getData(symbol);
            console.log('symbol', symbol, data)
            items.push(data);
        }

        datasets = prepareDatasets(items);
        Storage.set(STORAGE_KEYS.datasets, datasets);
    }

    async function getData(symbol, manualDateFrom, useMoex = false) {
        fetched = false;
        let dateFrom;
        let dateTo;

        if (manualDateFrom !== undefined) {
            dateFrom = moment(manualDateFrom, DATE_FORMATS.default);
            dateTo = moment();
        } else {
            dateFrom = moment(`2019.0${Math.round(Math.random() * 8) + 1}.01`, DATE_FORMATS.default);
            dateTo = moment(`2020.0${Math.round(Math.random() * 8) + 1}.01`, DATE_FORMATS.default);
        }
        const resolution = 60;
        const url = `https://investcab.ru/api/chistory?symbol=${symbol}&resolution=${resolution}&from=${dateFrom.unix()}&to=${dateTo.unix()}`;
        const url2 = `http://iss.moex.com/iss/history/engines/stock/markets/shares/securities/${symbol}/securities.json?from=${dateFrom.format(DATE_FORMATS.moex)}&to=${dateTo.format(DATE_FORMATS.moex)}`;
        const urlToFetch = useMoex ? url2 : url;
        let response = await fetch(urlToFetch);

        fetched = true;

        if (response.ok) {
            let json = await response.json();

            const data = parseResponseData(json, useMoex);
            const dataRelative = data.slice(0).map(item => Object.assign({}, item));

            if (data.length !== 0) {
                const initialValue = data[0].value;

                for (let i = 0; i < data.length; i++) {
                    if (i === 0) {
                        dataRelative[i].value = 0;
                    } else {
                        dataRelative[i].value = (dataRelative[i].value - initialValue) / initialValue * 100;
                    }
                }
            }

            return {
                title: symbol,
                data: dataRelative,
            };
        } else {
            console.log("Ошибка HTTP: " + response.status);
        }
    }

    function parseResponseData(responseData, useMoex = false) {
        if (useMoex === true) {
            return parseResponseDataMoex(responseData);
        } else {
            return parseResponseDataInvestcab(responseData);
        }
    }

    function parseResponseDataInvestcab(responseData) {
        const parsed = JSON.parse(responseData);
        const data = [];

        let prevDate;
        let prevDataObject;

        for (let i = 0; i < parsed.t.length; i++) {
            let dateUTC = parsed.t[i];
            let date = dateFormat(dateUTC);
            let value = (parsed.c[i] + parsed.o[i]) / 2;

            if (date === prevDate) {
                prevDataObject.value = (prevDataObject.value + value) / 2;
            } else {
                const dataObject = {
                    dateUTC,
                    date,
                    value,
                };

                data.push(dataObject);

                prevDate = date;
                prevDataObject = dataObject;
            }
        }

        return data;
    }

    function parseResponseDataMoex(responseData) {
        const data = [];

        const historyData = responseData.history.data;

        let prevDate;
        let prevDataObject;

        for (let i = 0; i < historyData.length; i++) {
            const item = historyData[i];

            let date = moment(item[1], DATE_FORMATS.moex).format(DATE_FORMATS.default);
            let dateUTC = moment(date, DATE_FORMATS.default).unix();
            let value = (item[6] + item[11]) / 2;

            if (date === prevDate) {
                prevDataObject.value = (prevDataObject.value + value) / 2;
            } else {
                const dataObject = {
                    dateUTC,
                    date,
                    value,
                };

                data.push(dataObject);

                prevDate = date;
                prevDataObject = dataObject;
            }
        }

        return data;
    }

    function prepareSingleDataset(title, data) {
        const getRandomNumber = () => Math.round(Math.random() * 255);
        let colorRGB = [getRandomNumber(), getRandomNumber(), getRandomNumber()];
        let opacity = 0.6;
        let borderWidth = 1;

        if (title.toLowerCase() === 'total') {
            colorRGB = [0, 0, 0];
            opacity = 1;
            borderWidth = 2;
        }

        let values;
        let dates;
        let hasBegun = false;
        let prevValue;

        if (datesFullArray.length !== 0) {
            dates = datesFullArray.slice(0);
            values = [];

            for (const [index, date] of dates.entries()) {
                let valueByDate;
                const itemFilteredByDate = data.filter(item => item.date === date)[0];
                if (itemFilteredByDate !== undefined) {
                    valueByDate = itemFilteredByDate.value;
                    hasBegun = true;
                    prevValue = valueByDate;
                } else {
                    if (!hasBegun) {
                        valueByDate = NaN;
                    } else {
                        valueByDate = prevValue;
                    }
                }
                values.push(valueByDate);
            }
        } else {
            dates = data.map(item => item.date);
            values = data.map(item => item.value);
        }

        const dataset = {
            label: title.toUpperCase(),
            backgroundColor: `rgba(${colorRGB.join(', ')}, 0.2)`,
            borderColor: `rgba(${colorRGB.join(', ')}, ${opacity})`,
            data: values,
            dates: dates,
            type: 'line',
            pointRadius: 0,
            fill: false,
            lineTension: 0,
            borderWidth,
        };

        return dataset;
    }

    // TODO: Как минимум, отрефакторить. Как максимум, ещё раз проанализировать верность расчётов.
    function calcTotal(datasets) {
        datasets = datasets.filter(dataset => dataset.isHidden !== true);

        const total = [];
        const dates = datesFullArray;

        let prevTotal = 0;
        let prevSavedTotal = 0;
        let currentNonZeroCount = 0;
        let prevSavedValues = [];

        for (const i in dates) {
            let totalValue = 0;
            let totalValue2 = 0;
            let nonZeroCount = 0;
            let nonZeroCount2 = 0;

            for (const j in datasets) {
                const dataset = datasets[j];
                const value = dataset.data[i];

                if (!isNaN(value) && value !== null) {
                    nonZeroCount += 1;
                    if (value !== 0 || (value === 0 && !!prevSavedValues[j])) {
                        nonZeroCount2 += 1;
                    }
                }
            }

            if (nonZeroCount !== currentNonZeroCount) {
                currentNonZeroCount = nonZeroCount;
                prevSavedTotal = prevTotal;
                if (i > 0) {
                    prevSavedTotal = total[i - 1].value;
                    for (const j in datasets) {
                        const dataset = datasets[j];
                        const value = dataset.data[i - 1];

                        if (!isNaN(value) && value !== null) {
                            prevSavedValues[j] = value;
                        }
                    }
                }
            }

            for (const j in datasets) {
                const dataset = datasets[j];
                const value = dataset.data[i];

                if (isNaN(value) || value === null) {
                    continue;
                }

                let prevSavedValue = prevSavedValues[j];
                if (prevSavedValue === undefined || isNaN(prevSavedValue)) {
                    prevSavedValue = 0;
                }

                totalValue += value - prevSavedValue;
            }

            if (nonZeroCount !== 0) {
                totalValue2 = prevSavedTotal + totalValue / nonZeroCount;
            } else {
                totalValue2 = prevSavedTotal;
            }

            total.push({
                value: totalValue2,
                date: dates[i],
            });

            prevTotal = totalValue;
        }

        return total;
    }

    function prepareDatasets(items) {
        const datasets = [];
        datesFullArray = [];

        for (const {data} of items) {
            const dates = data.map(item => item.date);

            for (const date of dates) {
                if (!datesFullArray.includes(date)) {
                    datesFullArray.push(date);
                }
            }
        }

        datesFullArray.sort();
        Storage.set(STORAGE_KEYS.datesFullArray, datesFullArray);

        for (const {title, data} of items) {
            datasets.push(prepareSingleDataset(title, data));
        }

        if (items.length > 1) {
            datasets.push(prepareSingleDataset('Total', calcTotal(datasets.slice(0))))
        }

        return datasets;
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
                        label: function(tooltipItem, myData) {
                            var label = myData.datasets[tooltipItem.datasetIndex].label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += parseFloat(tooltipItem.value).toFixed(2);

                            return label;
                        }
                    }
                },
                legend: {
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
        chart.update();

        return chart;
    }

    function onLegendClick(legendItem) {
        const isHidden = !legendItem.hidden;
        datasets[legendItem.datasetIndex].isHidden = isHidden;

        const newTotal = calcTotal(datasets.slice(0, datasets.length - 1));
        const chartDatasets = chart.config.data.datasets;
        const currentTotalDataset = chartDatasets[chartDatasets.length - 1];

        currentTotalDataset.data = newTotal.map(item => item.value);
        currentTotalDataset.dates = newTotal.map(item => item.date);

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

        for (const { ticker, buyDate, moex } of assets) {
            const isMoex = moex === true || moex === '1';
            const data = await getData(ticker, buyDate, isMoex);
            console.log('ticker', ticker, buyDate, data)
            if (data) {
                items.push(data);
            }
        }

        datasets = prepareDatasets(items);
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
        top: 10px;
        background-color: #fff;
        padding: 10px;
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
    <input type="search" value={currentQuery} on:input={handleInput}>

    {#if currentQuery !== ''}
        {#if datasets.length > 0}
            <div>Data count: {datasets[0].data.length}</div>

        {:else if !fetched}
            <div>Searching for {currentQuery}...</div>
        {:else if fetched && datasets.length === 0}
            <div>nothing was found</div>
        {/if}
    {/if}

    <div>
        <br>
        <button on:click={() => update2(currentAssets, true)}>force refresh</button>
    </div>

    <hr>

    <Personal on:updateAssets={handleUpdateAssets} />
</div>

<div class="chart-container">
    <canvas id="myChart" width="400" height="400"></canvas>
</div>
