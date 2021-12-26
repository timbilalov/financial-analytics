import { getSingleAssetData } from './assets-single';
import type { TAsset, TAssetRaw } from '@types';

export async function getAssetsData(assetsRaw: TAssetRaw[]): Promise<TAsset[]> {
    const assets: TAsset[] = [];
    const promises: Promise<TAsset | undefined>[] = [];

    const uniqueTickers: string[] = [];
    const assetsRawCheckLater: TAssetRaw[] = [];

    for (const assetRaw of assetsRaw) {
        if (uniqueTickers.includes(assetRaw.ticker)) {
            assetsRawCheckLater.push(assetRaw);
        } else {
            uniqueTickers.push(assetRaw.ticker);
            promises.push(getSingleAssetData(assetRaw));
        }
    }

    // Асинхронно грузим все уникальные тикеры, формируем для них первоначальный стор.
    await Promise.allSettled(promises).then(results => {
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value !== undefined) {
                if (result.value?.ticker !== undefined) {
                    assets.push(result.value);
                }
            }
        });
    });

    // Синхронно чекаем повторные покупки для тикеров, по которым уже были получены данные.
    // Это позволяет использовать уже сформированный стор, и меньше обращаться к фетчу.
    for (const assetRaw of assetsRawCheckLater) {
        const asset = await getSingleAssetData(assetRaw);

        if (asset === undefined) {
            continue;
        }

        assets.push(asset);
    }

    return assets;
}
