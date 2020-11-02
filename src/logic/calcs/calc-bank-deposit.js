import moment from "moment";
import {BANK_DEPOSIT, CALC_METHODS, DATE_FORMATS} from "../../utils/constants";

export function calcBankDeposit(datasets, datesFullArray, calcMethod) {
    const values = [];
    const dates = datesFullArray;
    const date1 = moment(dates[0], DATE_FORMATS.default);

    datasets = datasets.filter(dataset => dataset.hidden !== true);

    let prevSavedValues = [];
    let initialValues = [];

    for (const i in dates) {
        const date = dates[i];

        const date2 = moment(date, DATE_FORMATS.default);
        const daysBetween = date2.diff(date1, 'days');
        const yearsKoef = daysBetween / 360;
        let value = BANK_DEPOSIT * yearsKoef * 100;

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

                    if (calcMethod === CALC_METHODS.ABSOLUTE) {
                        v = value1 * (BANK_DEPOSIT * yearsKoef);
                    } else if (calcMethod === CALC_METHODS.ABSOLUTE_TOTAL) {
                        v = value1 * (1 + BANK_DEPOSIT * yearsKoef);
                    }

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
