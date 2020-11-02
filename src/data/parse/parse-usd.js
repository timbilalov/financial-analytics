import moment from "moment";
import {DATE_FORMATS} from "../../utils/constants";

export function parseResponseDataUsd(responseData) {
    const data = [];

    const historyData = responseData.history.data;

    let prevDate;
    let prevDataObject;

    for (let i = 0; i < historyData.length; i++) {
        const item = historyData[i];
        if (item[0] !== 'CETS') {
            continue;
        }

        let date = moment(item[1], DATE_FORMATS.moex).format(DATE_FORMATS.default);
        let dateUTC = moment(date, DATE_FORMATS.default).unix();
        let value = (item[4] + item[7]) / 2;

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
