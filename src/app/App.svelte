<script>
    import Chart from '@containers/chart/Chart.svelte';
    import Controls from '@containers/controls/Controls.svelte';
    import {
        portfoliosStore,
        calcOptionsStore,
        setUsdData,
        setDatesFullArray,
        datesStore,
        usdDataStore,
        indexFundDataStore, setIndexFundData
    } from "@store";
    import {buildChart, prepareDatasets, checkImportUrl} from "@presentation";
    import {debounce, deepClone} from "@helpers";
    import {fetchIndexFund, fetchUsd, getDatesFullArray, getAssetsData, parseResponseDataUsd} from "@data";

    checkImportUrl();

    const debouncedUpdate = debounce(async function () {
        const portfolios = portfoliosStore.getState();
        const currentPortfolio = portfolios.list.filter(item => item.name === portfolios.current)[0];
        const assetsRaw = deepClone(currentPortfolio.assets);
        const assets = await getAssetsData(assetsRaw);

        if (assets === undefined || assets.length === 0) {
            return;
        }

        const calcOptions = calcOptionsStore.getState();
        const datasets = await prepareDatasets(assets, calcOptions);

        setTimeout(() => {
            buildChart(datasets, calcOptions);
        }, 200);
    });

    portfoliosStore.watch(debouncedUpdate);
    calcOptionsStore.watch(debouncedUpdate);
</script>

<Controls />
<Chart />
