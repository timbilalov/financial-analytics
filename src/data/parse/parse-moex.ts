import moment from 'moment';
import { DATE_FORMATS } from '@constants';
import type { TAssetData, TAssetDataItem, TDate, TFetchDataMoex } from '@types';

export function parseResponseDataMoex(responseData: TFetchDataMoex, isBond = false): TAssetData {
    const data: TAssetData = [];

    let prevDataObject: TAssetDataItem | undefined;
    let initialDate: TDate | undefined = undefined;
    let initialBondNkd = 0;
    let initialCost: number | null = null;
    let prevNkdSumm = 0;

    for (let i = 0; i < responseData.length; i++) {
        const item = responseData[i];
        const prevItem = responseData[i - 1];
        const marketType = item[0];

        // TODO: В дальнейшем, разобраться более детально с типами торгов.
        if ((!isBond && (marketType !== 'TQBR' && marketType !== 'TQTF' && marketType !== 'TQTD')) || (isBond && (marketType !== 'TQOB' && marketType !== 'TQCB' && marketType !== 'TQIR'))) {
            continue;
        }

        if (initialDate === undefined) {
            initialDate = moment(item[1], DATE_FORMATS.moex).format(DATE_FORMATS.default);

            if (isBond) {
                initialBondNkd = item[10];
            }
        }

        const date = moment(item[1], DATE_FORMATS.moex).format(DATE_FORMATS.default);
        let value: number;
        let bond: TAssetDataItem['values']['bond'];

        if (isBond) {
            const currentValuePercents = item[15] || item[16] || item[11] || (item[13] + item[8]) / 2;
            const currentNkd = item[10];
            const nominalValue = item[30];
            const nominalNkd = item[27];

            if (initialCost === null) {
                initialCost = nominalValue;
            }

            if (prevItem) {
                const prevNominalNkd = prevItem[10];
                if (currentNkd < prevNominalNkd) {
                    prevNkdSumm += prevItem[27] ?? prevNominalNkd;
                }
            }

            value = currentValuePercents / 100 * nominalValue;

            bond = {
                currentNkd,
                nominalNkd,
                nominalValue,
            };
        } else {
            value = item[13] || item[14] || item[10] || (item[6] + item[11]) / 2;
        }

        if (date === prevDataObject?.date) {
            prevDataObject.values.current = (prevDataObject.values.current + value) / 2;
        } else {
            const dataObject: TAssetDataItem = {
                date,
                values: {
                    current: value,
                    bond,
                },
            };

            data.push(dataObject);

            prevDataObject = dataObject;
        }
    }

    return data;
}
