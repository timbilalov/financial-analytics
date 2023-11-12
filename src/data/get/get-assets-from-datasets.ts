import type { TAssets, TDatasets } from '@types';

export function getAssetsFromDatasets(datasets: TDatasets): TAssets {
    const assets = datasets.map(dataset => dataset.asset);
    return assets.filter(item => item !== undefined) as TAssets;
}
