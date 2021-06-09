import {fetchData} from "./fetch-data";
import {INDEX_FUND_TICKER} from "@constants";

export async function fetchIndexFund(datesFullArray) {
    const ticker = INDEX_FUND_TICKER;

    return await fetchData(ticker, datesFullArray[0], datesFullArray[datesFullArray.length - 1], true, false, false);
}
