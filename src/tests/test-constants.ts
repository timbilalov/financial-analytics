import {CALC_CURRENCIES, CALC_METHODS} from "@constants";
import type {TAsset, TAssetData, TCalcOptions, TDatasets, TDate, TFetchDataItemMoex, TFetchDataMoex} from "@types";

export const dates: TDate[] = [
    '2020.01.01',
    '2020.01.02',
    '2020.01.03',
    '2020.01.04',
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

export const assets: TAsset[] = [
    {
        ticker: 'asset1',
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
    },
    {
        ticker: 'asset2',
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
    },
];

// TODO: assets
export const datasets: TDatasets = [
    {
        ticker: 'asset1',
        label: 'asset1',
        borderColor: 'red',
        type: 'line',
        borderWidth: 1,
        data: [0, 10, 20, 30],
        dataAbsTotal: [100, 110, 120, 130],
        dates,
        amount: 2,
        isUsd: false,
    },
    {
        ticker: 'asset2',
        label: 'asset2',
        borderColor: 'green',
        type: 'line',
        borderWidth: 1,
        data: [NaN, 0, -2, 4],
        dataAbsTotal: [NaN, 50, 48, 54],
        dates,
        amount: 3,
        isUsd: false,
    },
];

export const options = {
    datesFullArray: dates,
    calcCurrency: CALC_CURRENCIES.RUB,
    usdData,
    indexFundData,
};

export const calcOptionsDefault: TCalcOptions = {
    method: CALC_METHODS.RELATIVE,
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
    t: [1577826000000, 1577912400000, 1577998800000],
    v: [15, 25, 35],
};

export const moexDataRows: TFetchDataMoex = [
    ['TQTF', dates[0], '', '', 10, 20, 30, 40, 50, 60, 70, 80, 90],
    ['TQTF', dates[1], '', '', 11, 21, 31, 41, 51, 61, 71, 81, 91],
    ['TQTF', dates[2], '', '', 12, 22, 32, 42, 52, 62, 72, 82, 92],
    ['TQTF', dates[3], '', '', 13, 23, 33, 43, 53, 63, 73, 83, 93],
];

export const moexDataRowsUsd = moexDataRows.map(item => ['CETS', ...item.slice(1)] as TFetchDataItemMoex);
export const moexDataRowsBonds = moexDataRows.map(item => ['TQCB', ...item.slice(1)] as TFetchDataItemMoex);
