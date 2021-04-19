import type {TAsset, TAssetData, TAssetOptions, TAssets, TDatasets, TDate, TFetchDataMoex, TStoreOptions} from "@types";
import {getDatesFullArray} from "./get-dates-full-array";
import {setUsdData, usdDataStore} from "@store";
import {getStoredData} from "./get-stored-data";
import {USD_TICKER} from "@constants";

export async function getUsdData(assets: TAssets | TAsset): Promise<TAssetData> {
    if (!Array.isArray(assets)) {
        assets = [assets];
    }

    const dates = getDatesFullArray(assets);
    const storeOptions: TStoreOptions = {
        store: usdDataStore,
    };
    const assetOptions: TAssetOptions = {
        ticker: USD_TICKER,
    };

    return await getStoredData(dates, storeOptions, assetOptions);
}
