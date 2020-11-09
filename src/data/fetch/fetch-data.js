import {fetchMoex} from "./fetch-moex";
import {fetchInvestcab} from "./fetch-investcab";

export async function fetchData(ticker, manualDateFrom, manualDateTo, isMoex = false, isBond = false) {
    let result;

    if (isMoex) {
        result = await fetchMoex(ticker, manualDateFrom, manualDateTo, isBond);
    } else {
        result = await fetchInvestcab(ticker, manualDateFrom, manualDateTo);
    }

    return result;
}
