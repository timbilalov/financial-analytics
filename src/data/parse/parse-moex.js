import moment from "moment";
import {DATE_FORMATS} from "../../utils/constants";

export function parseResponseDataMoex(responseData) {
    const data = [];

    const historyData = responseData.history.data;

    let prevDate;
    let prevDataObject;

    for (let i = 0; i < historyData.length; i++) {
        const item = historyData[i];
        if (item[0] !== 'TQBR') {
            continue;
        }

        let date = moment(item[1], DATE_FORMATS.moex).format(DATE_FORMATS.default);
        let dateUTC = moment(date, DATE_FORMATS.default).unix();
        let value = (item[6] + item[11]) / 2;

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
