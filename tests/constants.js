import {CALC_CURRENCIES} from "@constants";

export const dates = [
    '2020.01.01',
    '2020.01.02',
    '2020.01.03',
    '2020.01.04',
];

export const usdData = [
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

export const valuesData = [
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

export const valuesDataWithMissingItem = [
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

export const datasets = [
    {
        data: [0, 10, 20, 30],
        dataAbsTotal: [100, 110, 120, 130],
        dates,
        amount: 2,
    },
    {
        data: [NaN, 0, -2, 4],
        dataAbsTotal: [NaN, 50, 48, 54],
        dates,
        amount: 3,
    },
];

export const options = {
    datesFullArray: dates,
    calcCurrency: CALC_CURRENCIES.RUB,
    usdData,
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

export const moexDataRows = [
    ['TQTF', dates[0], undefined, undefined, 10, 20, 30, 40, 50, 60, 70],
    ['TQTF', dates[1], undefined, undefined, 11, 21, 31, 41, 51, 61, 71],
    ['TQTF', dates[2], undefined, undefined, 12, 22, 32, 42, 52, 62, 72],
    ['TQTF', dates[3], undefined, undefined, 13, 23, 33, 43, 53, 63, 73],
];
