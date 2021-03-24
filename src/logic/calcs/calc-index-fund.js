import {CALC_CURRENCIES, CALC_METHODS} from "@constants";

export function calcIndexFund(datasets, options) {
    const {calcMethod, calcCurrency, datesFullArray, indexFundData, usdData} = options;
    const indexFundValues = [];

    datasets = datasets.filter(dataset => dataset.hidden !== true);

    const initialValues = [];

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
                valueAbsTotal: dataset.dataAbsTotal[i],
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
        const calcValues = [];

        datasets.forEach((dataset, index) => {
            const value = dataset.data[i];
            const initialValue = initialValues[index];
            let calcValue;

            if (isNaN(value) || value === null) {
                return;
            }

            if (calcMethod === CALC_METHODS.ABSOLUTE) {
                calcValue = (indexFundValueByDate - initialValue.indexFundValue) * initialValue.valueAbsTotal / initialValue.indexFundValue;
            } else if (calcMethod === CALC_METHODS.ABSOLUTE_TOTAL) {
                calcValue = initialValue.valueAbsTotal / initialValue.indexFundValue * indexFundValueByDate;
            } else if (calcMethod === CALC_METHODS.RELATIVE || calcMethod === CALC_METHODS.RELATIVE_ANNUAL) {
                calcValue = (indexFundValueByDate - initialValue.indexFundValue) / initialValue.indexFundValue;
                calcValue *= 100;
            }

            if (calcCurrency === CALC_CURRENCIES.USD) {
                if (calcMethod === CALC_METHODS.ABSOLUTE || calcMethod === CALC_METHODS.ABSOLUTE_TOTAL) {
                    calcValue /= usdValueByDate;
                } else {
                    calcValue *= initialValue.usdValue / usdValueByDate;
                }
            }

            calcValues.push(calcValue);
        });

        let value;

        if (calcValues.length !== 0) {
            value = calcValues.reduce((p, c) => p + c);

            if (calcMethod === CALC_METHODS.RELATIVE_ANNUAL) {
                value = value / calcValues.length;
            }

            value = parseFloat(value.toFixed(4));
        } else {
            value = NaN;
        }

        const indexFundValue = {
            date,
            value,
        };

        indexFundValues.push(indexFundValue);
    }

    return indexFundValues;
}
