import {CALC_CURRENCIES, CALC_METHODS} from "@constants";

export function calcOwnMoney(datasets, options) {
    if (Array.isArray(datasets) === false || typeof options !== 'object') {
        return [];
    }

    const {datesFullArray, usdData, calcCurrency, calcMethod} = options;

    if (calcMethod !== CALC_METHODS.ABSOLUTE_TOTAL) {
        return [];
    }

    const items = [];
    const dates = datesFullArray;

    datasets = datasets.filter(dataset => dataset.hidden !== true);

    let initialValues = [];
    let prevUsdValue = usdData[0];

    for (const i in dates) {
        const date = dates[i];
        let total = 0;
        // let usdValue = usdData.filter(item => item.date === date);
        const usdValue = usdData.filter(item => item.date === date)[0].value;
        // if (usdValue.length !== 0) {
        //     usdValue = usdValue[0].value;
        //     prevUsdValue = usdValue;
        // } else {
        //     usdValue = prevUsdValue;
        // }

        for (const j in datasets) {
            const dataset = datasets[j];
            const value = dataset.data[i];
            const valueAbsTotal = dataset.dataAbsTotal[i];

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

        for (const n in datasets) {
            if (initialValues[n] !== undefined) {
                let value = initialValues[n].value;

                if (calcCurrency === CALC_CURRENCIES.USD) {
                    value = value / usdValue * initialValues[n].usd;
                }

                total += value;
            }
        }

        total = parseFloat(total.toFixed(4));

        items.push({
            date,
            value: total,
        });
    }

    return items;
}
