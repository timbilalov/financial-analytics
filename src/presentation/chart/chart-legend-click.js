import {BANK_DEPOSIT_LABEL, INDEX_FUND_LABEL, OWN_MONEY_LABEL, TOTAL_LABEL} from "@constants";
import {calcBankDeposit, calcIndexFund, calcOwnMoney, calcTotal} from "@logic";
import {clearLegendItems, chartInstanceStore} from "@store";
import {isLabelCommon, isObject} from "@helpers";

export function onLegendClick(legendItem, options) {
    if (!isObject(legendItem) || !isObject(options)) {
        return;
    }

    const chart = chartInstanceStore.getState();
    const datasets = chart.config.data.datasets;
    const hidden = !legendItem.hidden;
    const label = datasets[legendItem.datasetIndex].label;
    const innerDatasets = datasets.filter(item => isLabelCommon(item.label) === false);

    datasets.filter(item => item.label === label).forEach(dataset => dataset.hidden = hidden);

    const currentTotalDataset = datasets.filter(item => item.label === TOTAL_LABEL)[0];
    if (currentTotalDataset !== undefined) {
        const newTotal = calcTotal(innerDatasets, options);
        currentTotalDataset.data = newTotal.map(item => item.value);
        currentTotalDataset.dates = newTotal.map(item => item.date);
    }

    const currentDepoDataset = datasets.filter(item => item.label === BANK_DEPOSIT_LABEL)[0];
    if (currentDepoDataset !== undefined) {
        const newDepo = calcBankDeposit(innerDatasets, options);
        currentDepoDataset.data = newDepo.map(item => item.value);
        currentDepoDataset.dates = newDepo.map(item => item.date);
    }

    const currentOwnDataset = datasets.filter(item => item.label === OWN_MONEY_LABEL)[0];
    if (currentOwnDataset !== undefined) {
        const newOwn = calcOwnMoney(innerDatasets, options);
        currentOwnDataset.data = newOwn.map(item => item.value);
        currentOwnDataset.dates = newOwn.map(item => item.date);
    }

    const currentIndexFundDataset = datasets.filter(item => item.label === INDEX_FUND_LABEL)[0];
    if (currentIndexFundDataset !== undefined) {
        const newIndexFund = calcIndexFund(innerDatasets, options);
        currentIndexFundDataset.data = newIndexFund.map(item => item.value);
        currentIndexFundDataset.dates = newIndexFund.map(item => item.date);
    }

    clearLegendItems();
    chart.update();
}
