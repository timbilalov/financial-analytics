import { fetchData } from './fetch-data';
import type { TDate, TFetchDataMoex } from '@types';

export async function fetchIndexFund(dates: TDate[]): Promise<TFetchDataMoex | undefined> {
    const ticker = 'vtba'; // TODO: Глянуть, есть ли более подходящий тикер, для сравнения.

    return await fetchData(ticker, dates[0], dates[dates.length - 1], true, false, false) as TFetchDataMoex | undefined;
}
