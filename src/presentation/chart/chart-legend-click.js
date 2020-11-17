import {CALC_METHODS} from "@constants";
import {calcBankDeposit, calcOwnMoney, calcTotal} from "@logic";

export function onLegendClick(legendItem, chart, calcMethod, datasets, datesFullArray, legendItemsToLink, usdData, calcCurrency) {
    const hidden = !legendItem.hidden;
    const label = datasets[legendItem.datasetIndex].label;

    datasets.filter(item => item.label === label).forEach(dataset => dataset.hidden = hidden);

    let fromEndCount = 2;

    if (calcMethod === CALC_METHODS.ABSOLUTE_TOTAL) {
        fromEndCount = 3;
    }

    const innerDatasets = datasets.slice(0, datasets.length - fromEndCount);
    const chartDatasets = chart.config.data.datasets;

    const newTotal = calcTotal(innerDatasets, calcMethod);
    const currentTotalDataset = chartDatasets[chartDatasets.length - fromEndCount];
    currentTotalDataset.data = newTotal.map(item => item.value);
    currentTotalDataset.dates = newTotal.map(item => item.date);

    const newDepo = calcBankDeposit(innerDatasets, datesFullArray, calcMethod, usdData, calcCurrency);
    const currentDepoDataset = chartDatasets[chartDatasets.length - fromEndCount + 1];
    currentDepoDataset.data = newDepo.map(item => item.value);
    currentDepoDataset.dates = newDepo.map(item => item.date);

    if (calcMethod === CALC_METHODS.ABSOLUTE_TOTAL) {
        const newOwn = calcOwnMoney(innerDatasets, datesFullArray, usdData, calcCurrency);
        const currentOwnDataset = chartDatasets[chartDatasets.length - fromEndCount + 2];
        currentOwnDataset.data = newOwn.map(item => item.value);
        currentOwnDataset.dates = newOwn.map(item => item.date);
    }

    legendItemsToLink.splice(0, legendItemsToLink.length);
    chart.update();
}
