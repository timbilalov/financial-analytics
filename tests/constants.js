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
