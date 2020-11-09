import moment from "moment";
import {DATE_FORMATS} from "@constants";

export async function fetchUsd(enteredDateFrom, enteredDateTo) {
    let dateFrom;
    let dateTo;

    dateFrom = moment(enteredDateFrom, DATE_FORMATS.default);
    if (enteredDateTo !== undefined) {
        dateTo = moment(enteredDateTo, DATE_FORMATS.default);
    } else {
        dateTo = moment();
    }

    const url = `http://iss.moex.com/iss/history/engines/currency/markets/selt/securities/USD000UTSTOM/securities.json?from=${dateFrom.format(DATE_FORMATS.moex)}&to=${dateTo.format(DATE_FORMATS.moex)}`;
    let response = await fetch(url);

    if (response.ok) {
        let json = await response.json();

        let fetchedAll = false;
        let k = 0;
        let json2 = json;
        let allData = json.history.data || [];

        // TEMP: Потом убрать k
        while (!fetchedAll && k < 20) {
            k++;

            const cursorData = json2['history.cursor'].data[0];
            const [ index, total, pageSize ] = cursorData;

            if (index + pageSize < total) {
                const url2more = `${url}&start=${index + pageSize}`;
                let response2 = await fetch(url2more);
                if (response2.ok) {
                    json2 = await response2.json();
                    allData = allData.concat(json2.history.data);
                }
            } else {
                fetchedAll = true;
            }
        }

        json.history.data = allData;
        return json;
    } else {
        console.log("Ошибка HTTP: " + response.status);
    }
}
