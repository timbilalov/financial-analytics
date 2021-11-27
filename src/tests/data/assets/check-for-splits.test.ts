import { checkForSplits } from '@data';
import type { TAssetData, TSplits } from '@types';
import { deepClone } from '@helpers';

describe('check-for-splits', function () {
    const ticker = 'ticker';
    const tickerData: TAssetData = [
        {
            value: 20,
            date: '2020.01.01',
        },
        {
            value: 30,
            date: '2020.01.02',
        },
        {
            value: 40,
            date: '2020.01.03',
        },
        {
            value: 50,
            date: '2020.01.04',
        },
    ];

    const splits1: TSplits = {
        ticker: [
            {
                splitDate: '2020.01.02',
                amountBefore: 2,
                amountAfter: 3,
            },
        ],
    };

    const splits2: TSplits = {
        ticker: [
            {
                splitDate: '2020.01.02',
                amountBefore: 13,
                amountAfter: 3,
            },
            {
                splitDate: '2020.01.03',
                amountBefore: 2,
                amountAfter: 5,
            },
        ],
    };

    test('should calc a single split', function () {
        const result = checkForSplits(ticker, tickerData, splits1);

        expect(result).toEqual([
            {
                value: 20,
                date: '2020.01.01',
            },
            {
                value: 45, // 30 / 2 * 3
                date: '2020.01.02',
            },
            {
                value: 60, // 40 / 2 * 3
                date: '2020.01.03',
            },
            {
                value: 75, // 50 / 2 * 3
                date: '2020.01.04',
            },
        ]);
    });

    test('should calc a multiple splits', function () {
        const result = checkForSplits(ticker, tickerData, splits2);

        expect(result).toEqual([
            {
                value: 20,
                date: '2020.01.01',
            },
            {
                value: 6.9231, // 30 / 13 * 3
                date: '2020.01.02',
            },
            {
                value: 23.0769, // 40 / 13 * 3 / 2 * 5
                date: '2020.01.03',
            },
            {
                value: 28.8462, // 50 / 13 * 3 / 2 * 5
                date: '2020.01.04',
            },
        ]);
    });

    test('should calc if data dates are different from split date', function () {
        const tickerData2: TAssetData = [
            {
                date: '2020.04.01',
                value: 100,
            },
            {
                date: '2020.04.02',
                value: 120,
            },
        ];
        const result = checkForSplits(ticker, tickerData2, splits1);

        expect(result).toEqual([
            {
                date: '2020.04.01',
                value: 150, // 100 / 2 * 3
            },
            {
                date: '2020.04.02',
                value: 180, // 120 / 2 * 3
            },
        ]);
    });

    test('should return original data if there is no split for this ticker', function () {
        const result = checkForSplits('ticker2', tickerData, splits1);

        expect(result).toBe(tickerData);
    });

    test('should ignore data passed to split prototype', function () {
        const splits = deepClone(splits1);
        delete splits.ticker;
        splits.__proto__ = splits.__proto__ || {};
        splits.__proto__[ticker] = [
            {
                splitDate: '2020.01.02',
                amountBefore: 5,
                amountAfter: 8,
            },
        ];

        const result = checkForSplits(ticker, tickerData, splits);

        expect(result).toBe(tickerData);
    });
});
