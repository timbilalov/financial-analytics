import { BANK_DEPOSIT_LABEL, EARNED_MONEY_LABEL, INDEX_FUND_LABEL, OWN_MONEY_LABEL, TOTAL_LABEL } from '@constants';
import { calcDatasetsData } from '@data';
import { clearLegendItems, chartInstanceStore } from '@store';
import { isLabelCommon } from '@helpers';
import type { TCalcOptions, TLegendItem } from '@types';

// TODO: Здесь такая же логика, как и при первичном формировании датасетов. Можно вынести в общую функцию.
export async function onLegendClick(legendItem: TLegendItem, calcOptions: TCalcOptions): Promise<void> {
    const chart = chartInstanceStore.getState();
    const datasets = chart.config.data.datasets;
    const hidden = !legendItem.hidden;
    const label = datasets[legendItem.datasetIndex].label;
    const innerDatasets = datasets.filter(item => !isLabelCommon(item.label));
    datasets.filter(item => item.label === label).forEach(dataset => dataset.hidden = hidden);
    const datasetsData = await calcDatasetsData(innerDatasets, calcOptions);

    const currentTotalDataset = datasets.find(item => item.label === TOTAL_LABEL);
    if (currentTotalDataset) {
        currentTotalDataset.data = datasetsData.map(item => item.values.total);
    }

    const currentDepoDataset = datasets.find(item => item.label === BANK_DEPOSIT_LABEL);
    if (currentDepoDataset) {
        currentDepoDataset.data = datasetsData.map(item => item.values.bankDeposit);
    }

    const currentOwnDataset = datasets.find(item => item.label === OWN_MONEY_LABEL);
    if (currentOwnDataset) {
        currentOwnDataset.data = datasetsData.map(item => item.values.own);
    }

    const currentIndexFundDataset = datasets.find(item => item.label === INDEX_FUND_LABEL);
    if (currentIndexFundDataset) {
        currentIndexFundDataset.data = datasetsData.map(item => item.values.indexFund);
    }

    const currentEarnedMoneyDataset = datasets.find(item => item.label === EARNED_MONEY_LABEL);
    if (currentEarnedMoneyDataset) {
        currentEarnedMoneyDataset.data = datasetsData.map(item => item.values.earned);
    }

    clearLegendItems();
    chart.update();
}
