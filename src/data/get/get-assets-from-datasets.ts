import type { TAsset, TAssets, TDatasets } from '@types';

export function getAssetsFromDatasets(datasets: TDatasets): TAssets {
    const assets: TAssets = [];

    datasets.forEach(dataset => {
        const { ticker, label, dates, data, amount, isUsd } = dataset;
        const assetData: TAsset['data'] = [];

        for (let i = 0; i < data.length; i++) {
            assetData.push({
                date: dates[i],
                value: data[i],
            });
        }

        const asset: TAsset = {
            ticker: ticker || label,
            data: assetData,
            amount,
            isUsd,
        };

        assets.push(asset);
    });

    return assets;
}
