<script>
    import debounce from 'lodash/debounce';
    import moment from 'moment';
    import { dateFormat } from '../../utils/helpers';
    import {DEFAULT_DATE_FORMAT} from "../../utils/constants";
    import Chart from 'chart.js';

    let query = 'AAPL';
    let fetched = false;
    let chart;
    let datasets = [];

    const handleInput = debounce(event => {
        query = event.target.value;
    }, 1500);

    $: {
        parseQuery(query);
    }

    async function parseQuery(query) {
        const symbols = query.split(',').map(item => item.trim());
        const items = [];
        for (const symbol of symbols) {
            const data = await getData(symbol);
            console.log('symbol', symbol, data)
            items.push(data);
        }

        datasets = prepareDatasets(items);

        setTimeout(() => {
            buildChart(datasets);
        }, 200);
    }

    async function getData(symbol) {
        const data = [];
        fetched = false;
        const dateFrom = moment('2019.09.01', DEFAULT_DATE_FORMAT).unix();
        const dateTo = moment('2020.09.01', DEFAULT_DATE_FORMAT).unix();
        const resolution = 60;
        const url = `https://investcab.ru/api/chistory?symbol=${symbol}&resolution=${resolution}&from=${dateFrom}&to=${dateTo}`;
        let response = await fetch(url);
        fetched = true;

        console.log('response', response)

        if (response.ok) {
            let json = await response.json();
            let prevDate;
            let prevDataObject;
            let initialValue;

            const parsed = JSON.parse(json);

            for (let i = 0; i < parsed.t.length; i++) {
                let dateUTC = parsed.t[i];
                let date = dateFormat(dateUTC);
                let value = (parsed.c[i] + parsed.o[i]) / 2;
                if (i === 0) {
                    initialValue = value;
                }

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

            const dataRelative = data.slice(0).map(item => Object.assign({}, item));

            for (let i = 0; i < data.length; i++) {
                if (i === 0) {
                    dataRelative[i].value = 0;
                } else {
                    dataRelative[i].value = (dataRelative[i].value - initialValue) / initialValue * 100;
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

        const dataset = {
            label: title.toUpperCase(),
            backgroundColor: `rgba(${colorRGB.join(', ')}, 0.2)`,
            borderColor: `rgba(${colorRGB.join(', ')}, ${opacity})`,
            data: data.map(item => item.value),
            dates: data.map(item => item.date),
            type: 'line',
            pointRadius: 0,
            fill: false,
            lineTension: 0,
            borderWidth,
        };

        return dataset;
    }

    function calcTotal(items) {
        const total = [];

        for (let i = 0; i < items[0].data.length; i++) {
            let totalValue = 0;
            let nonZeroCount = 0;
            for (const item of items) {
                const value = item.data[i].value;
                if (value !== 0) {
                    totalValue += value;
                    nonZeroCount += 1;
                }
            }

            if (nonZeroCount !== 0) {
                totalValue = totalValue / nonZeroCount;
            }

            total.push({
                value: totalValue,
            });
        }

        return total;
    }

    function prepareDatasets(items) {
        const datasets = [];

        for (const {title, data} of items) {
            datasets.push(prepareSingleDataset(title, data));
        }

        if (items.length > 1) {
            datasets.push(prepareSingleDataset('Total', calcTotal(items)))
        }

        return datasets;
    }

    function buildChart(datasets) {
        console.log('buildChart', datasets);

        const ctx = document.getElementById('myChart');
        const labels = datasets[0].dates;

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
                            if (tooltipItem.value === '0') {
                                return false;
                            }

                            var label = myData.datasets[tooltipItem.datasetIndex].label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += parseFloat(tooltipItem.value).toFixed(2);

                            return label;
                        }
                    }
                },
            }
        });

        return chart;
    }
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
    }

    .controls input {
        text-transform: uppercase;
    }
</style>

<div class="controls">
    <input type="search" value={query} on:input={handleInput}>

    {#if query !== ''}
        {#if datasets.length > 0}
            <div>Data count: {datasets[0].data.length}</div>

        {:else if !fetched}
            <div>Searching for {query}...</div>
        {:else if fetched && datasets.length === 0}
            <div>nothing was found</div>
        {/if}
    {/if}
</div>

<div class="chart-container">
    <canvas id="myChart" width="400" height="400"></canvas>
</div>
