import moment from 'moment';
import { BANK_DEPOSIT, CALC_CURRENCIES, CALC_METHODS, DATE_FORMATS, DAYS_IN_YEAR } from '@constants';
import type { TAssetData, TCalcOptions, TDataset, TDatasets, TDate } from '@types';
import { getAssetsFromDatasets, getDatesFullArray, getUsdData } from '../get';
import { toFractionDigits } from '@helpers';

type TInitialValueItem = {
    date: TDate,
    value: number,
    usdValue: number,
};

export async function calcBankDeposit(datasets: TDatasets, calcOptions: TCalcOptions): Promise<TAssetData> {
    datasets = datasets.filter(dataset => dataset.hidden !== true);

    const assets = getAssetsFromDatasets(datasets);
    const { method, currency } = calcOptions;
    const usdData = await getUsdData(assets);
    const data: TAssetData = [];
    const usdValueInitial = usdData[0].value;
    const initialValues: TInitialValueItem[] = [];
    const datesFullArray = getDatesFullArray(assets);
    const date1 = moment(datesFullArray[0], DATE_FORMATS.default);

    for (let i = 0; i < datesFullArray.length; i++) {
        const date = datesFullArray[i];
        const usdValueByDate = usdData.filter(item => item.date === date)[0].value;
        let value: number;

        if (method === CALC_METHODS.RELATIVE_ANNUAL) {
            const date2 = moment(date, DATE_FORMATS.default);
            const daysBetween = date2.diff(date1, 'days');
            const yearsKoef = daysBetween / DAYS_IN_YEAR;
            const usdValueByDate = usdData.filter(item => item.date === date)[0].value;
            const usdKoef = usdValueInitial / usdValueByDate;

            value = BANK_DEPOSIT * yearsKoef * 100;

            if (currency === CALC_CURRENCIES.USD) {
                value *= usdKoef;
            }
        } else {
            let total = 0;

            for (let j = 0; j < datasets.length; j++) {
                const dataset: TDataset = datasets[j];
                const value = dataset.data[i];
                const valueAbsTotal = (dataset.dataAbsTotal || [])[i];

                if (!isNaN(value) && value !== null) {
                    if (initialValues[j] === undefined && valueAbsTotal !== undefined) {
                        initialValues[j] = {
                            date: date,
                            value: valueAbsTotal,
                            usdValue: usdValueByDate,
                        };
                    }
                }
            }

            for (let n = 0; n < datasets.length; n++) {
                if (initialValues[n] !== undefined) {
                    const date1 = moment(initialValues[n].date, DATE_FORMATS.default);
                    const value1 = initialValues[n].value;

                    const date2 = moment(date, DATE_FORMATS.default);
                    const daysBetween = date2.diff(date1, 'days');
                    const yearsKoef = daysBetween / DAYS_IN_YEAR;
                    let v = 0;
                    let usdKoef = 1;

                    if (currency === CALC_CURRENCIES.USD) {
                        const usdValue1 = initialValues[n].usdValue;
                        usdKoef = usdValue1 / usdValueByDate;
                    }

                    const v2 = BANK_DEPOSIT * yearsKoef;

                    if (method === CALC_METHODS.RELATIVE) {
                        v = v2 * 100;
                    } else if (method === CALC_METHODS.ABSOLUTE) {
                        v = value1 * v2;
                    } else if (method === CALC_METHODS.ABSOLUTE_TOTAL) {
                        v = value1 * (1 + v2);
                    }

                    v *= usdKoef;

                    total += v;
                }
            }

            value = total;
        }

        value = toFractionDigits(value);

        data.push({
            value,
            date,
        });
    }

    return data;
}
