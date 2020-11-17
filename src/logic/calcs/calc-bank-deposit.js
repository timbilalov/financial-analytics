import moment from "moment";
import {BANK_DEPOSIT, CALC_CURRENCIES, CALC_METHODS, DATE_FORMATS} from "@constants";

export function calcBankDeposit(datasets, datesFullArray, calcMethod, usdData, calcCurrency) {
    const values = [];
    const dates = datesFullArray;
    const date1 = moment(dates[0], DATE_FORMATS.default);

    datasets = datasets.filter(dataset => dataset.hidden !== true);

    let prevSavedValues = [];
    let initialValues = [];
    const usdValueInitial = usdData[0].value;

    for (const i in dates) {
        const date = dates[i];

        const date2 = moment(date, DATE_FORMATS.default);
        const daysBetween = date2.diff(date1, 'days');
        const yearsKoef = daysBetween / 360;
        const usdValueByDate = usdData.filter(item => item.date === date)[0].value;
        const usdKoef = usdValueInitial / usdValueByDate;
        let value = BANK_DEPOSIT * yearsKoef * 100;

        if (calcCurrency === CALC_CURRENCIES.USD) {
            value *= usdKoef;
        }

        if (calcMethod === CALC_METHODS.ABSOLUTE || calcMethod === CALC_METHODS.ABSOLUTE_TOTAL) {
            for (const j in datasets) {
                const dataset = datasets[j];
                const value = dataset.data[i];
                const valueAbsTotal = dataset?.dataAbsTotal[i];

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

            let total = 0;

            for (const n in datasets) {
                if (initialValues[n] !== undefined) {
                    const date1 = moment(initialValues[n].date, DATE_FORMATS.default);
                    const value1 = initialValues[n].value;

                    const date2 = moment(date, DATE_FORMATS.default);
                    const daysBetween = date2.diff(date1, 'days');
                    const yearsKoef = daysBetween / 360;
                    let v;
                    let usdKoef = 1;

                    if (calcCurrency === CALC_CURRENCIES.USD) {
                        const usdValue1 = initialValues[n].usdValue;
                        const usdValue2 = usdValueByDate;
                        usdKoef = usdValue1 / usdValue2;
                    }

                    const v2 = BANK_DEPOSIT * yearsKoef;

                    if (calcMethod === CALC_METHODS.ABSOLUTE) {
                        v = value1 * v2;
                    } else if (calcMethod === CALC_METHODS.ABSOLUTE_TOTAL) {
                        v = value1 * (1 + v2);
                    }

                    v *= usdKoef;

                    total += v;
                }
            }

            value = total;
        }

        values.push({
            value: value,
            date: date,
        });
    }

    return values;
}
