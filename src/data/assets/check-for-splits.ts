import moment from 'moment';
import { deepClone, hasOwnProperty, toFractionDigits } from '@helpers';
import type { TAsset, TAssetData, TSplits } from '@types';
import { DATE_FORMATS } from '@constants';

export function checkForSplits(ticker: TAsset['ticker'], assetData: TAssetData, splits: TSplits): TAssetData {
    let splitDataFound = false;

    for (const splitTicker in splits) {
        if (!hasOwnProperty(splits, splitTicker)) {
            continue;
        }

        if (ticker === splitTicker.toLowerCase()) {
            splitDataFound = true;
        }
    }

    if (!splitDataFound) {
        return assetData;
    }

    const assetDataUpdated = deepClone(assetData);
    const splitData = splits[ticker];

    splitData.forEach(split => {
        const splitMultiplier = split.amountAfter / split.amountBefore;
        const splitDate = moment(split.splitDate, DATE_FORMATS.default);
        let shouldUseSplitMultiplier = false;

        assetDataUpdated.map(item => {
            if (!shouldUseSplitMultiplier) {
                const itemDate = moment(item.date, DATE_FORMATS.default);
                const datesDiff = itemDate.diff(splitDate, 'days');
                if (datesDiff >= 0) {
                    shouldUseSplitMultiplier = true;
                }
            }

            const multiplier = shouldUseSplitMultiplier ? splitMultiplier : 1;
            item.value *= multiplier;
        });
    });

    assetDataUpdated.map(item => item.value = toFractionDigits(item.value));

    return assetDataUpdated;
}
