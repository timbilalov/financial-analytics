import moment from "moment";
import {DATE_FORMATS} from "@constants";

export function parseResponseDataUsd(responseData, datesFullArray) {
    const data1 = [];

    let prevDate;
    let prevDataObject;

    for (let i = 0; i < responseData.length; i++) {
        const item = responseData[i];
        const marketType = item[0];

        // TODO: В дальнейшем, разобраться более детально с типами торгов.
        if (marketType !== 'CETS') {
            continue;
        }

        const date = moment(item[1], DATE_FORMATS.moex).format(DATE_FORMATS.default);
        const value = (item[4] + item[7]) / 2;

        // TODO: Возможно, что для Moex первое условие никогда не выполняется. Проверить.
        if (date === prevDate) {
            prevDataObject.value = (prevDataObject.value + value) / 2;
        } else {
            const dataObject = {
                date,
                value,
            };

            data1.push(dataObject);

            prevDate = date;
            prevDataObject = dataObject;
        }
    }

    let prevValue = data1[0];
    const data2 = [];

    for (let i = 0; i < datesFullArray.length; i++) {
        const date = datesFullArray[i];
        let value = data1.filter(item => item.date === date);
        if (value.length !== 0) {
            value = value[0].value;
            prevValue = value;
        } else {
            value = prevValue;
        }

        data2.push({
            date,
            value,
        });
    }

    return data2;
}
