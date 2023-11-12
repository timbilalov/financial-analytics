import type { TBooleanByInput, TDate } from '@types';

export type TAssetRaw = {
    ticker: string,
    title?: string,
    buyDate: TDate,
    sellDate?: TDate,
    moex?: TBooleanByInput, // TODO: Рефакторить таким образом, чтобы здесь осталось только boolean.
    usd?: TBooleanByInput,
    bond?: TBooleanByInput,
    hide?: TBooleanByInput,
    amount: number | string, // TODO: Рефакторить таким образом, чтобы здесь осталось только number.
};

export type TAssetDataItem = {
    date: TDate,
    // TODO: Когда-нибудь порефакторить таким образом, чтобы в ряде мест использовать другой тип: TAssetDataItemPure.
    values: {
        current: number;
        bond?: {
            currentNkd: number,
            nominalNkd: number,
            nominalValue: number,
        },
    };
};

export type TAssetData = TAssetDataItem[];

export type TAsset = {
    ticker: string,
    title?: string,
    data: TAssetData,
    buyDate: TAssetRaw['buyDate'],
    sellDate?: TAssetRaw['sellDate'],
    amount: number,
    isUsd: boolean,
    isBond?: boolean,
};

export type TAssets = TAsset[];

export type TAssetCommon = {
    title: string,
    data: TAsset['data'],
    buyDate: TAsset['buyDate'],
    sellDate?: TAsset['sellDate'],
};
