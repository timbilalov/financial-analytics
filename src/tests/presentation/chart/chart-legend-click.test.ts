import { onLegendClick } from '@presentation';
import { calcOptionsDefault, datasets, dates } from '@test-constants';
import { clearLegendItems, setChartInstance } from '@store';
import { BANK_DEPOSIT_LABEL, EARNED_MONEY_LABEL, INDEX_FUND_LABEL, OWN_MONEY_LABEL, TOTAL_LABEL } from '@constants';
import type { TDataset, TLegendItem } from '@types';
import { extendObject } from '@helpers';

describe('chart-legend-click', function () {
    const legendItem: TLegendItem = {
        datasetIndex: 0,
        hidden: false,
    };

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

    test('should update common datasets: total, bank depo, own money, index fund, earned money', async function () {
        const chart2 = Object.assign({}, chart);

        const dataTotal = [10, 20, 30, 40];
        const dataBankDepo = [11, 21, 31, 41];
        const dataOwnMoney = [12, 22, 32, 42];
        const dataIndexFund = [13, 23, 33, 43];
        const dataEarnedMoney = [14, 24, 34, 44];

        const datasetBase: TDataset = {
            asset: {
                ticker: '',
                data: dates.map(date => ({
                    date,
                    value: 0,
                })),
                buyDate: dates[0],
                isUsd: false,
                amount: 1,
            },
            label: '',
            data: [],
            dates,
            borderWidth: 1,
            borderColor: 'red',
            type: 'line',
        };

        const datasetTotal: TDataset = extendObject(datasetBase, {
            label: TOTAL_LABEL,
            data: dataTotal,
        });
        const datasetBankDepo: TDataset = extendObject(datasetBase, {
            label: BANK_DEPOSIT_LABEL,
            data: dataBankDepo,
        });
        const datasetOwnMoney: TDataset = extendObject(datasetBase, {
            label: OWN_MONEY_LABEL,
            data: dataOwnMoney,
        });
        const datasetIndexFund: TDataset = extendObject(datasetBase, {
            label: INDEX_FUND_LABEL,
            data: dataIndexFund,
        });
        const datasetEarnedMoney: TDataset = extendObject(datasetBase, {
            label: EARNED_MONEY_LABEL,
            data: dataEarnedMoney,
        });

        chart2.config.data.datasets.push(datasetTotal);
        chart2.config.data.datasets.push(datasetBankDepo);
        chart2.config.data.datasets.push(datasetOwnMoney);
        chart2.config.data.datasets.push(datasetIndexFund);
        chart2.config.data.datasets.push(datasetEarnedMoney);

        setChartInstance(chart2);

        await onLegendClick(legendItem, calcOptionsDefault);

        expect(datasetTotal.data).not.toEqual(dataTotal);
        expect(datasetBankDepo.data).not.toEqual(dataBankDepo);
        expect(datasetOwnMoney.data).not.toEqual(dataOwnMoney);
        expect(datasetIndexFund.data).not.toEqual(dataIndexFund);
        expect(datasetEarnedMoney.data).not.toEqual(dataEarnedMoney);
    });
});
