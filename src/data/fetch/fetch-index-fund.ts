import { FETCH_SOURCES, INDEX_FUND_TICKER } from '@constants';
import { fetchData } from './fetch-data';
import type { TDate, TFetchDataMoex } from '@types';

export async function fetchIndexFund(dates: TDate[]): Promise<TFetchDataMoex | undefined> {
    const ticker = INDEX_FUND_TICKER;

    return await fetchData(ticker, dates[0], dates[dates.length - 1], FETCH_SOURCES.BCS, false, false) as TFetchDataMoex | undefined;
}
