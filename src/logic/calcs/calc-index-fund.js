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

            const hasNullValue = isNaN(value) || value === null;
            const hasLastIndexFundValue = initialValue.lastIndexFundValue !== undefined;

            let indexFundValueByDateItem = indexFundValueByDate;
            let indexFundValueInitial = initialValue.indexFundValue;
            let calcValue;

            if (hasNullValue && !hasLastIndexFundValue) {
                return;
            }

            if (hasNullValue && hasLastIndexFundValue) {
                calcValue = initialValue.lastIndexFundValue;
            } else {
                if (calcCurrency === CALC_CURRENCIES.USD && (calcMethod === CALC_METHODS.ABSOLUTE || calcMethod === CALC_METHODS.ABSOLUTE_TOTAL)) {
                    indexFundValueByDateItem /= usdValueByDate;
                    indexFundValueInitial /= initialValue.usdValue;
                }

                if (calcMethod === CALC_METHODS.ABSOLUTE) {
                    calcValue = (indexFundValueByDateItem - indexFundValueInitial) * initialValue.valueAbsTotal / indexFundValueInitial;
                } else if (calcMethod === CALC_METHODS.ABSOLUTE_TOTAL) {
                    calcValue = initialValue.valueAbsTotal / indexFundValueInitial * indexFundValueByDateItem;
                } else if (calcMethod === CALC_METHODS.RELATIVE || calcMethod === CALC_METHODS.RELATIVE_ANNUAL) {
                    calcValue = (indexFundValueByDateItem - indexFundValueInitial) / indexFundValueInitial;
                    calcValue *= 100;
                }

                if (calcCurrency === CALC_CURRENCIES.USD && (calcMethod === CALC_METHODS.RELATIVE || calcMethod === CALC_METHODS.RELATIVE_ANNUAL)) {
                    calcValue *= initialValue.usdValue / usdValueByDate;
                }
            }

            calcValues.push(calcValue);

            if (!hasNullValue) {
                initialValue.lastIndexFundValue = calcValue;
            }
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
