import { calcAssetData, normalizeAssetData } from '@data';
import {
    BANK_DEPOSIT_LABEL,
    CALC_METHODS,
    EARNED_MONEY_LABEL,
    INDEX_FUND_LABEL,
    OWN_MONEY_LABEL,
    TOTAL_LABEL,
} from '@constants';
import { addDatasetColor, datasetsColorsStore } from '@store';
import { extendObject, isLabelCommon } from '@helpers';
import type { TAsset, TAssetCommon, TCalcOptions, TDataset, TDate } from '@types';

export async function prepareSingleDataset(asset: TAsset | TAssetCommon, calcOptions: TCalcOptions, datesFullArray: TDate[]): Promise<TDataset | null> {
    if (asset.data.length === 0) {
        return null;
    }

    const dataNormalized = normalizeAssetData(asset.data, asset.data[asset.data.length - 1].date);
    asset.data = dataNormalized;
    const ticker = (asset as TAsset).ticker;
    const title = (asset as TAssetCommon).title || ticker.toUpperCase();

    const datasetsColors = datasetsColorsStore.getState();
    const getRandomNumber = () => Math.round(Math.random() * 255);

    let colorRGB;
    let opacityBorder = 0.6;
    let opacityBackground = 0.2;
    let borderWidth = 1;
    let borderDash;
    let type: TDataset['type'] = 'line';

    if (datasetsColors[title] !== undefined) {
        colorRGB = datasetsColors[title];
    } else {
        colorRGB = [getRandomNumber(), getRandomNumber(), getRandomNumber()];
    }

    if (title === TOTAL_LABEL) {
        colorRGB = [0, 0, 0];
        opacityBorder = 1;
        borderWidth = 2;
    }

    if (title === BANK_DEPOSIT_LABEL) {
        colorRGB = [160, 160, 160];
        opacityBorder = 0.7;
        borderWidth = 2;
        borderDash = [20, 20];
    }

    if (title === INDEX_FUND_LABEL) {
        colorRGB = [20, 80, 150];
        opacityBorder = 0.7;
        borderWidth = 2;
        borderDash = [3, 3];
    }

    if (title === OWN_MONEY_LABEL) {
        colorRGB = [20, 160, 20];
        borderWidth = 0;
        type = 'bar';
    }

    if (title === EARNED_MONEY_LABEL) {
        colorRGB = [0, 100, 40];
        opacityBackground = 0.4;
        borderWidth = 0;
        type = 'bar';
    }

    addDatasetColor({
        title,
        color: colorRGB,
    });

    let calculatedData;
    let calculatedDataAbsTotal;
    let shouldStoreAbsTotal = false;
    let showLine = true;

    if (isLabelCommon(title)) {
        calculatedData = dataNormalized;
    } else {
        calculatedData = await calcAssetData(asset as TAsset, calcOptions);
        shouldStoreAbsTotal = true;
        const calcOptionsAbsoluteTotal = extendObject(calcOptions, {
            method: CALC_METHODS.ABSOLUTE_TOTAL,
        });
        calculatedDataAbsTotal = await calcAssetData(asset as TAsset, calcOptionsAbsoluteTotal);
    }

    const dates: TDate[] = datesFullArray.slice(0);
    let values: number[] = [];
    let valuesAbsTotal: number[] = [];

    // TODO: В массиве dates могут быть сотни элементов. Вроде каждый тик выполняется быстро, но в сумме цикл выполняется около 15 ms.
    // Можно попытаться оптимизировать, хотя сходу идей мало.
    if (dates.length === calculatedData.length) {
        values = calculatedData.map(item => item.value);
        if (shouldStoreAbsTotal) {
            valuesAbsTotal = calculatedDataAbsTotal.map(item => item.value);
        }
    } else {
        dates.forEach(date => {
            const calculatedDataByDate = calculatedData.find(item => item.date === date);
            const index = calculatedData.indexOf(calculatedDataByDate);
            let value: number;
            if (index !== -1) {
                value = calculatedDataByDate.value;
            } else {
                value = NaN;
            }
            values.push(value);

            if (shouldStoreAbsTotal) {
                let valueAbsTotal: number;
                if (index !== -1) {
                    valueAbsTotal = calculatedDataAbsTotal[index].value;
                } else {
                    valueAbsTotal = NaN;
                }
                valuesAbsTotal.push(valueAbsTotal);
            }
        });
    }

    if (calcOptions.method === CALC_METHODS.ABSOLUTE_TOTAL && !isLabelCommon(title)) {
        showLine = false;
    }

    const dataset: TDataset = {
        asset: asset as TAsset,
        label: title,
        backgroundColor: `rgba(${colorRGB.join(', ')}, ${opacityBackground})`,
        borderColor: `rgba(${colorRGB.join(', ')}, ${opacityBorder})`,
        data: values,
        dates: dates,
        type,
        pointRadius: 0,
        fill: false,
        lineTension: 0,
        borderWidth,
        showLine,
    };

    if (shouldStoreAbsTotal) {
        dataset.dataAbsTotal = valuesAbsTotal;
    }

    if (borderDash !== undefined) {
        dataset.borderDash = borderDash;
    }

    return dataset;
}
