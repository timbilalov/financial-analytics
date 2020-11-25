import {CALC_CURRENCIES, CALC_METHODS, DEFAULT_TAX} from "@constants";

export function calcData(title, data, amount, isUsd, method, usdData, calcCurrency, useTaxes) {
    if (!Object.values(CALC_METHODS).includes(method)) {
        return [];
    }

    amount = parseInt(amount, 10);

    const calculated = data.slice(0).map(item => Object.assign({}, item));

    let prevUsdValue;
    let usdValue;

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

        let koef = isUsd && (method === CALC_METHODS.ABSOLUTE || method === CALC_METHODS.ABSOLUTE_TOTAL) ? usdDataValue[0].value : 1;
        let initialValue = calculated[0].value * koef;

        if (calcCurrency === CALC_CURRENCIES.USD && (method === CALC_METHODS.ABSOLUTE || method === CALC_METHODS.ABSOLUTE_TOTAL)) {
            initialValue /= usdDataValue[0].value;
        }

        if (method === CALC_METHODS.ABSOLUTE || method === CALC_METHODS.ABSOLUTE_TOTAL) {
            initialValue *= amount;
        }

        for (let i = 0; i < calculated.length; i++) {
            let value = calculated[i].value;

            if (i === 0) {
                value = 0;
            } else {
                if (method === CALC_METHODS.RELATIVE || method === CALC_METHODS.RELATIVE_ANNUAL) {
                    // TODO: Учесть расчёты в долларах
                    value = (value - initialValue) / initialValue * 100;
                } else if (method === CALC_METHODS.ABSOLUTE || method === CALC_METHODS.ABSOLUTE_TOTAL) {
                    usdValue = usdData.filter(item => item.date === calculated[i].date);
                    if (usdValue.length !== 0) {
                        usdValue = usdValue[0].value;
                        prevUsdValue = usdValue;
                    } else {
                        usdValue = prevUsdValue;
                    }

                    koef = isUsd ? usdValue : 1;

                    switch (calcCurrency) {
                        case CALC_CURRENCIES.USD:
                            value = value * koef * amount / usdValue - initialValue;
                            break;

                        default:
                        case CALC_CURRENCIES.RUB:
                            value = value * koef * amount - initialValue;
                            break;
                    }
                }
            }

            if (method === CALC_METHODS.ABSOLUTE_TOTAL) {
                value += initialValue;
            }

            // TODO: Проверить, всё ли верно, если тупо в одно месте этот множитель вкорячить
            value *= taxesKoef;
            calculated[i].value = value;
        }
    }

    return calculated;
}
