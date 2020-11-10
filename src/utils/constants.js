export const DATE_FORMATS = {
    'default': 'YYYY.MM.DD',
    'moex': 'YYYY-MM-DD',
};

export const CALC_METHODS = {
    RELATIVE: 'relative',
    ABSOLUTE: 'absolute',
    ABSOLUTE_TOTAL: 'absolute-total',
};

export const BANK_DEPOSIT = 0.05;

export const STORAGE_KEYS = {
    portfolio: 'portfolio',
    portfolioList: 'portfolioList',
    datasets: 'datasets',
    datesFullArray: 'datesFullArray',
    assets: 'assets',
    calcMethod: 'calcMethod',
    usdData: 'usdData',
};

export const ASSET_DEFAULT_FIELDS = [
    'ticker',
    'buyDate',
    'sellDate',
    'amount',
    'moex',
    'usd',
    'bond',
    'hide',
];
