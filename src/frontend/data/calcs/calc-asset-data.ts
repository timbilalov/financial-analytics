import { CALC_CURRENCIES, CALC_METHODS, DEFAULT_TAX } from '@constants';
import { deepClone, toFractionDigits } from '@helpers';
import type { TAsset, TAssetData, TCalcOptions } from '@types';
import { getUsdData } from '../get';

export async function calcAssetData(asset: TAsset, calcOptions: TCalcOptions): Promise<TAssetData> {
    const { data, amount, isUsd } = asset;
    const { method, currency, uses } = calcOptions;
    const usdData = await getUsdData(asset);

    const calculated: TAssetData = deepClone(data);

    // TODO: Прикрутить привязку к дате покупке, так как есть правило отмены налогов, если владеешь бумагой более 3 лет.
    const taxesKoef: number = uses.taxes ? (1 - DEFAULT_TAX) : 1;

    if (calculated.length !== 0) {
        const initialUsdValue = usdData[0].value;

        let initialValue = calculated[0].value;

        if (!isUsd && currency === CALC_CURRENCIES.USD) {
            initialValue /= initialUsdValue;
        } else if (isUsd && currency === CALC_CURRENCIES.RUB) {
            initialValue *= initialUsdValue;
        }

        if (method === CALC_METHODS.ABSOLUTE || method === CALC_METHODS.ABSOLUTE_TOTAL) {
            initialValue *= amount;
        }

        for (let i = 0; i < calculated.length; i++) {
            let value = calculated[i].value;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const usdValue = usdData.find(item => item.date === calculated[i].date)!.value;

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
