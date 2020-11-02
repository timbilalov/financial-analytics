import moment from "moment";
import {CALC_METHODS, DATE_FORMATS, STORAGE_KEYS} from "../../utils/constants";
import Storage from "../../utils/storage";
import {getUsdData} from "../../data/get";
import {calcBankDeposit, calcOwnMoney, calcTotal} from "../../logic/calcs";
import {prepareSingleDataset} from "./datasets-single";

export async function prepareDatasets(items, datesFullArrayToLink, usdDataToLink, calcMethod, datasetsColors) {
    const datasets = [];
    let datesFullArray = [];

    for (const {data} of items) {
        const dates = data.map(item => item.date);

        for (const date of dates) {
            if (!datesFullArray.includes(date)) {
                datesFullArray.push(date);
            }
        }
    }

    datesFullArray.sort();

    const firstDate = moment(datesFullArray[0], DATE_FORMATS.default);
    const lastDate = moment(datesFullArray[datesFullArray.length - 1], DATE_FORMATS.default);
    const diff = lastDate.diff(firstDate, 'days');
    const datesFullArray2 = [];
    for (let i = 0; i < diff; i++) {
        const date = firstDate.add(1, 'days').format(DATE_FORMATS.default);
        datesFullArray2.push(date);
    }

    datesFullArray = datesFullArray2;
    datesFullArrayToLink = datesFullArray;

    Storage.set(STORAGE_KEYS.datesFullArray, datesFullArray);

    const usdData = await getUsdData(datesFullArray[0]);
    usdDataToLink = usdData;

    for (const {title, data, amount, isUsd} of items) {
        datasets.push(prepareSingleDataset(title, data, amount, isUsd, datasets, datesFullArray, datasetsColors, calcMethod, usdData));
    }

    const innerDatasets = datasets.slice(0);

    if (items.length > 1) {
        datasets.push(prepareSingleDataset('Total', calcTotal(innerDatasets, datesFullArray, calcMethod), undefined, undefined, datasets, datesFullArray, datasetsColors, calcMethod, usdData))
    }

    datasets.push(prepareSingleDataset('Bank depo', calcBankDeposit(innerDatasets, datesFullArray, calcMethod), undefined, undefined, datasets, datesFullArray, datasetsColors, calcMethod, usdData))

    if (calcMethod === CALC_METHODS.ABSOLUTE_TOTAL) {
        datasets.push(prepareSingleDataset('Own money', calcOwnMoney(innerDatasets, datesFullArray), undefined, undefined, datasets, datesFullArray, datasetsColors, calcMethod, usdData));
    }

    return datasets;
}
