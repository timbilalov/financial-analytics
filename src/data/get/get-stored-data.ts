import type { TAssetData, TAssetOptions, TDate, TFetchDataMoex, TObject, TStoreOptions } from '@types';
import { assetsDataStore, indexFundDataStore, splitsStore, usdDataStore } from '@store';
import { fetchData, fetchIndexFund, fetchUsd } from '@fetch';
import { parseResponseData, parseResponseDataUsd } from '@parse';
import { normalizeAssetData } from '../assets/normalize-asset-data';
import { checkForSplits } from '../assets/check-for-splits';

const FALLBACK_RESULT = [];

export async function getStoredData(dates: TDate[], storeOptions: TStoreOptions, assetOptions: TAssetOptions): Promise<TAssetData> {
    const { store, setStateFunction } = storeOptions;
    const { ticker, isMoex, isBond } = assetOptions || {};

    const storedData = store.getState();
    const dateFrom = dates[0];
    const dateTo = dates[dates.length - 1];

    const splits = splitsStore.getState();

    // eslint-disable-next-line @typescript-eslint/ban-types
    let fetchFunction: Function | null = null;
    // eslint-disable-next-line @typescript-eslint/ban-types
    let parseFunction: Function | null = null;
    let storedDataArray: TAssetData = storedData as TAssetData;

    switch (store) {
        case usdDataStore:
            fetchFunction = fetchUsd;
            parseFunction = parseResponseDataUsd;
            break;

        case indexFundDataStore:
            fetchFunction = fetchIndexFund;
            parseFunction = (responseData, dates) => parseResponseDataUsd(responseData, dates, true);
            break;

        case assetsDataStore:
            if (assetOptions === undefined) {
                break;
            }

            fetchFunction = (dates) => fetchData(ticker as string, dates[0], dates[dates.length - 1], isMoex, isBond);
            parseFunction = (responseData) => parseResponseData(responseData, isMoex, isBond);
            storedDataArray = ((storedData as TObject)[ticker as string] as TAssetData) || [];
            break;
    }

    if (fetchFunction === null || parseFunction === null) {
        return FALLBACK_RESULT;
    }

    let data: TAssetData;
    let dataToStore: TAssetData | null = null;
    let indexFrom = -1;
    let indexTo = -1;

    storedDataArray.forEach((item, index) => {
        const { date } = item;

        if (date === dateFrom) {
            indexFrom = index;
        }
        if (date === dateTo) {
            indexTo = index;
        }
    });

    if (indexFrom !== -1 && indexTo !== -1) {
        data = storedDataArray.slice(indexFrom, indexTo + 1);
    } else if (indexFrom !== -1 || indexTo !== -1) {
        const existingDates: TDate[] = storedDataArray.map(item => item.date);

        if (indexFrom !== -1) {
            const existingData = storedDataArray.slice(indexFrom);
            const newDatesToFetch = dates.slice(dates.indexOf(existingDates[existingDates.length - 1]) + 1);
            const newDataFetched = await fetchFunction(newDatesToFetch) as TFetchDataMoex;
            const newData = parseFunction(newDataFetched, newDatesToFetch);
            if (!newDataFetched || !newData) {
                return FALLBACK_RESULT;
            }

            if (ticker) {
                const newDataCheckedForSplits = checkForSplits(ticker, newData, splits);
                data = existingData.concat(newDataCheckedForSplits);
            } else {
                data = existingData.concat(newData);
            }
        } else {
            const existingData = storedDataArray.slice(0, indexTo + 1);
            const newDatesToFetch = dates.slice(0, dates.indexOf(existingDates[0]));
            const newDataFetched = await fetchFunction(newDatesToFetch) as TFetchDataMoex;
            const newData = parseFunction(newDataFetched, newDatesToFetch);
            if (!newDataFetched || !newData) {
                return FALLBACK_RESULT;
            }

            if (ticker) {
                const newDataCheckedForSplits = checkForSplits(ticker, newData, splits);
                data = newDataCheckedForSplits.concat(existingData);
            } else {
                data = newData.concat(existingData);
            }
        }

        const dataNormalized = normalizeAssetData(data, dates[dates.length - 1]);
        let normalizedDataIndexFrom = 0;
        let normalizedDataIndexTo = dataNormalized.length - 1;
        dataNormalized.forEach((item, index) => {
            if (item.date === dates[0]) {
                normalizedDataIndexFrom = index;
            } else if (item.date === dates[dates.length - 1]) {
                normalizedDataIndexTo = index;
            }
        });
        data = dataNormalized.slice(normalizedDataIndexFrom, normalizedDataIndexTo + 1);
        dataToStore = dataNormalized;
    } else {
        const dataRaw = await fetchFunction(dates) as TFetchDataMoex;
        data = parseFunction(dataRaw, dates);
        if (!dataRaw || !data) {
            return FALLBACK_RESULT;
        }

        let dataNormalized: TAssetData;

        if (ticker) {
            const dataCheckedForSplits = checkForSplits(ticker, data, splits);
            dataNormalized = normalizeAssetData(dataCheckedForSplits, dates[dates.length - 1]);
        } else {
            dataNormalized = normalizeAssetData(data, dates[dates.length - 1]);
        }

        dataToStore = dataNormalized;
        data = dataNormalized;
    }

    if (dataToStore !== null) {
        if (store === assetsDataStore) {
            const dataToStoreAssets = {};
            dataToStoreAssets[ticker as string] = dataToStore;

            if (setStateFunction) {
                setStateFunction(dataToStoreAssets);
            }
        } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            store.setState(dataToStore);
        }
    }

    return data;
}
