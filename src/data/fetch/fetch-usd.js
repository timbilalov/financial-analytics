import {fetchMoex} from "./fetch-moex";

export async function fetchUsd(enteredDateFrom, enteredDateTo) {
    const ticker = 'USD000UTSTOM';

    return await fetchMoex(ticker, enteredDateFrom, enteredDateTo, false, true);
}
