import moment from "moment";
import {DATE_FORMATS} from "@constants";

export function parseResponseDataMoex(responseData, isBond) {
    const data = [];

    const historyData = responseData.history.data;

    let prevDate;
    let prevDataObject;

    let initialDate;
    let initialBondNkd;
    for (let i = 0; i < historyData.length; i++) {
        const item = historyData[i];
        if ((!isBond && item[0] !== 'TQBR') || (isBond && (item[0] !== 'TQOB' && item[0] !== 'TQCB'))) {
            continue;
        }

        if (initialDate === undefined) {
            initialDate = moment(item[1], DATE_FORMATS.moex);
            if (isBond) {
                initialBondNkd = item[10];
            }
        }

        let date = moment(item[1], DATE_FORMATS.moex).format(DATE_FORMATS.default);
        let dateUTC = moment(date, DATE_FORMATS.default).unix();
        let value = (item[6] + item[11]) / 2;

        if (isBond) {
            const initialCost = item[30];
            const couponPercent = item[26];

            value = (item[13] + item[8]) / 2 / 100;
            value *= initialCost;

            const dateDiff = moment(item[1], DATE_FORMATS.moex).diff(initialDate, 'days');
            const valueDiff = initialCost * couponPercent / 100 * dateDiff / 365;

            value += initialBondNkd;
            value += valueDiff;
        }

        if (date === prevDate) {
            prevDataObject.value = (prevDataObject.value + value) / 2;
        } else {
            const dataObject = {
                dateUTC,
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
