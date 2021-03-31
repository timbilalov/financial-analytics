import moment from "moment";
import {fetchMoex} from "./fetch-moex";
import {fetchInvestcab} from "./fetch-investcab";
import LocalStorage from "@utils/local-storage";
import {DATE_FORMATS, STORAGE_KEYS} from "@constants";

export async function fetchData(ticker, manualDateFrom, manualDateTo, isMoex = false, isBond = false, isCurrency = false) {
    if (ticker === undefined || manualDateFrom === undefined) {
        return;
    }

    let result;
    let manualDateToDefined = true;

    const yesterday = moment().add(-1, 'days').format(DATE_FORMATS.default);

    if (manualDateTo === undefined || (typeof manualDateTo === 'string' && manualDateTo.trim() === '')) {
        manualDateTo = yesterday;
    }

    if (manualDateTo === yesterday) {
        manualDateToDefined = false;
    }

    let cachedDataArray = LocalStorage.get(STORAGE_KEYS.fetchData) || [];

    // Clean LS, because of size limits
    cachedDataArray = cachedDataArray.filter(item => {
        if (item.ticker === ticker && item.manualDateFrom === manualDateFrom && manualDateToDefined === false) {
            return item.manualDateTo === yesterday;
        } else {
            return true;
        }
    });

    const cachedItem = cachedDataArray.filter(item => {
        const condition1 = item.ticker.toLowerCase() === ticker.toLowerCase();
        const condition2 = item.manualDateFrom === manualDateFrom;
        const condition3 = item.manualDateTo === manualDateTo;

        return condition1 && condition2 && condition3;
    })[0];

    if (cachedItem !== undefined) {
        return cachedItem.data;
    }

    if (isMoex) {
        result = await fetchMoex(ticker, manualDateFrom, manualDateTo, isBond, isCurrency);
    } else {
        result = await fetchInvestcab(ticker, manualDateFrom, manualDateTo);
    }

    const itemToCache = {
        ticker,
        manualDateFrom,
        manualDateTo,
        data: result,
    };

    cachedDataArray.push(itemToCache);
    LocalStorage.set(STORAGE_KEYS.fetchData, cachedDataArray, true);

    console.log('fetched', ticker, manualDateFrom, manualDateTo, 'manualDateToDefined', manualDateToDefined, 'cachedDataArray.length', cachedDataArray.length)

    return result;
}
