import {deepClone, toFractionDigits} from "@helpers";

export function checkForSplits(tickerData, splits) {
    const ticker = tickerData.ticker.toLowerCase();

    let splitDataFound = false;

    for (const splitTicker in splits) {
        if (!splits.hasOwnProperty(splitTicker)) {
            continue;
        }

        if (ticker === splitTicker.toLowerCase()) {
            splitDataFound = true;
        }
    }

    if (!splitDataFound) {
        return tickerData;
    }

    const tickerDataUpdated = deepClone(tickerData);

    const splitData = splits[ticker];

    splitData.forEach(split => {
        let shouldUseSplitMultiplier = false;

        const splitMultiplier = split.amountAfter / split.amountBefore;

        tickerDataUpdated.data.map(item => {
            if (!shouldUseSplitMultiplier && (item.date === split.splitDate)) {
                shouldUseSplitMultiplier = true;
            }

            const multiplier = shouldUseSplitMultiplier ? splitMultiplier : 1;

            item.value *= multiplier;
        });
    });

    tickerDataUpdated.data.map(item => item.value = toFractionDigits(item.value, 4));

    return tickerDataUpdated;
}
