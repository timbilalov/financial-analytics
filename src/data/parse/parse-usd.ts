import moment from 'moment';
import { DATE_FORMATS } from '@constants';
import type { TAssetData, TAssetDataItem, TDate, TFetchDataItemMoex, TFetchDataMoex } from '@types';

// TODO: Теперь эта функция не только для USD. Порефакторить так, чтобы было более универсально. Возможно, объединить с "обычным" parseMoex.
export function parseResponseDataUsd(responseData: TFetchDataMoex, datesFullArray: TDate[], isIndexFund = false): TAssetData {
    const data1: TAssetData = [];

    let prevDataObject: TAssetDataItem | undefined;

    for (let i = 0; i < responseData.length; i++) {
        const item: TFetchDataItemMoex = responseData[i];
        const marketType: string = item[0] as unknown as string;

        // TODO: В дальнейшем, разобраться более детально с типами торгов.
        // if ((!isIndexFund && marketType !== 'CETS') || (isIndexFund && marketType !== 'TQTF')) {
        if (marketType !== 'CETS' && marketType !== 'TQTF') {
            continue;
        }

        const date: string = moment(item[1], DATE_FORMATS.moex).format(DATE_FORMATS.default);
        let value: number;

        if (isIndexFund) {
            value = item[14] || item[13] || (item[6] + item[11]) / 2;
        } else {
            value = item[10] || ((item[4] + item[7]) / 2);
        }

        // TODO: Возможно, что для Moex первое условие никогда не выполняется. Проверить.
        if (date === prevDataObject?.date) {
            prevDataObject.values.current = (prevDataObject.values.current + value) / 2;
        } else {
            const dataObject: TAssetDataItem = {
                date,
                values: {
                    current: value,
                },
            };

            data1.push(dataObject);

            prevDataObject = dataObject;
        }
    }

    if (data1.length === 0) {
        return [];
    }

    let prevValue: number = data1[0].values.current;
    const data2: TAssetData = [];

    for (let i = 0; i < datesFullArray.length; i++) {
        const date = datesFullArray[i];
        const dataItemByDate = data1.find(item => item.date === date);
        let value: number;

        if (dataItemByDate !== undefined) {
            value = dataItemByDate.values.current;
            prevValue = value;
        } else {
            value = prevValue;
        }

        data2.push({
            date,
            values: {
                current: value,
            },
        });
    }

    return data2;
}
