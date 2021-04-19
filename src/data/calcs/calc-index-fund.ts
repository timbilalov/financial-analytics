import {CALC_CURRENCIES, CALC_METHODS} from "@constants";
import type {TAssetData, TAssetDataItem, TCalcOptions, TDatasets, TDate} from "@types";
import {getAssetsFromDatasets, getDatesFullArray, getIndexFundData, getUsdData} from "../get";
import {toFractionDigits} from "@helpers";

type TInitialValueItem = {
    date: TDate,
    value: number,
    valueAbsTotal: number,
    indexFundValue: number,
    indexFundValueLast?: number,
    usdValue: number,
};

export async function calcIndexFund(datasets: TDatasets, calcOptions: TCalcOptions): Promise<TAssetData> {
    const assets = getAssetsFromDatasets(datasets);

    const usdData = await getUsdData(assets);
    const datesFullArray = getDatesFullArray(assets);
    const indexFundData = await getIndexFundData(assets);
    const {currency, method} = calcOptions;
    const indexFundValues: TAssetData = [];

    datasets = datasets.filter(dataset => dataset.hidden !== true);

    const initialValues: TInitialValueItem[] = [];

    datasets.forEach((dataset, index) => {
        const values = dataset.data;
        let hasFound = false;

        for (let i = 0; i < values.length; i++) {
            if (hasFound) {
                return;
            }

            const value = values[i];

            if (isNaN(value) || value === null) {
                continue;
            }

            const date = dataset.dates[i];
            const indexFundValue = indexFundData.filter(item => item.date === date)[0].value;
            const usdValue = usdData.filter(item => item.date === date)[0].value;

            initialValues[index] = {
                date,
                value,
                valueAbsTotal: (dataset.dataAbsTotal as number[])[i], // TODO: Check
                indexFundValue,
                usdValue,
            };

            hasFound = true;
        }
    });

    for (const i in datesFullArray) {
        const date = datesFullArray[i];
        const indexFundValueByDate = indexFundData.filter(item => item.date === date)[0].value;
        const usdValueByDate = usdData.filter(item => item.date === date)[0].value;
        const calcValues: number[] = [];

        datasets.forEach((dataset, index) => {
            let value = dataset.data[i];
            const initialValue = initialValues[index];
            let indexFundValueByDateItem = indexFundValueByDate;
            let indexFundValueInitial = initialValue.indexFundValue;
            let indexFundValueLast = initialValue.indexFundValueLast;
            let calcValue = 0;

            if (isNaN(value) || value === null) {
                if (indexFundValueLast) {
                    value = indexFundValueLast;
                } else {
                    return;
                }
            } else {
                initialValue.indexFundValueLast = value;
            }

            if (currency === CALC_CURRENCIES.USD && (method === CALC_METHODS.ABSOLUTE || method === CALC_METHODS.ABSOLUTE_TOTAL)) {
                indexFundValueByDateItem /= usdValueByDate;
                indexFundValueInitial /= initialValue.usdValue;
            }

            if (method === CALC_METHODS.ABSOLUTE) {
                calcValue = (indexFundValueByDateItem - indexFundValueInitial) * initialValue.valueAbsTotal / indexFundValueInitial;
            } else if (method === CALC_METHODS.ABSOLUTE_TOTAL) {
                calcValue = initialValue.valueAbsTotal / indexFundValueInitial * indexFundValueByDateItem;
            } else if (method === CALC_METHODS.RELATIVE || method === CALC_METHODS.RELATIVE_ANNUAL) {
                calcValue = (indexFundValueByDateItem - indexFundValueInitial) / indexFundValueInitial;
                calcValue *= 100;
            }

            if (currency === CALC_CURRENCIES.USD && (method === CALC_METHODS.RELATIVE || method === CALC_METHODS.RELATIVE_ANNUAL)) {
                calcValue *= initialValue.usdValue / usdValueByDate;
            }

            calcValues.push(calcValue);
        });

        let value: number;

        if (calcValues.length !== 0) {
            value = calcValues.reduce((p, c) => p + c);

            if (method === CALC_METHODS.RELATIVE_ANNUAL) {
                value = value / calcValues.length;
            }

            value = toFractionDigits(value);
        } else {
            value = NaN;
        }

        const indexFundValue: TAssetDataItem = {
            date,
            value,
        };

        indexFundValues.push(indexFundValue);
    }

    return indexFundValues;
}
