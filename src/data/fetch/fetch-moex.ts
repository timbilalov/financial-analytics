import moment from "moment";
import {DATE_FORMATS} from "@constants";
import {errorHandler, isEmptyString} from "@helpers";
import type {TFetchDataMoex, TFetchResponseMoex} from "@types";

export async function fetchMoex(ticker: string, enteredDateFrom: string, enteredDateTo?: string, isBond: boolean = false, isCurrency: boolean = false): Promise<TFetchDataMoex | undefined> {
    if (isEmptyString(ticker) || isEmptyString(enteredDateFrom)) {
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

    const url = `https://iss.moex.com/iss/history/engines/${engine}/markets/${market}/securities/${ticker}/securities.json?from=${dateFrom.format(DATE_FORMATS.moex)}&till=${dateTo.format(DATE_FORMATS.moex)}`;
    let response = await fetch(url);

    if (!response.ok) {
        errorHandler(String(response.status));
        return;
    }

    let responseObject: TFetchResponseMoex = await response.json();
    let isFetchedCompletely = false;
    let data: TFetchDataMoex = responseObject.history.data || [];

    while (!isFetchedCompletely) {
        const cursorData = responseObject['history.cursor'].data[0];
        const [ index, total, pageSize ] = cursorData;

        if (index + pageSize < total) {
            const urlMore = `${url}&start=${index + pageSize}`;
            response = await fetch(urlMore);

            if (!response.ok) {
                errorHandler(String(response.status));
                return;
            }

            responseObject = await response.json();
            data = data.concat(responseObject.history.data);
        } else {
            isFetchedCompletely = true;
        }
    }

    return data;
}
