export const DATE_FORMATS = {
    'default': 'YYYY.MM.DD',
    'moex': 'YYYY-MM-DD',
};

export const CALC_METHODS = {
    RELATIVE: 'relative',
    RELATIVE_ANNUAL: 'relative-annual',
    ABSOLUTE: 'absolute',
    ABSOLUTE_TOTAL: 'absolute-total',
};

export const CALC_CURRENCIES = {
    RUB: 'rub',
    USD: 'usd',
};

export const BANK_DEPOSIT = 0.05;

export const STORAGE_KEYS = {
    portfolio: 'portfolio',
    portfolioList: 'portfolioList',
    portfoliosData: 'portfoliosData',
    datasets: 'datasets',
    datesFullArray: 'datesFullArray',
    assets: 'assets',
    calcMethod: 'calcMethod',
    calcCurrency: 'calcCurrency',
    usdData: 'usdData',
    lang: 'lang',
    fetchData: 'fetchData',
};

export const LANGUAGES = {
    en: 'en',
    ru: 'ru',
};

export const DEFAULT_LANGUAGE = LANGUAGES.ru;

export const ASSET_DEFAULT_FIELDS = [
    'ticker',
    'title',
    'buyDate',
    'sellDate',
    'amount',
    'moex',
    'usd',
    'bond',
    'hide',
];

export const EXPORT_HREF_PARAM_NAME = 'export';
