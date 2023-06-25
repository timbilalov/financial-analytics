import { deepClone } from '@helpers';
import { bcsResponseObject, investcabResponseObject, moexDataRows, moexDataRowsUsd } from '@test-constants';
import { FetchMock, disableFetchMocks, enableFetchMocks } from 'jest-fetch-mock';

const enableMocks = (): void => {
    enableFetchMocks();
};

const setResponse = (): void => {
    const responseDataMoex = {
        'history': {
            columns: ['BOARDID', 'TRADEDATE', 'SHORTNAME', 'SECID', 'OPEN', 'LOW', 'HIGH', 'CLOSE', 'NUMTRADES', 'VOLRUR', 'WAPRICE'],
            data: [
                moexDataRows[0],
                moexDataRows[1],
                moexDataRows[2],
                moexDataRows[3],
                moexDataRows[4],
                moexDataRows[5],
                moexDataRows[6],
            ],
        },
        'history.cursor': {
            columns: ['INDEX', 'TOTAL', 'PAGESIZE'],
            data: [
                [1, 2, 3],
            ],
        },
    };

    const responseDataUsd = deepClone(responseDataMoex);
    responseDataUsd.history.data = [
        moexDataRowsUsd[0],
        moexDataRowsUsd[1],
        moexDataRowsUsd[2],
        moexDataRowsUsd[3],
        moexDataRowsUsd[4],
        moexDataRowsUsd[5],
        moexDataRowsUsd[6],
    ];

    const responseDataIndexFund = bcsResponseObject;
    const responseDataAssets = investcabResponseObject;

    fetchMock.mockResponse(req => {
        let resultObject = {};

        if (req.url.includes('iss.moex.com')) {
            if (req.url.includes('/currency/')) {
                resultObject = responseDataUsd;
            } else {
                resultObject = responseDataMoex;
            }
        } else if (req.url.includes('investcab.ru')) {
            resultObject = responseDataAssets;
        } else if (req.url.includes('api.bcs.ru')) {
            resultObject = responseDataIndexFund;
        }

        return Promise.resolve(JSON.stringify(resultObject));
    });
};

const resetMocks = (): void => {
    fetchMock.resetMocks();
};

const disableMocks = (): void => {
    disableFetchMocks();
};

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace jest {
        interface Global {
            fetchMock: FetchMock;
        }
    }
}

export const globalFetchMocks = {
    enable: enableMocks,
    disable: disableMocks,
    reset: resetMocks,
    set: setResponse,
};
