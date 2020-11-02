import { CALC_METHODS } from "../../utils/constants";

export function calcData(title, data, amount, isUsd, method, usdData) {
    if (!Object.values(CALC_METHODS).includes(method)) {
        return [];
    }

    amount = parseInt(amount, 10);

    const calculated = data.slice(0).map(item => Object.assign({}, item));

    let prevUsdValue;
    let usdValue;

    if (calculated.length !== 0) {
        let koef = isUsd && (method === CALC_METHODS.ABSOLUTE || method === CALC_METHODS.ABSOLUTE_TOTAL) ? usdData.filter(item => item.date === calculated[0].date)[0].value : 1;
        let initialValue = calculated[0].value * koef;

        if (method === CALC_METHODS.ABSOLUTE || method === CALC_METHODS.ABSOLUTE_TOTAL) {
            initialValue *= amount;
        }

        for (let i = 0; i < calculated.length; i++) {
            if (i === 0) {
                calculated[i].value = 0;
            } else {
                // TODO: Здесь только расчёты, а данные ведь те же самые. В дальнейшем, отрефакторить, чтобы не делать лишних запросов.
                if (method === CALC_METHODS.RELATIVE) {
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
                    calculated[i].value = calculated[i].value * koef * amount - initialValue;
                }
            }

            if (method === CALC_METHODS.ABSOLUTE_TOTAL) {
                calculated[i].value += initialValue;
            }
        }
    }

    return calculated;
}
