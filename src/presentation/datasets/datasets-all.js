import {BANK_DEPOSIT_LABEL, CALC_METHODS, INDEX_FUND_LABEL, OWN_MONEY_LABEL, TOTAL_LABEL} from "@constants";
import {calcBankDeposit, calcIndexFund, calcOwnMoney, calcTotal} from "@logic";
import {prepareSingleDataset} from "./datasets-single";
import {isObject} from "@helpers";
import {getSingleAssetData} from "@data";

export async function prepareDatasets(items, options) {
    if (!Array.isArray(items) || !isObject(options) || options.usdData === undefined) {
        return [];
    }

    const datasets = [];
    const calcMethod = options.calcMethod || CALC_METHODS.RELATIVE;

    for (const item of items) {
        const singleDatasetOptions = Object.assign({}, options, item, {
            datasets,
        });
        const singleDataset = prepareSingleDataset(singleDatasetOptions);

        datasets.push(singleDataset);
    }

    const innerDatasets = datasets.slice(0);

    // Total
    if (items.length > 1) {
        const datasetTotalOptions = Object.assign({}, options, {
            datasets,
            title: TOTAL_LABEL,
            data: calcTotal(innerDatasets, options),
        });
        const datasetTotal = prepareSingleDataset(datasetTotalOptions);
        datasets.push(datasetTotal)
    }

    // Bank depo
    const datasetBankDepositOptions = Object.assign({}, options, {
        datasets,
        title: BANK_DEPOSIT_LABEL,
        data: calcBankDeposit(innerDatasets, options),
    });
    const datasetBankDeposit = prepareSingleDataset(datasetBankDepositOptions);
    datasets.push(datasetBankDeposit)

    // Index fund
    const datasetIndexFundOptions = Object.assign({}, options, {
        datasets,
        title: INDEX_FUND_LABEL,
        data: calcIndexFund(innerDatasets, options),
    });
    const datasetIndexFund = await prepareSingleDataset(datasetIndexFundOptions);
    datasets.push(datasetIndexFund)

    // Own money
    if (calcMethod === CALC_METHODS.ABSOLUTE_TOTAL) {
        const datasetOwnMoneyOptions = Object.assign({}, options, {
            datasets,
            title: OWN_MONEY_LABEL,
            data: calcOwnMoney(innerDatasets, options),
        });
        const datasetOwnMoney = prepareSingleDataset(datasetOwnMoneyOptions);
        datasets.push(datasetOwnMoney);
    }

    return datasets;
}
