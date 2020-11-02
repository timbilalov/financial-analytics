import {dateFormat} from "../../utils/helpers";

export function parseResponseDataInvestcab(responseData) {
    const parsed = JSON.parse(responseData);
    const data = [];

    let prevDate;
    let prevDataObject;

    for (let i = 0; i < parsed.t.length; i++) {
        let dateUTC = parsed.t[i];
        let date = dateFormat(dateUTC);
        let value = (parsed.c[i] + parsed.o[i]) / 2;

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
