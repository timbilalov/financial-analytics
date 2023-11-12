import moment from 'moment';
import { DATE_FORMATS } from '@constants';
import { errorHandler, isEmptyString } from '@helpers';
import type { TFetchDataBcs } from '@types';

export async function fetchBcs(ticker: string, enteredDateFrom: string, enteredDateTo?: string): Promise<TFetchDataBcs | undefined> {
    if (isEmptyString(ticker) || isEmptyString(enteredDateFrom)) {
        return;
    }

    const yesterday = moment().add(-1, 'days').format(DATE_FORMATS.default);
    const dateFrom = moment(`${enteredDateFrom} 10:00`, DATE_FORMATS.investcab);
    let dateTo = moment(`${enteredDateTo ? enteredDateTo : yesterday} 19:00`, DATE_FORMATS.investcab);

    const resolution = 60;

    let responseObjectResult!: TFetchDataBcs;
    let isFetchedCompletely = false;

    while (!isFetchedCompletely) {
        const url = `https://api.bcs.ru/udfdatafeed/v1/history?symbol=${ticker}&classcode=FEX&resolution=${resolution}&from=${dateFrom.unix()}&to=${dateTo.unix()}`;
        const response = await fetch(url);

        if (!response.ok) {
            errorHandler(String(response.status));
            return;
        }

        const responseObject = await response.json();
        const lowestDate = moment.unix(responseObject.t[0]);
        const datesDiff = lowestDate.diff(dateFrom, 'days');

        if (responseObject.t.length === 0) {
            responseObjectResult = responseObject;
            break;
        }

        if (!responseObjectResult) {
            responseObjectResult = responseObject;
        } else {
            responseObjectResult = {
                scale: responseObject.scale,
                t: responseObject.t.concat(responseObjectResult.t),
                o: responseObject.o.concat(responseObjectResult.o),
                h: responseObject.h.concat(responseObjectResult.h),
                l: responseObject.l.concat(responseObjectResult.l),
                c: responseObject.c.concat(responseObjectResult.c),
                v: responseObject.v.concat(responseObjectResult.v),
                s: responseObject.s.concat(responseObjectResult.s),
            };
        }

        if (datesDiff <= 0) {
            isFetchedCompletely = true;
            break;
        } else {
            const firstDateInCurrentResponse = moment.unix(responseObject.t[0]);
            const lastDateInCurrentResponse = moment.unix(responseObject.t[responseObject.t.length - 1]);
            const daysInCurrentResponse = lastDateInCurrentResponse.diff(firstDateInCurrentResponse, 'days');

            dateTo = dateTo.add(-(daysInCurrentResponse + 1), 'days');
        }
    }

    return responseObjectResult;
}
