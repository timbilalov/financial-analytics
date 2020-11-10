import moment from "moment";
import {DATE_FORMATS} from "@constants";

export function parseResponseDataUsd(responseData) {
    const data = [];

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

            data.push(dataObject);

            prevDate = date;
            prevDataObject = dataObject;
        }
    }

    return data;
}
