import moment from "moment";
import {DATE_FORMATS} from "@constants";
import {errorHandler} from "@helpers";

export async function fetchInvestcab(ticker, enteredDateFrom, enteredDateTo) {
    if (ticker === undefined || enteredDateFrom === undefined) {
        return;
    }

    const yesterday = moment().add(-1, 'days').format(DATE_FORMATS.default);
    const dateFrom = moment(`${enteredDateFrom} 10:00`, DATE_FORMATS.investcab);
    const dateTo = moment(`${enteredDateTo ? enteredDateTo : yesterday} 19:00`, DATE_FORMATS.investcab);

    const resolution = 60;
    const url = `//investcab.ru/api/chistory?symbol=${ticker}&resolution=${resolution}&from=${dateFrom.unix()}&to=${dateTo.unix()}`;
    const response = await fetch(url);

    if (!response.ok) {
        errorHandler(response.status);
        return;
    }

    return await response.json();
}
