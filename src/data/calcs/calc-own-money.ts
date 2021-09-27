import { CALC_CURRENCIES, CALC_METHODS } from '@constants';
import type { TAssetData, TCalcOptions, TDatasets, TDate } from '@types';
import { getAssetsFromDatasets, getDatesFullArray, getUsdData } from '../get';
import { toFractionDigits } from '@helpers';

type TInitialValueItem = {
    date: TDate,
    value: number,
    usd: number,
};

export async function calcOwnMoney(datasets: TDatasets, calcOptions: TCalcOptions): Promise<TAssetData> {
    const assets = getAssetsFromDatasets(datasets);
    const usdData = await getUsdData(assets);
    const datesFullArray = getDatesFullArray(assets);
    const { currency, method } = calcOptions;

    const data: TAssetData = [];

    if (method !== CALC_METHODS.ABSOLUTE_TOTAL) {
        return data;
    }

    datasets = datasets.filter(dataset => dataset.hidden !== true);

    const initialValues: TInitialValueItem[] = [];
    // let prevUsdValue: TAssetDataItem = usdData[0];

    for (let i = 0; i < datesFullArray.length; i++) {
        const date = datesFullArray[i];
        let total = 0;
        const usdValue = usdData.filter(item => item.date === date)[0].value;

        for (let j = 0; j < datasets.length; j++) {
            const dataset = datasets[j];
            const value = dataset.data[i];
            const valueAbsTotal = (dataset.dataAbsTotal || [])[i];

            if (!isNaN(value) && value !== null) {
                if (initialValues[j] === undefined && valueAbsTotal !== undefined) {
                    initialValues[j] = {
                        date: date,
                        value: valueAbsTotal,
                        usd: usdValue,
                    };
                }
            }
        }

        for (let n = 0; n < datasets.length; n++) {
            if (initialValues[n] !== undefined) {
                let value = initialValues[n].value;

                if (currency === CALC_CURRENCIES.USD) {
                    value = value / usdValue * initialValues[n].usd;
                }

                total += value;
            }
        }

        total = toFractionDigits(total);

        data.push({
            date,
            value: total,
        });
    }

    return data;
}
