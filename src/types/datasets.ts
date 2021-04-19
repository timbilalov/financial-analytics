type TDatasetType = 'line' | 'bar';

export type TDataset = {
    ticker?: string;
    label: string;
    backgroundColor?: string; // TODO: TColor
    borderColor: string; // TODO: TColor
    data: number[];
    dataAbsTotal?: number[];
    dates: string[];
    type: TDatasetType;
    pointRadius?: number;
    fill?: string | false;
    lineTension?: number;
    borderWidth: number;
    borderDash?: number;
    amount: number;
    isUsd: boolean;
    hidden?: boolean;
    _tooltipSameIndexes?: number[],
};

export type TDatasets = TDataset[];
