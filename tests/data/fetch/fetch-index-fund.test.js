import {fetchIndexFund} from '@data';
import {dates, moexDataRows} from '../../constants';

describe('fetch-index-fund', function () {
    const dataRow1 = moexDataRows[0];
    const dataRow2 = moexDataRows[1];
    const dataRow3 = moexDataRows[2];
    const dataRow4 = moexDataRows[3];

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
        const result = await fetchIndexFund(dates);

        expect(result).toEqual([
            dataRow1,
            dataRow2,
            dataRow3,
            dataRow4,
        ]);
    });
});
