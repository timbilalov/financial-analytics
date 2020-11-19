import moment from "moment";
import {BANK_DEPOSIT, CALC_CURRENCIES, CALC_METHODS, DATE_FORMATS} from "@constants";

export function calcBankDeposit(datasets, datesFullArray, calcMethod, usdData, calcCurrency) {
    const values = [];
    const dates = datesFullArray;

    datasets = datasets.filter(dataset => dataset.hidden !== true);

    let initialValues = [];

    for (const i in dates) {
        const date = dates[i];
        const usdValueByDate = usdData.filter(item => item.date === date)[0].value;

        let total = 0;

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
                    usdKoef = usdValue1 / usdValueByDate;
                }

                const v2 = BANK_DEPOSIT * yearsKoef;

                if (calcMethod === CALC_METHODS.RELATIVE) {
                    v = v2 * 100;
                } else if (calcMethod === CALC_METHODS.ABSOLUTE) {
                    v = value1 * v2;
                } else if (calcMethod === CALC_METHODS.ABSOLUTE_TOTAL) {
                    v = value1 * (1 + v2);
                }

                v *= usdKoef;

                total += v;
            }
        }

        values.push({
            value: total,
            date: date,
        });
    }

    return values;
}
