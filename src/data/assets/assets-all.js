import {getSingleAssetData} from "./assets-single";

export async function getAssetsData(assets) {
    if (!Array.isArray(assets)) {
        return;
    }

    const items = [];

    for (const asset of assets) {
        const assetData = await getSingleAssetData(asset);

        if (assetData === undefined) {
            continue;
        }

        items.push(assetData);
    }

    return items;
}
