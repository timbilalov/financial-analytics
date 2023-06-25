import moment from 'moment';
import { fetchMoex } from './fetch-moex';
import { fetchInvestcab } from './fetch-investcab';
import { DATE_FORMATS, FETCH_SOURCES } from '@constants';
import type { TFetchDataBcs, TFetchDataInvestcab, TFetchDataMoex } from '@types';
import { isEmptyString } from '@helpers';
import { fetchBcs } from './fetch-bcs';

export async function fetchData(ticker: string, manualDateFrom: string, manualDateTo?: string, source: FETCH_SOURCES = FETCH_SOURCES.MOEX, isBond = false, isCurrency = false): Promise<TFetchDataInvestcab | TFetchDataMoex | TFetchDataBcs | undefined> {
    if (isEmptyString(ticker) || isEmptyString(manualDateFrom)) {
        return;
    }

    let result: TFetchDataMoex | TFetchDataInvestcab | TFetchDataBcs;

    const yesterday = moment().add(-1, 'days').format(DATE_FORMATS.default);

    if (manualDateTo === undefined || manualDateTo.trim() === '') {
        manualDateTo = yesterday;
    }

    switch (source) {
        case FETCH_SOURCES.BCS:
            result = await fetchBcs(ticker, manualDateFrom, manualDateTo) as TFetchDataBcs;
            break;

        case FETCH_SOURCES.INVESTCAB:
            // TODO: Есть трабл, когда за один день нет данных. Как вариант, подтягивать за два. Пример: GTN, 2021.02.24
            result = await fetchInvestcab(ticker, manualDateFrom, manualDateTo) as TFetchDataInvestcab;
            break;

        case FETCH_SOURCES.MOEX:
        default:
            result = await fetchMoex(ticker, manualDateFrom, manualDateTo, isBond, isCurrency) as TFetchDataMoex;
    }

    console.log('fetched', ticker, manualDateFrom, manualDateTo)

    return result;
}
