import {CALC_METHODS} from "../../utils/constants";

// TODO: Как минимум, отрефакторить. Как максимум, ещё раз проанализировать верность расчётов.
export function calcTotal(datasets, datesFullArray, calcMethod) {
    datasets = datasets.filter(dataset => dataset.hidden !== true);

    const total = [];
    const dates = datesFullArray;

    let prevTotal = 0;
    let prevSavedTotal = 0;
    let currentNonZeroCount = 0;
    let prevSavedValues = [];

    for (const i in dates) {
        let totalValue = 0;
        let totalValue2 = 0;
        let nonZeroCount = 0;
        let nonZeroCount2 = 0;

        for (const j in datasets) {
            const dataset = datasets[j];
            const value = dataset.data[i];

            if (!isNaN(value) && value !== null) {
                nonZeroCount += 1;
                if (value !== 0 || (value === 0 && !!prevSavedValues[j])) {
                    nonZeroCount2 += 1;
                }
            }
        }

        if (nonZeroCount !== currentNonZeroCount) {
            currentNonZeroCount = nonZeroCount;
            prevSavedTotal = prevTotal;
            if (i > 0) {
                prevSavedTotal = total[i - 1].value;
                for (const j in datasets) {
                    const dataset = datasets[j];
                    const value = dataset.data[i - 1];

                    if (!isNaN(value) && value !== null) {
                        prevSavedValues[j] = value;
                    }
                }
            }
        }

        for (const j in datasets) {
            const dataset = datasets[j];
            const value = dataset.data[i];

            if (isNaN(value) || value === null) {
                continue;
            }

            let prevSavedValue = prevSavedValues[j];
            if (prevSavedValue === undefined || isNaN(prevSavedValue)) {
                prevSavedValue = 0;
            }

            totalValue += value - prevSavedValue;
        }

        if (nonZeroCount !== 0) {
            if (calcMethod === CALC_METHODS.RELATIVE) {
                totalValue2 = prevSavedTotal + totalValue / nonZeroCount;
            } else if (calcMethod === CALC_METHODS.ABSOLUTE || calcMethod === CALC_METHODS.ABSOLUTE_TOTAL) {
                totalValue2 = prevSavedTotal + totalValue;
            }
        } else {
            totalValue2 = prevSavedTotal;
        }

        total.push({
            value: totalValue2,
            date: dates[i],
        });

        prevTotal = totalValue;
    }

    return total;
}
