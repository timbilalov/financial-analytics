<script>
    import debounce from 'lodash/debounce';
    import moment from 'moment';
    import { dateFormat } from '../../utils/helpers';
    import {DEFAULT_DATE_FORMAT} from "../../utils/constants";
    import Chart from 'chart.js';

    let query = 'AAPL';
    let data = [];
    let fetched = false;
    let chart;

    const handleInput = debounce(event => {
        query = event.target.value;
    }, 1500);

    $: {
        getData(query);
    }

    async function getData(symbol) {
        data = [];
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

            data = data; // TODO

            const datasets = prepareDatasets([dataRelative]); // TODO

            setTimeout(function () {
                buildChart(datasets);
            }, 200);
        } else {
            console.log("Ошибка HTTP: " + response.status);
        }
    }

    function prepareSingleDataset(data) {
        const dataset = {
            label: query,
            backgroundColor: 'rgba(54, 162, 235, 0.2)', // TODO
            borderColor: 'rgba(54, 162, 235, 1)', // TODO
            data: data.map(item => item.value),
            dates: data.map(item => item.date),
            type: 'line',
            pointRadius: 0,
            fill: false,
            lineTension: 0,
            borderWidth: 1
        };

        return dataset;
    }

    function prepareDatasets(items) {
        const datasets = [];

        for (const data of items) {
            datasets.push(prepareSingleDataset(data));
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
</style>

<input type="search" value={query} on:input={handleInput}>

{#if query !== ''}
    {#if data.length > 0}
        <div>Data count: {data.length}</div>

        <div class="chart-container">
            <canvas id="myChart" width="400" height="400"></canvas>
        </div>
    {:else if !fetched}
        <div>Searching for {query}...</div>
    {:else if fetched && data.length === 0}
        <div>nothing was found</div>
    {/if}
{/if}
