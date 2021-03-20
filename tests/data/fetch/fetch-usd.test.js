import {fetchUsd} from '@data';
import {dates} from '../../constants';

describe('fetch-usd', function () {
    const dataRow1 = [undefined, dates[0], undefined, undefined, 10, 20, 30, 40, 50, 60, 70];
    const dataRow2 = [undefined, dates[1], undefined, undefined, 11, 21, 31, 41, 51, 61, 71];
    const dataRow3 = [undefined, dates[2], undefined, undefined, 12, 22, 32, 42, 52, 62, 72];
    const dataRow4 = [undefined, dates[3], undefined, undefined, 13, 23, 33, 43, 53, 63, 73];

    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: 1,
            json: () => Promise.resolve({
                'history': {
                    columns: ['BOARDID', 'TRADEDATE', 'SHORTNAME', 'SECID', 'OPEN', 'LOW', 'HIGH', 'CLOSE', 'NUMTRADES', 'VOLRUR', 'WAPRICE'],
                    data: [
                        dataRow1,
                        dataRow2,
                        dataRow3,
                        dataRow4,
                    ],
                },
                'history.cursor': {
                    columns: ['INDEX', 'TOTAL', 'PAGESIZE'],
                    data: [
                        [1, 2, 3],
                    ],
                },
            }),
        })
    );

    beforeEach(() => {
        fetch.mockClear();
    });

    test('should return an array of values', async function () {
        const result = await fetchUsd(dates);

        expect(result).toEqual([
            dataRow1,
            dataRow2,
            dataRow3,
            dataRow4,
        ]);
    });
});
