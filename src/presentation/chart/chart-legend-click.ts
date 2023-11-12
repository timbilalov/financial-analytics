import { BANK_DEPOSIT_LABEL, EARNED_MONEY_LABEL, INDEX_FUND_LABEL, OWN_MONEY_LABEL, TOTAL_LABEL } from '@constants';
import { calcDatasetsData, getAssetsFromDatasets } from '@data';
import { clearLegendItems, chartInstanceStore } from '@store';
import { isLabelCommon } from '@helpers';
import type { TCalcOptions, TLegendItem } from '@types';

export async function onLegendClick(legendItem: TLegendItem, calcOptions: TCalcOptions): Promise<void> {
    if (!legendItem) {
        return;
    }

    const chart = chartInstanceStore.getState();
    const datasets = chart.config.data.datasets;
    const hidden = !legendItem.hidden;
    const label = datasets[legendItem.datasetIndex].label;
    const innerDatasets = datasets.filter(item => !isLabelCommon(item.label));
    datasets.filter(item => item.label === label).forEach(dataset => dataset.hidden = hidden);
    const innerVisibleDatasets = innerDatasets.filter(dataset => !dataset.hidden);
    const assets = getAssetsFromDatasets(innerVisibleDatasets);
    const datasetsData = await calcDatasetsData(assets, calcOptions);

    const totalDataset = datasets.find(item => item.label === TOTAL_LABEL);
    const totalDatasetData = datasetsData.get(TOTAL_LABEL);
    if (totalDataset && totalDatasetData) {
        totalDataset.data = totalDatasetData;
    }

    const depoDataset = datasets.find(item => item.label === BANK_DEPOSIT_LABEL);
    const depoDatasetData = datasetsData.get(BANK_DEPOSIT_LABEL);
    if (depoDataset && depoDatasetData) {
        depoDataset.data = depoDatasetData;
    }

    const ownMoneyDataset = datasets.find(item => item.label === OWN_MONEY_LABEL);
    const ownMoneyDatasetData = datasetsData.get(OWN_MONEY_LABEL);
    if (ownMoneyDataset && ownMoneyDatasetData) {
        ownMoneyDataset.data = ownMoneyDatasetData;
    }

    const indexFundDataset = datasets.find(item => item.label === INDEX_FUND_LABEL);
    const indexFundDatasetData = datasetsData.get(INDEX_FUND_LABEL);
    if (indexFundDataset && indexFundDatasetData) {
        indexFundDataset.data = indexFundDatasetData;
    }

    const earnedMoneyDataset = datasets.find(item => item.label === EARNED_MONEY_LABEL);
    const earnedMoneyDatasetData = datasetsData.get(EARNED_MONEY_LABEL);
    if (earnedMoneyDataset && earnedMoneyDatasetData) {
        earnedMoneyDataset.data = earnedMoneyDatasetData;
    }

    clearLegendItems();
    chart.update();
}
