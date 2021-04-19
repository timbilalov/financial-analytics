import {BANK_DEPOSIT_LABEL, CALC_METHODS, INDEX_FUND_LABEL, OWN_MONEY_LABEL, TOTAL_LABEL} from "@constants";
import {prepareSingleDataset} from "./datasets-single";
import {getDatesFullArray, getSingleAssetData, calcBankDeposit, calcIndexFund, calcOwnMoney, calcTotal} from "@data";
import type {TAsset, TAssetCommon, TAssetData, TAssets, TCalcOptions, TDatasets, TDate} from "@types";

export async function prepareDatasets(assets: TAssets, calcOptions: TCalcOptions): Promise<TDatasets> {
    const datasets: TDatasets = [];
    const {method} = calcOptions;
    const datesFullArray = getDatesFullArray(assets);

    for (const asset of assets) {
        const singleDataset = await prepareSingleDataset(asset, calcOptions, datesFullArray);
        datasets.push(singleDataset);
    }

    const innerDatasets = datasets.slice(0);

    // Total
    if (assets.length > 1) {
        const assetTotal: TAssetCommon = {
            title: TOTAL_LABEL,
            data: calcTotal(innerDatasets, calcOptions),
        };
        const datasetTotal = await prepareSingleDataset(assetTotal, calcOptions, datesFullArray);
        datasets.push(datasetTotal)
    }

    // Bank depo
    const assetBankDepo: TAssetCommon = {
        title: BANK_DEPOSIT_LABEL,
        data: await calcBankDeposit(innerDatasets, calcOptions),
    };
    const datasetBankDeposit = await prepareSingleDataset(assetBankDepo, calcOptions, datesFullArray);
    datasets.push(datasetBankDeposit);

    // Index fund
    const assetIndexFund: TAssetCommon = {
        title: INDEX_FUND_LABEL,
        data: await calcIndexFund(innerDatasets, calcOptions),
    };
    const datasetIndexFund = await prepareSingleDataset(assetIndexFund, calcOptions, datesFullArray);
    datasets.push(datasetIndexFund);

    // Own money
    if (method === CALC_METHODS.ABSOLUTE_TOTAL) {
        const assetOwnMoney: TAssetCommon = {
            title: OWN_MONEY_LABEL,
            data: await calcOwnMoney(innerDatasets, calcOptions),
        };
        const datasetOwnMoney = await prepareSingleDataset(assetOwnMoney, calcOptions, datesFullArray);
        datasets.push(datasetOwnMoney);
    }

    return datasets;
}
