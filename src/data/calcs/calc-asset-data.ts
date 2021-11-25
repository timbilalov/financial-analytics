import { CALC_CURRENCIES, CALC_METHODS, DEFAULT_TAX } from '@constants';
import { deepClone, toFractionDigits } from '@helpers';
import type { TAsset, TAssetData, TCalcOptions } from '@types';
import { getUsdData } from '../get';

export async function calcAssetData(asset: TAsset, calcOptions: TCalcOptions): Promise<TAssetData> {
    const { data, amount, isUsd } = asset;
    const { method, currency, uses } = calcOptions;
    const usdData = await getUsdData(asset);

    const calculated: TAssetData = data.slice(0).map(item => deepClone(item));

    // TODO: Прикрутить привязку к дате покупке, так как есть правило отмены налогов, если владеешь бумагой более 3 лет.
    const taxesKoef: number = uses.taxes ? (1 - DEFAULT_TAX) : 1;

    if (calculated.length !== 0) {
        let k = 0;
        let m = 10000;
        let usdDataValue: TAssetData = [];

        // TODO: Здесь какая-то хрень творится... ))
        while (usdDataValue.length === 0 && m-- > 0) {
            usdDataValue = usdData.filter(item => item.date === calculated[k].date);
            k++;
        }

        let initialValue = calculated[0].value;

        if (!isUsd && currency === CALC_CURRENCIES.USD) {
            initialValue /= usdDataValue[0].value;
        } else if (isUsd && currency === CALC_CURRENCIES.RUB) {
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
                if (!isUsd && currency === CALC_CURRENCIES.USD) {
                    value /= usdValue;
                } else if (isUsd && currency === CALC_CURRENCIES.RUB) {
                    value *= usdValue;
                }

                switch (method) {
                    case CALC_METHODS.ABSOLUTE:
                    case CALC_METHODS.ABSOLUTE_TOTAL:
                    default:
                        value = value * amount - initialValue;
                        break;
                }
            }

            value *= taxesKoef;

            if (method === CALC_METHODS.ABSOLUTE_TOTAL) {
                value += initialValue;
            }

            value = toFractionDigits(value);

            calculated[i].value = value;
        }
    }

    return calculated;
}
