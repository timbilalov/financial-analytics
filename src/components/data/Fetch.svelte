<script>
    import debounce from 'lodash/debounce';
    import moment from 'moment';
    import { dateFormat } from '../../utils/helpers';
    import {DEFAULT_DATE_FORMAT} from "../../utils/constants";
    import Chart from 'chart.js';

    let query = 'AAPL';
    let data = [];
    let fetched = false;

    const handleInput = debounce(event => {
        query = event.target.value;
    }, 1500);

    $: console.log('query', query)
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

            // console.log('json', json, JSON.parse(json))
            const parsed = JSON.parse(json);
            // data = parsed.o;
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

            const data2 = data.slice(0).map(item => Object.assign({}, item));

            for (let i = 0; i < data.length; i++) {
                if (i === 0) {
                    data2[i].value = 0;
                } else {
                    data2[i].value = (data2[i].value - initialValue) / initialValue * 100;
                }
            }

            data = data; // TODO

            setTimeout(function () {
                buildChart(data, data2);
            }, 200);
            // buildChart();
            console.log('data', data, data2)
        } else {
            console.log("Ошибка HTTP: " + response.status);
        }
    }

    function buildChart(data, data2) {
        var ctx = document.getElementById('myChart');
        console.log('buildChart', ctx)
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(item => item.date),
                datasets: [
                    // {
                    //     label: 'Absolute',
                    //     backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    //     borderColor: 'rgba(255, 99, 132, 1)',
                    //     data: data.map(item => item.value),
                    //     type: 'line',
                    //     pointRadius: 0,
                    //     fill: false,
                    //     lineTension: 0,
                    //     borderWidth: 1
                    // },
                    {
                        label: 'Relative',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        data: data2.map(item => item.value),
                        type: 'line',
                        pointRadius: 0,
                        fill: false,
                        lineTension: 0,
                        borderWidth: 1
                    },
                ],
                // datasets: [{
                //     label: '# of Votes',
                //     data: [12, 19, 3, 5, 2, 3],
                //     backgroundColor: [
                //         'rgba(255, 99, 132, 0.2)',
                //         'rgba(54, 162, 235, 0.2)',
                //         'rgba(255, 206, 86, 0.2)',
                //         'rgba(75, 192, 192, 0.2)',
                //         'rgba(153, 102, 255, 0.2)',
                //         'rgba(255, 159, 64, 0.2)'
                //     ],
                //     borderColor: [
                //         'rgba(255, 99, 132, 1)',
                //         'rgba(54, 162, 235, 1)',
                //         'rgba(255, 206, 86, 1)',
                //         'rgba(75, 192, 192, 1)',
                //         'rgba(153, 102, 255, 1)',
                //         'rgba(255, 159, 64, 1)'
                //     ],
                //     borderWidth: 1
                // }]
            },
            options: {
                maintainAspectRatio: false,
                // scales: {
                //     yAxes: [{
                //         ticks: {
                //             beginAtZero: true
                //         }
                //     }]
                // },
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
