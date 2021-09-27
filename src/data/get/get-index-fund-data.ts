import type { TAssetData, TAssetOptions, TAssets, TStoreOptions } from '@types';
import { getDatesFullArray } from './get-dates-full-array';
import { getStoredData } from './get-stored-data';
import { indexFundDataStore } from '@store';
import { INDEX_FUND_TICKER } from '@constants';

export async function getIndexFundData(assets: TAssets): Promise<TAssetData> {
    const dates = getDatesFullArray(assets);
    const storeOptions: TStoreOptions = {
        store: indexFundDataStore,
    };
    const assetOptions: TAssetOptions = {
        ticker: INDEX_FUND_TICKER,
    };

    return await getStoredData(dates, storeOptions, assetOptions);
}
