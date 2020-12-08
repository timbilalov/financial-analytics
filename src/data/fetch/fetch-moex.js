import moment from "moment";
import {DATE_FORMATS} from "@constants";
import {errorHandler} from "@helpers";

export async function fetchMoex(ticker, enteredDateFrom, enteredDateTo, isBond = false, isCurrency = false) {
    if (ticker === undefined || enteredDateFrom === undefined) {
        return;
    }

    const yesterday = moment().add(-1, 'days');

    const dateFrom = moment(enteredDateFrom, DATE_FORMATS.default);
    const dateTo = enteredDateTo ? moment(enteredDateTo, DATE_FORMATS.default) : yesterday;

    let market = 'shares';
    let engine = 'stock';

    if (isBond) {
        market = 'bonds';
    }

    if (isCurrency) {
        market = 'selt';
        engine = 'currency';
    }

    const url = `//iss.moex.com/iss/history/engines/${engine}/markets/${market}/securities/${ticker}/securities.json?from=${dateFrom.format(DATE_FORMATS.moex)}&till=${dateTo.format(DATE_FORMATS.moex)}`;
    let response = await fetch(url);

    if (!response.ok) {
        errorHandler();
        return;
    }

    let json = await response.json();
    let isFetchedCompletely = false;
    let data = json.history.data || [];

    while (isFetchedCompletely === false) {
        const cursorData = json['history.cursor'].data[0];
        const [ index, total, pageSize ] = cursorData;

        if (index + pageSize < total) {
            const urlMore = `${url}&start=${index + pageSize}`;
            response = await fetch(urlMore);

            if (!response.ok) {
                errorHandler();
                return;
            }

            json = await response.json();
            data = data.concat(json.history.data);
        } else {
            isFetchedCompletely = true;
        }
    }

    return data;
}
