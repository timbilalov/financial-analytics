import { onLegendClick } from '@presentation';
import { calcOptionsDefault, datasets, dates, moexDataRowsUsd } from '@test-constants';
import { clearLegendItems, setChartInstance } from '@store';
import { BANK_DEPOSIT_LABEL, INDEX_FUND_LABEL, OWN_MONEY_LABEL, TOTAL_LABEL } from '@constants';
import type { TDataset, TLegendItem } from '@types';

declare const global: {
    fetch: unknown,
};

describe('chart-legend-click', function () {
    const legendItem: TLegendItem = {
        datasetIndex: 0,
        hidden: false,
    };

    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: 1,
            json: () => Promise.resolve({
                'history': {
                    columns: ['BOARDID', 'TRADEDATE', 'SHORTNAME', 'SECID', 'OPEN', 'LOW', 'HIGH', 'CLOSE', 'NUMTRADES', 'VOLRUR', 'WAPRICE'],
                    data: [
                        moexDataRowsUsd[0],
                        moexDataRowsUsd[1],
                        moexDataRowsUsd[2],
                        moexDataRowsUsd[3],
                    ],
                },
                'history.cursor': {
                    columns: ['INDEX', 'TOTAL', 'PAGESIZE'],
                    data: [
                        [1, 2, 3],
                    ],
                },
            }),
        }),
    );

    const chart = {
        config: {
            data: {
                datasets: datasets,
            },
        },
        update: jest.fn(() => {
            // do nothing
        }),
    };
    setChartInstance(chart);

    beforeEach(function () {
        clearLegendItems();
    });

    test('should not throw', function () {
        expect(onLegendClick).not.toThrow();
    });

    test('should return nothing (undefined)', async function () {
        const result = await onLegendClick(legendItem, calcOptionsDefault);

        expect(result).toBe(undefined);
        expect(chart.update).toBeCalledTimes(1);
    });

    test('should set/unset hidden to specified datasets', async function () {
        legendItem.hidden = false;
        const datasets = chart.config.data.datasets;
        const label = datasets[legendItem.datasetIndex].label;
        const filteredDatasets = datasets.filter(item => item.label === label);
        const dataset = filteredDatasets[0];
        const hiddenState1 = !!dataset.hidden;

        await onLegendClick(legendItem, calcOptionsDefault);
        const hiddenState2 = !!dataset.hidden;

        legendItem.hidden = true;
        await onLegendClick(legendItem, calcOptionsDefault);
        const hiddenState3 = !!dataset.hidden;

        legendItem.hidden = false;
        await onLegendClick(legendItem, calcOptionsDefault);
        const hiddenState4 = !!dataset.hidden;

        expect(hiddenState2).toBe(hiddenState1);
        expect(hiddenState3).not.toBe(hiddenState2);
        expect(hiddenState4).not.toBe(hiddenState3);
        expect(hiddenState4).toBe(hiddenState2);
    });

    test('should update common datasets: total, bank depo, own money, index fund', async function () {
        const chart2 = Object.assign({}, chart);

        const dataTotal = [10, 20, 30, 40];
        const dataBankDepo = [11, 21, 31, 41];
        const dataOwnMoney = [12, 22, 32, 42];
        const dataIndexFund = [13, 23, 33, 43];

        const datasetTotal: TDataset = {
            label: TOTAL_LABEL,
            data: dataTotal,
            dates,
            isUsd: false,
            amount: 1,
            borderWidth: 1,
            borderColor: 'red',
            type: 'line',
        };
        const datasetBankDepo: TDataset = {
            label: BANK_DEPOSIT_LABEL,
            data: dataBankDepo,
            dates,
            isUsd: false,
            amount: 1,
            borderWidth: 1,
            borderColor: 'red',
            type: 'line',
        };
        const datasetOwnMoney: TDataset = {
            label: OWN_MONEY_LABEL,
            data: dataOwnMoney,
            dates,
            isUsd: false,
            amount: 1,
            borderWidth: 1,
            borderColor: 'red',
            type: 'line',
        };
        const datasetIndexFund: TDataset = {
            label: INDEX_FUND_LABEL,
            data: dataIndexFund,
            dates,
            isUsd: false,
            amount: 1,
            borderWidth: 1,
            borderColor: 'red',
            type: 'line',
        };

        chart2.config.data.datasets.push(datasetTotal);
        chart2.config.data.datasets.push(datasetBankDepo);
        chart2.config.data.datasets.push(datasetOwnMoney);
        chart2.config.data.datasets.push(datasetIndexFund);

        setChartInstance(chart2);

        await onLegendClick(legendItem, calcOptionsDefault);

        expect(datasetTotal.data).not.toBe(dataTotal);
        expect(datasetBankDepo.data).not.toBe(dataBankDepo);
        expect(datasetOwnMoney.data).not.toBe(dataOwnMoney);
        expect(datasetIndexFund.data).not.toBe(dataIndexFund);
    });
});
