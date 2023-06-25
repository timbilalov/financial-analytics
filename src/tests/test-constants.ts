import { CALC_CURRENCIES, CALC_METHODS } from '@constants';
import type {
    TAsset,
    TAssetData,
    TAssets,
    TCalcOptions,
    TDatasets,
    TDate,
    TFetchDataItemMoex,
    TFetchDataMoex,
} from '@types';
import { extendObject } from '@helpers';

export const dates: TDate[] = [
    '2020.01.01',
    '2020.01.02',
    '2020.01.03',
    '2020.01.04',
    '2020.01.05',
    '2020.01.06',
    '2020.01.07',
];

export const usdData: TAssetData = [
    {
        date: dates[0],
        value: 50,
    },
    {
        date: dates[1],
        value: 51,
    },
    {
        date: dates[2],
        value: 52,
    },
    {
        date: dates[3],
        value: 53,
    },
    {
        date: dates[4],
        value: 54,
    },
    {
        date: dates[5],
        value: 55,
    },
    {
        date: dates[6],
        value: 56,
    },
];

export const indexFundData: TAssetData = [
    {
        date: dates[0],
        value: 4000,
    },
    {
        date: dates[1],
        value: 4100,
    },
    {
        date: dates[2],
        value: 4200,
    },
    {
        date: dates[3],
        value: 4300,
    },
];

export const valuesData: TAssetData = [
    {
        value: 4,
        date: dates[0],
    },
    {
        value: 20,
        date: dates[1],
    },
    {
        value: -7,
        date: dates[2],
    },
    {
        value: 15,
        date: dates[3],
    },
];

export const assetBase: TAsset = {
    ticker: 'tst',
    data: valuesData,
    amount: 1,
    isUsd: false,
    buyDate: '2020.01.01',
};

export const valuesDataWithMissingItem: TAssetData = [
    {
        value: 4,
        date: dates[0],
    },
    {
        value: 20,
        date: dates[1],
    },
    {
        value: 15,
        date: dates[3],
    },
];

export const asset1: TAsset = extendObject(assetBase, {
    ticker: 'ticker1',
    data: [
        {
            date: dates[0],
            value: 0,
        },
        {
            date: dates[1],
            value: 10,
        },
        {
            date: dates[2],
            value: 20,
        },
        {
            date: dates[3],
            value: 30,
        },
    ],
    amount: 2,
    isUsd: false,
    buyDate: dates[0],
});

export const asset2: TAsset = extendObject(assetBase, {
    ticker: 'ticker2',
    data: [
        {
            date: dates[0],
            value: NaN,
        },
        {
            date: dates[1],
            value: 0,
        },
        {
            date: dates[2],
            value: -2,
        },
        {
            date: dates[3],
            value: 4,
        },
    ],
    amount: 3,
    isUsd: false,
    buyDate: dates[0],
});

export const assets: TAssets = [
    asset1,
    asset2,
]

export const datasets: TDatasets = [
    {
        asset: asset1,
        label: 'asset1',
        borderColor: 'red',
        type: 'line',
        borderWidth: 1,
        data: [0, 10, 20, 30],
        dataAbsTotal: [100, 110, 120, 130],
        dates,
    },
    {
        asset: asset2,
        label: 'asset2',
        borderColor: 'green',
        type: 'line',
        borderWidth: 1,
        data: [NaN, 0, -2, 4],
        dataAbsTotal: [NaN, 50, 48, 54],
        dates,
    },
];

export const options = {
    datesFullArray: dates,
    calcCurrency: CALC_CURRENCIES.RUB,
    usdData,
    indexFundData,
};

export const calcOptionsDefault: TCalcOptions = {
    method: CALC_METHODS.ABSOLUTE_TOTAL,
    currency: CALC_CURRENCIES.RUB,
    uses: {
        taxes: false,
    },
};

export const investcabResponseObject = {
    c: [10, 20, 30],
    h: [11, 21, 31],
    l: [12, 22, 32],
    o: [13, 23, 33],
    s: 'ok',
    t: [1577894400000, 1577980800000, 1578067200000],
    v: [15, 25, 35],
};

export const bcsResponseObject = {
    o: [50, 51, 52, 53, 54, 55, 56],
    c: [60, 61, 62, 63, 64, 65, 66],
    t: [1577894400000, 1577980800000, 1578067200000, 1578153600000, 1578240000000, 1578326400000, 1578412800000],
};

export const moexDataRows: TFetchDataMoex = [
    ['TQTF', dates[0], '', '', 10, 20, 30, 40, 50, 60, 70, 80, 90],
    ['TQTF', dates[1], '', '', 11, 21, 31, 41, 51, 61, 71, 81, 91],
    ['TQTF', dates[2], '', '', 12, 22, 32, 42, 52, 62, 72, 82, 92],
    ['TQTF', dates[3], '', '', 13, 23, 33, 43, 53, 63, 73, 83, 93],
    ['TQTF', dates[4], '', '', 14, 24, 34, 44, 54, 64, 74, 84, 94],
    ['TQTF', dates[5], '', '', 15, 25, 35, 45, 55, 65, 75, 85, 95],
    ['TQTF', dates[6], '', '', 16, 26, 36, 46, 56, 66, 76, 86, 96],
];

export const moexDataRowsUsd = moexDataRows.map(item => ['CETS', ...item.slice(1)] as TFetchDataItemMoex);
export const moexDataRowsBonds = moexDataRows.map(item => ['TQCB', ...item.slice(1)] as TFetchDataItemMoex);
