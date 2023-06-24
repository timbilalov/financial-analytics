export const DATE_FORMATS = {
    'default': 'YYYY.MM.DD',
    'moex': 'YYYY-MM-DD',
    'investcab': 'YYYY.MM.DD hh:mm',
};

export enum CALC_METHODS {
    ABSOLUTE,
    ABSOLUTE_TOTAL,
}

export enum CALC_CURRENCIES {
    RUB,
    USD,
}

export const BANK_DEPOSIT = 0.05;
export const DEFAULT_TAX = 0.13;

// TODO: Перевести подобные константы на енумы.
export const STORAGE_KEYS = {
    portfolios: 'portfolios',
    calc: 'calc',
    lang: 'lang',
    usdData: 'usdData',
    assetsData: 'assets-data',
    indexFund: 'index-fund',
    splits: 'splits',
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

export const SPLIT_DEFAULT_FIELDS = [
    'ticker',
    'splitDate',
    'amountBefore',
    'amountAfter',
];

export const EXPORT_HREF_PARAM_NAME = 'export';
export const DEFAULT_PORTFOLIO_NAME = 'default';

export const TOTAL_LABEL = 'Total';
export const BANK_DEPOSIT_LABEL = 'Bank depo';
export const OWN_MONEY_LABEL = 'Own money';
export const EARNED_MONEY_LABEL = 'Earned money';
export const INDEX_FUND_LABEL = 'Index Fund';

export const DAYS_IN_YEAR = 365;
export const SUMMARY_PORTFOLIO_NAME = 'summary';

export const LOCALES_TEXT_FALLBACK = '...';

// TODO: Глянуть, есть ли более подходящий тикер, для сравнения.
export const INDEX_FUND_TICKER = 'vtba';
export const USD_TICKER = 'USD000UTSTOM';
