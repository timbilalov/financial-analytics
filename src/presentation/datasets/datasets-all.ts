import {
    BANK_DEPOSIT_LABEL,
    CALC_METHODS,
    EARNED_MONEY_LABEL,
    INDEX_FUND_LABEL,
    OWN_MONEY_LABEL,
    TOTAL_LABEL,
} from '@constants';
import { prepareSingleDataset } from './datasets-single';
import {
    calcDatasetsData,
    getDatesFullArray,
} from '@data';
import type { TAssetCommon, TAssets, TCalcOptions, TDatasets } from '@types';

export async function prepareDatasets(assets: TAssets, calcOptions: TCalcOptions): Promise<TDatasets> {
    const datasets: TDatasets = [];
    const { method } = calcOptions;
    const datesFullArray = getDatesFullArray(assets);

    for (const asset of assets) {
        const singleDataset = await prepareSingleDataset(asset, calcOptions, datesFullArray);
        if (singleDataset) {
            datasets.push(singleDataset);
        }
    }

    const innerDatasets = datasets.slice(0);
    const datasetsData = await calcDatasetsData(innerDatasets, calcOptions);

    // Total
    if (assets.length > 1) {
        const assetTotal: TAssetCommon = {
            title: TOTAL_LABEL,
            data: datasetsData.map(item => ({
                date: item.date,
                value: item.values.total,
            })),
            buyDate: datasetsData[0].date,
        };
        const datasetTotal = await prepareSingleDataset(assetTotal, calcOptions, datesFullArray);
        if (datasetTotal) {
            datasets.push(datasetTotal)
        }
    }

    // Bank depo
    const assetBankDepo: TAssetCommon = {
        title: BANK_DEPOSIT_LABEL,
        data: datasetsData.map(item => ({
            date: item.date,
            value: item.values.bankDeposit,
        })),
        buyDate: datasetsData[0].date,
    };
    const datasetBankDeposit = await prepareSingleDataset(assetBankDepo, calcOptions, datesFullArray);
    if (datasetBankDeposit) {
        datasets.push(datasetBankDeposit);
    }

    // Index fund
    const assetIndexFund: TAssetCommon = {
        title: INDEX_FUND_LABEL,
        data: datasetsData.map(item => ({
            date: item.date,
            value: item.values.indexFund,
        })),
        buyDate: datasetsData[0].date,
    };
    const datasetIndexFund = await prepareSingleDataset(assetIndexFund, calcOptions, datesFullArray);
    if (datasetIndexFund) {
        datasets.push(datasetIndexFund);
    }

    if (method === CALC_METHODS.ABSOLUTE_TOTAL) {
        // Own money
        const assetOwnMoney: TAssetCommon = {
            title: OWN_MONEY_LABEL,
            data: datasetsData.map(item => ({
                date: item.date,
                value: item.values.own,
            })),
            buyDate: datasetsData[0].date,
        };
        const datasetOwnMoney = await prepareSingleDataset(assetOwnMoney, calcOptions, datesFullArray);
        if (datasetOwnMoney) {
            datasets.push(datasetOwnMoney);
        }

        // Earned
        const assetEarnedMoney: TAssetCommon = {
            title: EARNED_MONEY_LABEL,
            data: datasetsData.map(item => ({
                date: item.date,
                value: item.values.earned,
            })),
            buyDate: datasetsData[0].date,
        };
        const datasetEarnedMoney = await prepareSingleDataset(assetEarnedMoney, calcOptions, datesFullArray);
        if (datasetEarnedMoney) {
            datasets.push(datasetEarnedMoney);
        }
    }

    return datasets;
}
