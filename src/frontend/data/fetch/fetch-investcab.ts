import moment from 'moment';
import { DATE_FORMATS } from '@constants';
import { errorHandler, isEmptyString } from '@helpers';
import type { TFetchDataInvestcab } from '@types';

export async function fetchInvestcab(ticker: string, enteredDateFrom: string, enteredDateTo?: string): Promise<TFetchDataInvestcab | undefined> {
    if (isEmptyString(ticker) || isEmptyString(enteredDateFrom)) {
        return;
    }

    const yesterday = moment().add(-1, 'days').format(DATE_FORMATS.default);
    const dateFrom = moment(`${enteredDateFrom} 10:00`, DATE_FORMATS.investcab);
    const dateTo = moment(`${enteredDateTo ? enteredDateTo : yesterday} 19:00`, DATE_FORMATS.investcab);

    const resolution = 60;
    const url = `https://investcab.ru/api/chistory?symbol=${ticker}&resolution=${resolution}&from=${dateFrom.unix()}&to=${dateTo.unix()}`;
    const response = await fetch(url);

    if (!response.ok) {
        errorHandler(String(response.status));
        return;
    }

    return await response.json() as TFetchDataInvestcab;
}
