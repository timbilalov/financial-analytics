<script>
    import Chart from '@containers/chart/Chart.svelte';
    import Controls from '@containers/controls/Controls.svelte';
    import {
        portfoliosStore,
        calcStore,
        setUsdData,
        setDatesFullArray,
        datesStore,
        usdDataStore,
        indexFundDataStore, setIndexFundData
    } from "@store";
    import {buildChart, prepareDatasets} from "@presentation";
    import {checkImportUrl, debounce, deepClone} from "@helpers";
    import {fetchIndexFund, fetchUsd, getAllDatesInterval, getAssetsData, parseResponseDataUsd} from "@data";

    checkImportUrl();

    function prepareOptions() {
        const calcState = calcStore.getState();
        const datesState = datesStore.getState();
        const usdDataState = usdDataStore.getState();
        const indexFundDataState = indexFundDataStore.getState();

        const datesFullArray = datesState;
        const calcCurrency = calcState.currency;
        const calcMethod = calcState.method;
        const useTaxes = calcState.uses.taxes;
        const usdData = usdDataState;
        const indexFundData = indexFundDataState;

        const options = {
            datesFullArray,
            calcCurrency,
            calcMethod,
            useTaxes,
            usdData,
            indexFundData,
        };

        return options;
    }

    const debouncedUpdate = debounce(async function () {
        const portfolios = portfoliosStore.getState();
        const currentPortfolio = portfolios.list.filter(item => item.name === portfolios.current)[0];
        const assets = deepClone(currentPortfolio.assets);
        const items = await getAssetsData(assets);

        if (items === undefined || items.length === 0) {
            return;
        }

        const datesFullArray = getAllDatesInterval(items);
        const usdDataRaw = await fetchUsd(datesFullArray);
        const usdData = parseResponseDataUsd(usdDataRaw, datesFullArray);
        const indexFundDataRaw = await fetchIndexFund(datesFullArray);
        const indexFundData = parseResponseDataUsd(indexFundDataRaw, datesFullArray, true);

        setUsdData(usdData);
        setIndexFundData(indexFundData);
        setDatesFullArray(datesFullArray);

        const options = prepareOptions();
        const datasets = await prepareDatasets(items, options);

        setTimeout(() => {
            buildChart(datasets, options);
        }, 200);
    });

    portfoliosStore.watch(debouncedUpdate);
    calcStore.watch(debouncedUpdate);
</script>

<Controls />
<Chart />
