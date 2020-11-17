<script>
    import { CALC_METHODS, STORAGE_KEYS, CALC_CURRENCIES } from "@constants";
    import Storage from '@utils/storage';
    import {fetchUsd, getAllDatesInterval, getAssetsData, parseResponseDataUsd} from '@data';
    import { prepareDatasets, buildChart, locales } from '@presentation';
    import Personal from './Personal.svelte';

    let chart;
    let currentPortfolio = Storage.get(STORAGE_KEYS.portfolio) || 'default';
    let currentPortfolioSaved = currentPortfolio;
    let portfolioList = Storage.get(STORAGE_KEYS.portfolioList) || [currentPortfolio];
    let newPortfolioTitle = '';
    let portfoliosData = Storage.get(STORAGE_KEYS.portfoliosData) || {};
    let currentPortfolioData = portfoliosData[currentPortfolio] || {};
    let datasets = Storage.get(STORAGE_KEYS.datasets) || [];
    let datesFullArray = Storage.get(STORAGE_KEYS.datesFullArray) || [];
    let currentAssets = currentPortfolioData.assets || [];
    let calcMethod = Storage.get(STORAGE_KEYS.calcMethod) || CALC_METHODS.RELATIVE;
    let calcMethodSaved = calcMethod;
    let calcCurrency = Storage.get(STORAGE_KEYS.calcCurrency) || CALC_CURRENCIES.RUB;
    let calcCurrencySaved = calcCurrency;
    let legendItems = [];
    let datasetsColors = {};

    console.log('portfoliosData', portfoliosData)

    $: {
        // TODO: Хз как добиться внятного поведения без такого хака. Поизучать...
        if (currentPortfolio && currentPortfolio !== currentPortfolioSaved) {
            currentPortfolioSaved = currentPortfolio;
            Storage.set(STORAGE_KEYS.portfolio, currentPortfolio);

            currentPortfolioData = portfoliosData[currentPortfolio] || {};
            currentAssets = currentPortfolioData.assets || [];
            update(currentAssets, true);
        }

        if (calcMethod && calcMethod !== calcMethodSaved) {
            calcMethodSaved = calcMethod;
            Storage.set(STORAGE_KEYS.calcMethod, calcMethod);
            update(currentAssets, true);
        }

        if (calcCurrency && calcCurrency !== calcCurrencySaved) {
            calcCurrencySaved = calcCurrency;
            Storage.set(STORAGE_KEYS.calcCurrency, calcCurrency);
            update(currentAssets, true);
        }
    }

    function addPortfolio() {
        if (newPortfolioTitle.trim() === '' || portfolioList.includes(newPortfolioTitle)) {
            return;
        }

        portfolioList.push(newPortfolioTitle);
        portfolioList = portfolioList;
        Storage.set(STORAGE_KEYS.portfolioList, portfolioList);

        newPortfolioTitle = '';
    }

    function removePortfolio(portfolio) {
        const index = portfolioList.indexOf(portfolio);

        if (index === -1) {
            return;
        }

        portfolioList.splice(index, 1);
        portfolioList = portfolioList;
        Storage.set(STORAGE_KEYS.portfolioList, portfolioList);

        if (portfolio === currentPortfolio) {
            currentPortfolio = portfolioList[0];
        }
    }

    function savePortfolioData(params) {
        currentPortfolioData = Object.assign({}, currentPortfolioData, params);
        portfoliosData[currentPortfolio] = currentPortfolioData;
        Storage.set(STORAGE_KEYS.portfoliosData, portfoliosData);
    }

    function handleUpdateAssets(event) {
        const { assets } = event.detail;

        savePortfolioData({
            assets,
        });

        update(assets);
    }

    async function update(assets = currentAssets) {
        const items = await getAssetsData(assets);

        if (items === undefined || items.length === 0) {
            return;
        }

        const datesFullArray = getAllDatesInterval(items);
        const usdDataRaw = await fetchUsd(datesFullArray);
        const usdData = parseResponseDataUsd(usdDataRaw, datesFullArray);

        console.log('usdData', usdData);

        datasets = await prepareDatasets(items, datesFullArray, usdData, calcMethod, datasetsColors, calcCurrency);
        Storage.set(STORAGE_KEYS.datasets, datasets);

        setTimeout(() => {
            chart = buildChart(datasets, calcMethod, datesFullArray, chart, legendItems, usdData, calcCurrency);
        }, 200);
    }

    update();
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
</style>

<div class="controls">
    <b>{locales('common.portfolio')}</b>:
    <br>
    {#each portfolioList as item}
        <label style="display: inline-block;">
            <input type="radio" bind:group={currentPortfolio} value={item}>
            <span>{item}</span>
        </label>
        {#if portfolioList.length > 1}
            <button on:click={removePortfolio(item)}>{locales('actions.remove')}</button>
        {/if}
        <br>
    {/each}
    <input type="text" bind:value={newPortfolioTitle}><button on:click={addPortfolio}>{locales('actions.add')}</button>

    <hr>
    <b>{locales('common.calc')}</b>:
    <br>
    <label>
        <input type="radio" bind:group={calcMethod} value={CALC_METHODS.RELATIVE}>
        <span>{locales('calcMethod.relative')}</span>
    </label>
    <br>
    <label>
        <input type="radio" bind:group={calcMethod} value={CALC_METHODS.ABSOLUTE}>
        <span>{locales('calcMethod.absolute')}</span>
    </label>
    <br>
    <label>
        <input type="radio" bind:group={calcMethod} value={CALC_METHODS.ABSOLUTE_TOTAL}>
        <span>{locales('calcMethod.absoluteTotal')}</span>
    </label>

    <hr>

    <label>
        <input type="radio" bind:group={calcCurrency} value={CALC_CURRENCIES.RUB}>
        <span>{locales('calcCurrency.rub')}</span>
    </label>
    <br>
    <label>
        <input type="radio" bind:group={calcCurrency} value={CALC_CURRENCIES.USD}>
        <span>{locales('calcCurrency.usd')}</span>
    </label>

    <hr>

    <Personal assets={currentAssets} on:updateAssets={handleUpdateAssets} />
</div>

<div class="chart-container">
    <canvas id="myChart" width="400" height="400"></canvas>
</div>
