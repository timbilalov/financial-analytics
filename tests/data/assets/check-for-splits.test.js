import {checkForSplits} from "@data";

describe('check-for-splits', function () {
    const tickerData1 = {
        ticker: 'ticker1',
        data: [
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
        ],
    };

    const splits1 = {
        ticker1: [
            {
                splitDate: '2020.01.02',
                amountBefore: 2,
                amountAfter: 3,
            },
        ],
    };

    const splits2 = {
        ticker1: [
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
        const result = checkForSplits(tickerData1, splits1);

        expect(result).toEqual({
            ticker: 'ticker1',
            data: [
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
            ],
        });
    });

    test('should calc a multiple splits', function () {
        const result = checkForSplits(tickerData1, splits2);

        expect(result).toEqual({
            ticker: 'ticker1',
            data: [
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
            ],
        });
    });

    test('should return original data if there is no split for this ticker', function () {
        const tickerData2 = Object.assign({}, tickerData1, {
            ticker: 'ticker2',
        });
        const result = checkForSplits(tickerData2, splits1);

        expect(result).toBe(tickerData2);
    });
});
