import { calcAssetData } from '@data';
import {
    BANK_DEPOSIT_LABEL,
    CALC_METHODS,
    DATE_FORMATS,
    INDEX_FUND_LABEL,
    OWN_MONEY_LABEL,
    TOTAL_LABEL,
} from '@constants';
import moment from 'moment';
import { addDatasetColor, datasetsColorsStore } from '@store';
import { extendObject, isLabelCommon } from '@helpers';
import type { TAsset, TAssetCommon, TCalcOptions, TDataset, TDate } from '@types';

export async function prepareSingleDataset(asset: TAsset | TAssetCommon, calcOptions: TCalcOptions, datesFullArray: TDate[]): Promise<TDataset> {
    const { data } = asset;
    const { amount, isUsd } = asset as TAsset;
    const ticker = (asset as TAsset).ticker;
    const title = (asset as TAssetCommon).title || ticker.toUpperCase();

    const datasetsColors = datasetsColorsStore.getState();
    const getRandomNumber = () => Math.round(Math.random() * 255);

    let colorRGB;
    let opacity = 0.6;
    let borderWidth = 1;
    let borderDash;

    if (datasetsColors[title] !== undefined) {
        colorRGB = datasetsColors[title];
    } else {
        colorRGB = [getRandomNumber(), getRandomNumber(), getRandomNumber()];
    }

    if (title === TOTAL_LABEL) {
        colorRGB = [0, 0, 0];
        opacity = 1;
        borderWidth = 2;
    }

    if (title === BANK_DEPOSIT_LABEL) {
        colorRGB = [160, 160, 160];
        opacity = 0.7;
        borderWidth = 2;
        borderDash = [20, 20];
    }

    if (title === INDEX_FUND_LABEL) {
        colorRGB = [20, 80, 150];
        opacity = 0.7;
        borderWidth = 2;
        borderDash = [3, 3];
    }

    if (title === OWN_MONEY_LABEL) {
        colorRGB = [20, 160, 20];
        opacity = 0.15;
        borderWidth = 0;
    }

    addDatasetColor({
        title,
        color: colorRGB,
    });

    let hasBegun = false;
    let prevValue;
    let prevValueAbsTotal;
    let calculatedData;
    let calculatedDataAbsTotal;
    let shouldStoreAbsTotal = false;

    if (isLabelCommon(title)) {
        calculatedData = data;
    } else {
        calculatedData = await calcAssetData(asset as TAsset, calcOptions);
        shouldStoreAbsTotal = true;
        const calcOptionsAbsoluteTotal = extendObject(calcOptions, {
            method: CALC_METHODS.ABSOLUTE_TOTAL,
        });
        calculatedDataAbsTotal = await calcAssetData(asset as TAsset, calcOptionsAbsoluteTotal);
    }

    const dates: TDate[] = datesFullArray.slice(0);
    const values: number[] = [];
    const valuesAbsTotal: number[] = [];

    for (const date of dates.values()) {
        let valueByDate: number;
        let valueByDateAbsTotal: number;
        const itemFilteredByDate = calculatedData.filter(item => item.date === date)[0];
        const itemFilteredByDateAbsTotal = shouldStoreAbsTotal && calculatedDataAbsTotal.filter(item => item.date === date)[0];
        if (itemFilteredByDate !== undefined) {
            valueByDate = itemFilteredByDate.value;
            valueByDateAbsTotal = shouldStoreAbsTotal && itemFilteredByDateAbsTotal.value;
            hasBegun = true;
            prevValue = valueByDate;
            prevValueAbsTotal = shouldStoreAbsTotal && valueByDateAbsTotal;
        } else {
            const date1 = moment(calculatedData[calculatedData.length - 1].date, DATE_FORMATS.default);
            const date2 = moment(date, DATE_FORMATS.default);
            const diff = date2.diff(date1, 'days');

            // TODO: С этим бывают косяки. Поправить.
            const hasFinished = diff > 0;

            if (!hasBegun || hasFinished) {
                valueByDate = NaN;
                valueByDateAbsTotal = NaN;
            } else {
                valueByDate = prevValue;
                valueByDateAbsTotal = prevValueAbsTotal;
            }
        }
        values.push(valueByDate);
        shouldStoreAbsTotal && valuesAbsTotal.push(valueByDateAbsTotal);
    }

    const dataset: TDataset = {
        ticker,
        label: title,
        backgroundColor: `rgba(${colorRGB.join(', ')}, 0.2)`,
        borderColor: `rgba(${colorRGB.join(', ')}, ${opacity})`,
        data: values,
        dates: dates,
        type: 'line',
        pointRadius: 0,
        fill: false,
        lineTension: 0,
        borderWidth,
        amount,
        isUsd,
    };

    if (shouldStoreAbsTotal) {
        dataset.dataAbsTotal = valuesAbsTotal;
    }

    if (borderDash !== undefined) {
        dataset.borderDash = borderDash;
    }

    if (title === OWN_MONEY_LABEL) {
        dataset.type = 'bar';
    }

    return dataset;
}
