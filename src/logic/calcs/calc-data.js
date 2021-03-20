import {CALC_CURRENCIES, CALC_METHODS, DEFAULT_TAX} from "@constants";
import {deepClone} from "@helpers";

export function calcData(title, data, amount, isUsd, method, usdData, calcCurrency, useTaxes) {
    if (!Object.values(CALC_METHODS).includes(method)) {
        return [];
    }

    amount = parseInt(amount, 10);

    const calculated = data.slice(0).map(item => deepClone(item));

    // TODO: Прикрутить привязку к дате покупке, так как есть правило отмены налогов, если владеешь бумагой более 3 лет.
    const taxesKoef = useTaxes ? (1 - DEFAULT_TAX) : 1;

    if (calculated.length !== 0) {
        let k = 0;
        let m = 10000;
        let usdDataValue = [];

        // TODO: Здесь какая-то хрень творится... ))
        while (usdDataValue.length === 0 && m-- > 0) {
            usdDataValue = usdData.filter(item => item.date === calculated[k].date);
            k++;
        }

        let initialValue = calculated[0].value;

        if (isUsd !== true && calcCurrency === CALC_CURRENCIES.USD) {
            initialValue /= usdDataValue[0].value;
        } else if (isUsd === true && calcCurrency === CALC_CURRENCIES.RUB) {
            initialValue *= usdDataValue[0].value;
        }

        if (method === CALC_METHODS.ABSOLUTE || method === CALC_METHODS.ABSOLUTE_TOTAL) {
            initialValue *= amount;
        }

        for (let i = 0; i < calculated.length; i++) {
            let value = calculated[i].value;
            const usdValue = usdData.filter(item => item.date === calculated[i].date)[0].value;

            if (i === 0) {
                value = 0;
            } else {
                if (isUsd !== true && calcCurrency === CALC_CURRENCIES.USD) {
                    value /= usdValue;
                } else if (isUsd === true && calcCurrency === CALC_CURRENCIES.RUB) {
                    value *= usdValue;
                }

                if (method === CALC_METHODS.RELATIVE || method === CALC_METHODS.RELATIVE_ANNUAL) {
                    value = (value - initialValue) / initialValue * 100;
                } else if (method === CALC_METHODS.ABSOLUTE || method === CALC_METHODS.ABSOLUTE_TOTAL) {
                    value = value * amount - initialValue;
                }
            }

            value *= taxesKoef;

            if (method === CALC_METHODS.ABSOLUTE_TOTAL) {
                value += initialValue;
            }

            value = parseFloat(value.toFixed(4));

            calculated[i].value = value;
        }
    }

    return calculated;
}
