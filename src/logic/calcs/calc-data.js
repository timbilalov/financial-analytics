import {CALC_CURRENCIES, CALC_METHODS} from "@constants";

export function calcData(title, data, amount, isUsd, method, usdData, calcCurrency) {
    if (!Object.values(CALC_METHODS).includes(method)) {
        return [];
    }

    amount = parseInt(amount, 10);

    const calculated = data.slice(0).map(item => Object.assign({}, item));

    let prevUsdValue;
    let usdValue;

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
            if (i === 0) {
                calculated[i].value = 0;
            } else {
                // TODO: Здесь только расчёты, а данные ведь те же самые. В дальнейшем, отрефакторить, чтобы не делать лишних запросов.
                if (method === CALC_METHODS.RELATIVE) {
                    // TODO: Учесть расчёты в долларах
                    calculated[i].value = (calculated[i].value - initialValue) / initialValue * 100;
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
                            calculated[i].value = calculated[i].value * koef * amount / usdValue - initialValue;
                            break;

                        default:
                        case CALC_CURRENCIES.RUB:
                            calculated[i].value = calculated[i].value * koef * amount - initialValue;
                            break;
                    }
                }
            }

            if (method === CALC_METHODS.ABSOLUTE_TOTAL) {
                calculated[i].value += initialValue;
            }
        }
    }

    return calculated;
}
