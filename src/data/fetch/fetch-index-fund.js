import {fetchData} from "./fetch-data";

export async function fetchIndexFund(datesFullArray) {
    const ticker = 'vtba'; // TODO: Глянуть, есть ли более подходящий тикер, для сравнения.

    return await fetchData(ticker, datesFullArray[0], datesFullArray[datesFullArray.length - 1], true, false, false);
}
