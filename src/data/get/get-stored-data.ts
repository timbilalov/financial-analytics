import moment from 'moment';

import type { TAssetData, TAssetOptions, TDate, TFetchDataMoex, TObject, TStoreOptions } from '@types';
import { assetsDataStore, indexFundDataStore, splitsStore, usdDataStore } from '@store';
import { fetchData, fetchIndexFund, fetchUsd } from '@fetch';
import { parseResponseData, parseResponseDataInvestcab, parseResponseDataUsd } from '@parse';
import { normalizeAssetData } from '../assets/normalize-asset-data';
import { checkForSplits } from '../assets/check-for-splits';
import { DATE_FORMATS, FETCH_SOURCES } from '@constants';
import { normalizeDatesArray } from './normalize-dates-array';

const FALLBACK_RESULT = [];

export async function getStoredData(dates: TDate[], storeOptions: TStoreOptions, assetOptions: TAssetOptions): Promise<TAssetData> {
    const { store, setStateFunction } = storeOptions;
    const { ticker, isMoex, isBond } = assetOptions || {};

    const storedData = store.getState();
    let dateFrom = dates[0];
    let dateTo = dates[dates.length - 1];

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
            parseFunction = (responseData) => parseResponseDataInvestcab(responseData);
            break;

        case assetsDataStore:
            if (assetOptions === undefined) {
                break;
            }

            fetchFunction = (dates) => fetchData(ticker as string, dates[0], dates[dates.length - 1], isMoex ? FETCH_SOURCES.MOEX : FETCH_SOURCES.INVESTCAB, isBond);
            parseFunction = (responseData) => parseResponseData(responseData, isMoex, isBond);
            storedDataArray = ((storedData as TObject)[ticker as string] as TAssetData) || [];
            break;
    }

    if (fetchFunction === null || parseFunction === null) {
        return FALLBACK_RESULT;
    }

    let data: TAssetData;
    let dataToStore: TAssetData | null = null;
    let dataToStorePart: TAssetData = [];
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

    let hasExtrapolation = false;

    if (indexFrom === -1 && indexTo === -1 && storedDataArray.length > 0) {
        hasExtrapolation = true;

        const diff1 = moment(dateFrom, DATE_FORMATS.default).diff(moment(storedDataArray[storedDataArray.length - 1].date, DATE_FORMATS.default), 'days');
        const diff2 = moment(storedDataArray[0].date, DATE_FORMATS.default).diff(moment(dateTo, DATE_FORMATS.default), 'days');

        if (diff1 > 0) {
            indexFrom = 0;
            dateFrom = moment(storedDataArray[storedDataArray.length - 1].date, DATE_FORMATS.default).add(1, 'days').format(DATE_FORMATS.default);
        } else if (diff2 > 0) {
            indexTo = 0;
            dateTo = moment(storedDataArray[0].date, DATE_FORMATS.default).add(-1, 'days').format(DATE_FORMATS.default);
        }
    }

    if (indexFrom !== -1 && indexTo !== -1) {
        data = storedDataArray.slice(indexFrom, indexTo + 1);
    } else if (indexFrom !== -1 || indexTo !== -1) {
        const existingDates: TDate[] = storedDataArray.map(item => item.date);

        if (indexFrom !== -1) {
            const existingData = storedDataArray.slice(indexFrom);
            dataToStorePart = hasExtrapolation ? existingData.slice() : storedDataArray.slice(0, indexFrom);
            const newDatesToFetch = hasExtrapolation ? normalizeDatesArray([dateFrom, dateTo]) : dates.slice(dates.indexOf(existingDates[existingDates.length - 1]) + 1);
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
            dataToStorePart = hasExtrapolation ? storedDataArray.slice() : storedDataArray.slice(indexTo + 1);
            const newDatesToFetch = hasExtrapolation ? normalizeDatesArray([dateFrom, dateTo]) : dates.slice(0, dates.indexOf(existingDates[0]));
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

        const dataNormalized = normalizeAssetData(data, dateTo, dateFrom, assetOptions);
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

        if (indexFrom !== -1) {
            dataToStore = dataToStorePart.concat(dataNormalized);
        } else {
            dataToStore = dataNormalized.concat(dataToStorePart);
        }
    } else {
        const dataRaw = await fetchFunction(dates) as TFetchDataMoex;
        data = parseFunction(dataRaw, dates);
        if (!dataRaw || !data) {
            return FALLBACK_RESULT;
        }

        let dataNormalized: TAssetData;

        if (ticker) {
            const dataCheckedForSplits = checkForSplits(ticker, data, splits);
            dataNormalized = normalizeAssetData(dataCheckedForSplits, dates[dates.length - 1], undefined, assetOptions);
        } else {
            dataNormalized = normalizeAssetData(data, dates[dates.length - 1], undefined, assetOptions);
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
