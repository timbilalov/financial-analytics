import { fetchData } from './fetch-data';
import type { TDate, TFetchDataMoex } from '@types';
import { USD_TICKER } from '@constants';

export async function fetchUsd(dates: TDate[]): Promise<TFetchDataMoex | undefined> {
    const ticker = USD_TICKER;

    return await fetchData(ticker, dates[0], dates[dates.length - 1], true, false, true) as TFetchDataMoex | undefined;
}
