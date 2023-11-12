import {
    BANK_DEPOSIT_LABEL,
    CALC_METHODS,
    EARNED_MONEY_LABEL,
    FREE_MONEY_LABEL,
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
import { errorHandler } from '@helpers';

const ERROR_MESSAGE = `Something wrong with 'prepareDatasets' method.`;

export async function prepareDatasets(assets: TAssets, calcOptions: TCalcOptions): Promise<TDatasets> {
    const datasets: TDatasets = [];
    const { method } = calcOptions;
    const datesFullArray = getDatesFullArray(assets);

    const datasetsData = await calcDatasetsData(assets, calcOptions);

    for (const asset of assets) {
        const assetTitle = asset.title ?? asset.ticker;
        const values = datasetsData.get(asset);
        if (!values) {
            errorHandler(ERROR_MESSAGE);
            continue;
        }
        const singleDataset = await prepareSingleDataset(assetTitle, values, datesFullArray, asset);
        if (singleDataset) {
            datasets.push(singleDataset);
        }
    }

    // Total
    if (method === CALC_METHODS.ABSOLUTE_TOTAL || assets.length > 1) {
        const datasetTotal = await prepareSingleDataset(TOTAL_LABEL, datasetsData.get(TOTAL_LABEL)!, datesFullArray);
        if (datasetTotal) {
            datasets.push(datasetTotal)
        }
    }

    // Bank depo
    const datasetBankDeposit = await prepareSingleDataset(BANK_DEPOSIT_LABEL, datasetsData.get(BANK_DEPOSIT_LABEL)!, datesFullArray);
    if (datasetBankDeposit) {
        datasets.push(datasetBankDeposit)
    }

    // Index fund
    const datasetIndexFund = await prepareSingleDataset(INDEX_FUND_LABEL, datasetsData.get(INDEX_FUND_LABEL)!, datesFullArray);
    if (datasetIndexFund) {
        datasets.push(datasetIndexFund)
    }

    if (method === CALC_METHODS.ABSOLUTE_TOTAL) {
        // Own money
        const datasetOwnMoney = await prepareSingleDataset(OWN_MONEY_LABEL, datasetsData.get(OWN_MONEY_LABEL)!, datesFullArray);
        if (datasetOwnMoney) {
            datasets.push(datasetOwnMoney)
        }

        // Earned
        const datasetEarnedMoney = await prepareSingleDataset(EARNED_MONEY_LABEL, datasetsData.get(EARNED_MONEY_LABEL)!, datesFullArray);
        if (datasetEarnedMoney) {
            datasets.push(datasetEarnedMoney)
        }

        // Free money
        const datasetFreeMoney = await prepareSingleDataset(FREE_MONEY_LABEL, datasetsData.get(FREE_MONEY_LABEL)!, datesFullArray);
        if (datasetFreeMoney) {
            datasets.push(datasetFreeMoney)
        }
    }

    return datasets;
}
