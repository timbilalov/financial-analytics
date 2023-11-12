import type { TAsset } from './assets';
import type { TDate } from './common';

type TDatasetType = 'line' | 'bar';

export type TDataset = {
    asset?: TAsset;
    label: string;
    backgroundColor?: string; // TODO: TColor
    borderColor: string; // TODO: TColor
    data: number[];
    dataAbsTotal?: number[];
    dataEarned?: number[];
    dataFreeMoney?: number[];
    dates: string[];
    type: TDatasetType;
    pointRadius?: number;
    fill?: string | false;
    lineTension?: number;
    borderWidth: number;
    borderDash?: number;
    hidden?: boolean;
    _tooltipSameIndexes?: number[];
    showLine?: boolean;
    stack?: string;
};

export type TDatasets = TDataset[];

export type TDatasetsData = Map<TAsset | string, number[]>;
