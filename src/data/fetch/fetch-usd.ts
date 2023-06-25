import { fetchData } from './fetch-data';
import type { TDate, TFetchDataMoex } from '@types';
import { FETCH_SOURCES, USD_TICKER } from '@constants';

export async function fetchUsd(dates: TDate[]): Promise<TFetchDataMoex | undefined> {
    const ticker = USD_TICKER;

    return await fetchData(ticker, dates[0], dates[dates.length - 1], FETCH_SOURCES.MOEX, false, true) as TFetchDataMoex | undefined;
}
