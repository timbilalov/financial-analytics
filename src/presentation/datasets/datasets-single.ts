import {
    BANK_DEPOSIT_LABEL,
    CALC_METHODS,
    EARNED_MONEY_LABEL,
    FREE_MONEY_LABEL,
    INDEX_FUND_LABEL,
    OWN_MONEY_LABEL,
    TOTAL_LABEL,
} from '@constants';
import { addDatasetColor, datasetsColorsStore, calcOptionsStore } from '@store';
import { extendObject, isLabelCommon } from '@helpers';
import type { TAsset, TAssetCommon, TAssetData, TCalcOptions, TDataset, TDate } from '@types';

export async function prepareSingleDataset(title: string, values: number[], datesFullArray: TDate[], asset?: TAsset): Promise<TDataset | null> {
    if (values.length === 0) {
        return null;
    }

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

    if (title === FREE_MONEY_LABEL) {
        colorRGB = [100, 120, 100];
        opacityBackground = 0.4;
        borderWidth = 0;
        type = 'bar';
    }

    addDatasetColor({
        title,
        color: colorRGB,
    });

    let calculatedData: TAssetData;
    let calculatedDataAbsTotal;
    let showLine = true;

    const dates: TDate[] = datesFullArray.slice(0);

    const calcOptions = calcOptionsStore.getState();
    if (calcOptions.method === CALC_METHODS.ABSOLUTE_TOTAL && !isLabelCommon(title)) {
        showLine = false;
    }

    const dataset: TDataset = {
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
        asset,
    };

    if (borderDash !== undefined) {
        dataset.borderDash = borderDash;
    }

    return dataset;
}
