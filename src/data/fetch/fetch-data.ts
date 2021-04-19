import moment from "moment";
import {fetchMoex} from "./fetch-moex";
import {fetchInvestcab} from "./fetch-investcab";
import {isEmptyString, LocalStorage} from "@utils";
import {DATE_FORMATS, STORAGE_KEYS} from "@constants";
import type {TDate, TFetchDataInvestcab, TFetchDataMoex} from "@types";

export async function fetchData(ticker: string, manualDateFrom: string, manualDateTo?: string, isMoex: boolean = false, isBond: boolean = false, isCurrency: boolean = false): Promise<TFetchDataInvestcab | TFetchDataMoex | undefined> {
    if (isEmptyString(ticker) || isEmptyString(manualDateFrom)) {
        return;
    }

    let result: TFetchDataMoex | TFetchDataInvestcab;

    const yesterday = moment().add(-1, 'days').format(DATE_FORMATS.default);

    if (manualDateTo === undefined || manualDateTo.trim() === '') {
        manualDateTo = yesterday;
    }

    if (isMoex) {
        result = await fetchMoex(ticker, manualDateFrom, manualDateTo, isBond, isCurrency) as TFetchDataMoex;
    } else {
        // TODO: Есть трабл, когда за один день нет данных. Как вариант, подтягивать за два. Пример: GTN, 2021.02.24
        result = await fetchInvestcab(ticker, manualDateFrom, manualDateTo) as TFetchDataInvestcab;
    }

    console.log('fetched', ticker, manualDateFrom, manualDateTo)

    return result;
}
