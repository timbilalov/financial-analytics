import {CALC_METHODS, STORAGE_KEYS} from "@constants";
import Storage from "@utils/storage";
import {fetchUsd, getAllDatesInterval, parseResponseDataUsd} from "@data";
import {calcBankDeposit, calcOwnMoney, calcTotal} from "@logic";
import {prepareSingleDataset} from "./datasets-single";

export async function prepareDatasets(items, usdDataToLink, calcMethod, datasetsColors) {
    const datasets = [];

    const datesFullArray = getAllDatesInterval(items);
    const usdDataRaw = await fetchUsd(datesFullArray[0]);
    const usdData = parseResponseDataUsd(usdDataRaw);

    Storage.set(STORAGE_KEYS.usdData, usdData);
    usdDataToLink = usdData;

    for (const {title, data, amount, isUsd} of items) {
        datasets.push(prepareSingleDataset(title, data, amount, isUsd, datasets, datesFullArray, datasetsColors, calcMethod, usdData));
    }

    const innerDatasets = datasets.slice(0);

    if (items.length > 1) {
        datasets.push(prepareSingleDataset('Total', calcTotal(innerDatasets, calcMethod), undefined, undefined, datasets, datesFullArray, datasetsColors, calcMethod, usdData))
    }

    datasets.push(prepareSingleDataset('Bank depo', calcBankDeposit(innerDatasets, datesFullArray, calcMethod), undefined, undefined, datasets, datesFullArray, datasetsColors, calcMethod, usdData))

    if (calcMethod === CALC_METHODS.ABSOLUTE_TOTAL) {
        datasets.push(prepareSingleDataset('Own money', calcOwnMoney(innerDatasets, datesFullArray), undefined, undefined, datasets, datesFullArray, datasetsColors, calcMethod, usdData));
    }

    return datasets;
}
