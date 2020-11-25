import {CALC_METHODS} from "@constants";
import {calcBankDeposit, calcOwnMoney, calcTotal} from "@logic";
import {prepareSingleDataset} from "./datasets-single";

export async function prepareDatasets(items, datesFullArray, usdData, calcMethod, datasetsColors, calcCurrency, useTaxes) {
    const datasets = [];

    for (const {title, data, amount, isUsd} of items) {
        datasets.push(prepareSingleDataset(title, data, amount, isUsd, datasets, datesFullArray, datasetsColors, calcMethod, usdData, calcCurrency, useTaxes));
    }

    const innerDatasets = datasets.slice(0);

    if (items.length > 1) {
        datasets.push(prepareSingleDataset('Total', calcTotal(innerDatasets, calcMethod), undefined, undefined, datasets, datesFullArray, datasetsColors, calcMethod, usdData))
    }

    datasets.push(prepareSingleDataset('Bank depo', calcBankDeposit(innerDatasets, datesFullArray, calcMethod, usdData, calcCurrency), undefined, undefined, datasets, datesFullArray, datasetsColors, calcMethod, usdData))

    if (calcMethod === CALC_METHODS.ABSOLUTE_TOTAL) {
        datasets.push(prepareSingleDataset('Own money', calcOwnMoney(innerDatasets, datesFullArray, usdData, calcCurrency), undefined, undefined, datasets, datesFullArray, datasetsColors, calcMethod, usdData));
    }

    return datasets;
}
