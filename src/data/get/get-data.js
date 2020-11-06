import moment from "moment";
import {DATE_FORMATS} from "../../utils/constants";
import {parseResponseData} from "../parse";

export async function getData(symbol, manualDateFrom, manualDateTo, amount, useMoex = false, isUsd = false, isBond = false) {
    let dateFrom;
    let dateTo;

    if (manualDateFrom !== undefined) {
        dateFrom = moment(manualDateFrom, DATE_FORMATS.default);
        if (manualDateTo !== undefined && manualDateTo !== '') {
            dateTo = moment(manualDateTo, DATE_FORMATS.default);
        } else {
            dateTo = moment();
        }
    } else {
        dateFrom = moment(`2019.0${Math.round(Math.random() * 8) + 1}.01`, DATE_FORMATS.default);
        dateTo = moment(`2020.0${Math.round(Math.random() * 8) + 1}.01`, DATE_FORMATS.default);
    }
    const resolution = 60;
    const url = `https://investcab.ru/api/chistory?symbol=${symbol}&resolution=${resolution}&from=${dateFrom.unix()}&to=${dateTo.unix()}`;
    const url2 = `http://iss.moex.com/iss/history/engines/stock/markets/shares/securities/${symbol}/securities.json?from=${dateFrom.format(DATE_FORMATS.moex)}&till=${dateTo.format(DATE_FORMATS.moex)}`;
    const url3 = `http://iss.moex.com/iss/history/engines/stock/markets/bonds/securities/${symbol}/securities.json?from=${dateFrom.format(DATE_FORMATS.moex)}&till=${dateTo.format(DATE_FORMATS.moex)}`;

    let urlToFetch = url;
    if (useMoex) {
        urlToFetch = url2;
    }
    if (isBond) {
        urlToFetch = url3;
    }
    let response = await fetch(urlToFetch);

    if (response.ok) {
        let json = await response.json();

        if (useMoex) {
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
                    const url2more = `${isBond ? url3 : url2}&start=${index + pageSize}`;
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
        }

        const data = parseResponseData(json, useMoex, isBond);

        return {
            title: symbol,
            data: data,
            amount: amount,
            isUsd: isUsd,
        };
    } else {
        console.log("Ошибка HTTP: " + response.status);
    }
}
