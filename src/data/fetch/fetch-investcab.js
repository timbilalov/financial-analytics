import moment from "moment";
import {DATE_FORMATS} from "@constants";
import {errorHandler} from "@utils/helpers";

export async function fetchInvestcab(ticker, enteredDateFrom, enteredDateTo) {
    if (ticker === undefined || enteredDateFrom === undefined) {
        return;
    }

    const dateFrom = moment(enteredDateFrom, DATE_FORMATS.default);
    const dateTo = enteredDateTo ? moment(enteredDateTo, DATE_FORMATS.default) : moment();
    const resolution = 60;
    const url = `//investcab.ru/api/chistory?symbol=${ticker}&resolution=${resolution}&from=${dateFrom.unix()}&to=${dateTo.unix()}`;
    const response = await fetch(url);

    if (!response.ok) {
        errorHandler();
        return;
    }

    return await response.json();
}
