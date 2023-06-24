import type { TAssets, TDatasets } from '@types';

export function getAssetsFromDatasets(datasets: TDatasets): TAssets {
    return datasets.map(dataset => dataset.asset);
}
