import type { TAsset, TDataset, TDate } from '@types';
import { dates } from '@test-constants';
import moment from 'moment';
import { DATE_FORMATS } from '@constants';

type TTestAssetAbsData = number[];

export function prepareTestDataset(absTotalValues: TTestAssetAbsData, isUsd = false, amount = 1): TDataset {
    const firstDate = dates[0];
    const testValues: number[] = [];
    const testDates: TDate[] = [];

    let buyDate!: TDate;
    let sellDate: TDate | undefined = undefined;

    absTotalValues.forEach((item, index) => {
        const date = moment(firstDate, DATE_FORMATS.default).add(index, 'days').format(DATE_FORMATS.default);
        const value = item;
        const nextValue = absTotalValues[index + 1];

        testDates.push(date);
        testValues.push(value);

        if (!isNaN(value) && buyDate === undefined) {
            buyDate = date;
        }

        if (buyDate !== undefined && sellDate === undefined && isNaN(nextValue)) {
            sellDate = date;
        }
    });

    const asset: TAsset = {
        ticker: 'ticker',
        data: testDates.map((date, index) => ({
            date,
            values: {
                current: testValues[index],
            },
        })).filter(item => !isNaN(item.values.current)),
        buyDate: buyDate as unknown as TDate,
        sellDate,
        amount,
        isUsd,
    };

    const dataset: TDataset = {
        asset,
        label: 'label',
        backgroundColor: 'red',
        borderColor: 'green',
        data: testValues,
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
