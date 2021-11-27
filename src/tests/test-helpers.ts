import type { TAsset, TDataset, TDate } from '@types';
import { dates } from '@test-constants';
import moment from 'moment';
import { DATE_FORMATS } from '@constants';

type TTestAssetAbsData = number[];

export function prepareTestDataset(testAssetAbsData: TTestAssetAbsData, isUsd = false): TDataset {
    const firstDate = dates[0];
    const initialAbsValue = testAssetAbsData.find(item => !isNaN(item)) as number;
    const testValues: number[] = [];
    const testDates: TDate[] = [];

    let buyDate: TDate | undefined = undefined;
    let sellDate: TDate | undefined = undefined;

    testAssetAbsData.forEach((item, index) => {
        const date = moment(firstDate, DATE_FORMATS.default).add(index, 'days').format(DATE_FORMATS.default);
        const value = isNaN(item) ? NaN : item - initialAbsValue;
        const nextValueAbs = testAssetAbsData[index + 1];

        testDates.push(date);
        testValues.push(value);

        if (!isNaN(value) && buyDate === undefined) {
            buyDate = date;
        }

        if (buyDate !== undefined && sellDate === undefined && nextValueAbs !== undefined && isNaN(nextValueAbs)) {
            sellDate = date;
        }
    });

    const asset: TAsset = {
        ticker: 'ticker',
        data: testDates.map((date, index) => ({
            date,
            value: testValues[index],
        })),
        buyDate: buyDate as unknown as TDate,
        sellDate,
        amount: 1,
        isUsd,
    };

    const dataset: TDataset = {
        asset,
        label: 'label',
        backgroundColor: 'red',
        borderColor: 'green',
        data: testValues,
        dataAbsTotal: testAssetAbsData,
        dates: testDates,
        type: 'line',
        pointRadius: 0,
        fill: false,
        lineTension: 0,
        borderWidth: 1,
        showLine: true,
    };

    return dataset;
}
