<script>
    import Chart from '@containers/chart/Chart.svelte';
    import Controls from '@containers/controls/Controls.svelte';
    import {portfoliosStore, calcStore, setUsdData, setDatesFullArray, datesStore, usdDataStore} from "@store";
    import {buildChart, prepareDatasets} from "@presentation";
    import {debounce, deepClone} from "@helpers";
    import {fetchUsd, getAllDatesInterval, getAssetsData, parseResponseDataUsd} from "@data";

    function prepareOptions() {
        const calcState = calcStore.getState();
        const datesState = datesStore.getState();
        const usdDataState = usdDataStore.getState();

        const datesFullArray = datesState;
        const calcCurrency = calcState.currency;
        const calcMethod = calcState.method;
        const useTaxes = calcState.uses.taxes;
        const usdData = usdDataState;

        const options = {
            datesFullArray,
            calcCurrency,
            calcMethod,
            useTaxes,
            usdData,
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

        setUsdData(usdData);
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
