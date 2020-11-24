import {fetchData} from "./fetch-data";

export async function fetchUsd(datesFullArray) {
    const ticker = 'USD000UTSTOM';

    return await fetchData(ticker, datesFullArray[0], datesFullArray[datesFullArray.length - 1], true, false, true);
}
