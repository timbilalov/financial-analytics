<script>
    import { CALC_METHODS, STORAGE_KEYS } from "@constants";
    import Storage from '@utils/storage';
    import { getAssetsData } from '@data';
    import { prepareDatasets, buildChart } from '@presentation';
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

    function handleUpdateAssets(event) {
        const { assets } = event.detail;
        update2(assets);
    }

    async function update2(assets = currentAssets, force = false) {
        const items = await getAssetsData(assets, force, currentAssets);

        if (!items || items.length === 0) {
            return;
        }

        if (items !== undefined) {
            datasets = await prepareDatasets(items, datesFullArray, usdData, calcMethod, datasetsColors);
            Storage.set(STORAGE_KEYS.datasets, datasets);
        }

        setTimeout(() => {
            chart = buildChart(datasets, calcMethod, datesFullArray, chart, legendItems);
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
    <div>Data count: {(datasets || [])[0]?.data?.length || 0}</div>

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
