import { CALC_METHODS } from '@constants';
import type { TAssetData, TCalcOptions, TDatasets } from '@types';
import { getAssetsFromDatasets, getDatesFullArray } from '../get';

// TODO: Как минимум, отрефакторить. Как максимум, ещё раз проанализировать верность расчётов.
export function calcTotal(datasets: TDatasets, calcOptions: TCalcOptions): TAssetData {
    datasets = datasets.filter(dataset => dataset.hidden !== true);

    const assets = getAssetsFromDatasets(datasets);
    const datesFullArray = getDatesFullArray(assets);

    const { method } = calcOptions;
    const total: TAssetData = [];


    let prevTotal = 0;
    let prevSavedTotal = 0;
    let currentNonZeroCount = 0;
    const prevSavedValues: {
        [key: number]: number,
    } = [];

    for (let i = 0; i < datesFullArray.length; i++) {
        let totalValue = 0;
        let totalValue2 = 0;
        let nonZeroCount = 0;
        // let nonZeroCount2 = 0;

        for (let j = 0; j < datasets.length; j++) {
            const dataset = datasets[j];
            const value = dataset.data[i];

            if (!isNaN(value) && value !== null) {
                nonZeroCount += 1;
                // if (value !== 0 || (value === 0 && !!prevSavedValues[j])) {
                //     nonZeroCount2 += 1;
                // }
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

        for (let j = 0; j < datasets.length; j++) {
            const dataset = datasets[j];
            const value = dataset.data[i];
            let valueToIncrement = value;

            if (isNaN(value) || value === null) {
                continue;
            }

            let prevSavedValue = prevSavedValues[j];
            if (prevSavedValue === undefined || isNaN(prevSavedValue)) {
                prevSavedValue = 0;
            }

            if (method !== CALC_METHODS.RELATIVE_ANNUAL) {
                valueToIncrement -= prevSavedValue;
            }

            totalValue += valueToIncrement;
        }

        if (nonZeroCount !== 0) {
            if (method === CALC_METHODS.RELATIVE_ANNUAL) {
                totalValue2 = totalValue / nonZeroCount;
            } else if (method === CALC_METHODS.RELATIVE) {
                totalValue2 = prevSavedTotal + totalValue;
            } else if (method === CALC_METHODS.ABSOLUTE || method === CALC_METHODS.ABSOLUTE_TOTAL) {
                totalValue2 = prevSavedTotal + totalValue;
            }
        } else {
            totalValue2 = prevSavedTotal;
        }

        total.push({
            value: totalValue2,
            date: datesFullArray[i],
        });

        prevTotal = totalValue;
    }

    return total;
}
