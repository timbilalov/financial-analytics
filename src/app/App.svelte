<script>
    import Chart from '@containers/chart/Chart.svelte';
    import Controls from '@containers/controls/Controls.svelte';
    import Overlay from '@containers/overlay/Overlay.svelte';

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

    let isLoading = true;

    const setLoadingState = () => {
        isLoading = true;
    };

    const unsetLoadingState = () => {
        isLoading = false;
    };

    const update = () => {
        setLoadingState();
        debouncedUpdate();
    };

    const debouncedUpdate = debounce(async function () {
        const portfolios = portfoliosStore.getState();
        const currentPortfolio = portfolios.list.filter(item => item.name === portfolios.current)[0];
        const assetsRaw = deepClone(currentPortfolio.assets);

        console.time('Time to execute: assets-all');
        const assets = await getAssetsData(assetsRaw);
        console.timeEnd('Time to execute: assets-all');

        if (assets === undefined || assets.length === 0) {
            unsetLoadingState();
            return;
        }

        const calcOptions = calcOptionsStore.getState();
        console.time('Time to execute: prepareDatasets');
        const datasets = await prepareDatasets(assets, calcOptions);
        console.timeEnd('Time to execute: prepareDatasets');

        setTimeout(() => {
            buildChart(datasets, calcOptions);
            unsetLoadingState();
        }, 200);
    });

    portfoliosStore.watch(update);
    calcOptionsStore.watch(update);
</script>

<Controls />
<Chart />
<Overlay loading="{isLoading}" />
