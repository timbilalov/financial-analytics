import moment from "moment";
import {DATE_FORMATS} from "@constants";
import type {TAssetData, TAssetDataItem, TDate, TFetchDataMoex} from "@types";

export function parseResponseDataMoex(responseData: TFetchDataMoex, isBond: boolean = false): TAssetData {
    const data: TAssetData = [];

    let prevDate: TDate | undefined = undefined;
    let prevDataObject: TAssetDataItem = {
        date: '',
        value: 0,
    };
    let initialDate: TDate | undefined = undefined;
    let initialBondNkd: number = 0;

    for (let i = 0; i < responseData.length; i++) {
        const item = responseData[i];
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

        if (isBond) {
            const initialCost = item[30];
            const couponPercent = item[26];

            value = item[15] || item[16] || item[11] || (item[13] + item[8]) / 2;
            value /= 100;
            value *= initialCost;

            const dateDiff = moment(item[1], DATE_FORMATS.moex).diff(moment(initialDate, DATE_FORMATS.default), 'days');
            const valueDiff = initialCost * couponPercent / 100 * dateDiff / 365;

            value += initialBondNkd;
            value += valueDiff;
        } else {
            value = item[13] || item[14] || item[10] || (item[6] + item[11]) / 2;
        }

        if (date === prevDate) {
            prevDataObject.value = (prevDataObject.value + value) / 2;
        } else {
            const dataObject = {
                date,
                value,
            };

            data.push(dataObject);

            prevDate = date;
            prevDataObject = dataObject;
        }
    }

    return data;
}
