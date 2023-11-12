import { CALC_CURRENCIES, CALC_METHODS } from '@constants';
import type {
    TAsset,
    TAssetData,
    TAssets,
    TCalcOptions,
    TDatasets,
    TDate,
    TFetchDataBcs,
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
        values: {
            current: 50,
        },
    },
    {
        date: dates[1],
        values: {
            current: 51,
        },
    },
    {
        date: dates[2],
        values: {
            current: 52,
        },
    },
    {
        date: dates[3],
        values: {
            current: 53,
        },
    },
    {
        date: dates[4],
        values: {
            current: 54,
        },
    },
    {
        date: dates[5],
        values: {
            current: 55,
        },
    },
    {
        date: dates[6],
        values: {
            current: 56,
        },
    },
];

export const indexFundData: TAssetData = [
    {
        date: dates[0],
        values: {
            current: 4000,
        },
    },
    {
        date: dates[1],
        values: {
            current: 4100,
        },
    },
    {
        date: dates[2],
        values: {
            current: 4200,
        },
    },
    {
        date: dates[3],
        values: {
            current: 4300,
        },
    },
];

export const valuesData: TAssetData = [
    {
        values: {
            current: 4,
        },
        date: dates[0],
    },
    {
        values: {
            current: 20,
        },
        date: dates[1],
    },
    {
        values: {
            current: -7,
        },
        date: dates[2],
    },
    {
        values: {
            current: 15,
        },
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
        date: dates[0],
        values: {
            current: 4,
        },
    },
    {
        date: dates[1],
        values: {
            current: 20,
        },
    },
    {
        date: dates[3],
        values: {
            current: 15,
        },
    },
];

export const asset1: TAsset = extendObject(assetBase, {
    ticker: 'ticker1',
    data: [
        {
            date: dates[0],
            values: {
                current: 0,
            },
        },
        {
            date: dates[1],
            values: {
                current: 10,
            },
        },
        {
            date: dates[2],
            values: {
                current: 20,
            },
        },
        {
            date: dates[3],
            values: {
                current: 30,
            },
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
            values: {
                current: NaN,
            },
        },
        {
            date: dates[1],
            values: {
                current: 0,
            },
        },
        {
            date: dates[2],
            values: {
                current: -2,
            },
        },
        {
            date: dates[3],
            values: {
                current: 4,
            },
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

export const bcsResponseObject: TFetchDataBcs = {
    h: [0, 0, 0, 0, 0, 0, 0],
    l: [0, 0, 0, 0, 0, 0, 0],
    v: [0, 0, 0, 0, 0, 0, 0],
    s: 'ok',
    scale: 1,
    o: [50, 51, 52, 53, 54, 55, 56],
    c: [60, 61, 62, 63, 64, 65, 66],
    t: [1577894400, 1577980800, 1578067200000, 1578153600, 1578240000, 1578326400, 1578412800],
};

export const moexDataRows: TFetchDataMoex = [
    ['TQTF', dates[0], '', '', 10, 20, 30, 40, 50, 60, 70, 80, 90, 1, 55, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ['TQTF', dates[1], '', '', 11, 21, 31, 41, 51, 61, 71, 81, 91, 1, 56, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ['TQTF', dates[2], '', '', 12, 22, 32, 42, 52, 62, 72, 82, 92, 1, 57, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ['TQTF', dates[3], '', '', 13, 23, 33, 43, 53, 63, 73, 83, 93, 1, 58, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ['TQTF', dates[4], '', '', 14, 24, 34, 44, 54, 64, 74, 84, 94, 1, 59, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ['TQTF', dates[5], '', '', 15, 25, 35, 45, 55, 65, 75, 85, 95, 1, 60, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ['TQTF', dates[6], '', '', 16, 26, 36, 46, 56, 66, 76, 86, 96, 1, 61, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export const moexDataRowsUsd = moexDataRows.map(item => ['CETS', ...item.slice(1)] as TFetchDataItemMoex);
export const moexDataRowsBonds = moexDataRows.map(item => ['TQCB', ...item.slice(1)] as TFetchDataItemMoex);
