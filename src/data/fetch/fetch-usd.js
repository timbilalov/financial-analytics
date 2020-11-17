import {fetchMoex} from "./fetch-moex";

export async function fetchUsd(datesFullArray) {
    const ticker = 'USD000UTSTOM';

    return await fetchMoex(ticker, datesFullArray[0], datesFullArray[datesFullArray.length - 1], false, true);
}
