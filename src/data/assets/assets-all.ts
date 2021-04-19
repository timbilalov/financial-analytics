import {getSingleAssetData} from "./assets-single";
import type {TAsset, TAssetRaw} from "@types";

export async function getAssetsData(assetsRaw: TAssetRaw[]): Promise<TAsset[]> {
    const assets: TAsset[] = [];

    for (const assetRaw of assetsRaw) {
        const asset = await getSingleAssetData(assetRaw);

        if (asset === undefined) {
            continue;
        }

        assets.push(asset);
    }

    return assets;
}
