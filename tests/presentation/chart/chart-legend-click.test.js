import {onLegendClick} from "@presentation";
import {datasets, dates, options} from "../../constants";
import {clearLegendItems, setChartInstance} from "@store";
import {BANK_DEPOSIT_LABEL, INDEX_FUND_LABEL, OWN_MONEY_LABEL, TOTAL_LABEL} from "@constants";

describe('chart-legend-click', function () {
    const legendItem = {
        datasetIndex: 0,
    };

    const chart = {
        config: {
            data: {
                datasets: datasets,
            },
        },
        update: jest.fn(() => {}),
    };
    setChartInstance(chart);

    beforeEach(function () {
        clearLegendItems();
    });

    test('should return undefined for wrong arguments', function () {
        const result1 = onLegendClick();
        const result2 = onLegendClick(100);
        const result3 = onLegendClick(legendItem);
        const result4 = onLegendClick(legendItem, 100500);

        expect(result1).toBe(undefined);
        expect(result2).toBe(undefined);
        expect(result3).toBe(undefined);
        expect(result4).toBe(undefined);
    });

    test('should not throw', function () {
        expect(onLegendClick).not.toThrow();
    });

    test('should return nothing (undefined)', function () {
        const result = onLegendClick(legendItem, options);

        expect(result).toBe(undefined);
        expect(chart.update).toBeCalledTimes(1);
    });

    test('should set/unset hidden to specified datasets', function () {
        legendItem.hidden = false;
        const datasets = chart.config.data.datasets;
        const label = datasets[legendItem.datasetIndex].label;
        const filteredDatasets = datasets.filter(item => item.label === label);
        const dataset = filteredDatasets[0];
        const hiddenState1 = !!dataset.hidden;

        onLegendClick(legendItem, options);
        const hiddenState2 = !!dataset.hidden;

        legendItem.hidden = true;
        onLegendClick(legendItem, options);
        const hiddenState3 = !!dataset.hidden;

        legendItem.hidden = false;
        onLegendClick(legendItem, options);
        const hiddenState4 = !!dataset.hidden;

        expect(hiddenState2).toBe(hiddenState1);
        expect(hiddenState3).not.toBe(hiddenState2);
        expect(hiddenState4).not.toBe(hiddenState3);
        expect(hiddenState4).toBe(hiddenState2);
    });

    test('should update common datasets: total, bank depo, own money, index fund', function () {
        const chart2 = Object.assign({}, chart);

        const dataTotal = [10, 20, 30, 40];
        const dataBankDepo = [11, 21, 31, 41];
        const dataOwnMoney = [12, 22, 32, 42];
        const dataIndexFund = [13, 23, 33, 43];

        const datasetTotal = {
            label: TOTAL_LABEL,
            data: dataTotal,
            dates,
        };
        const datasetBankDepo = {
            label: BANK_DEPOSIT_LABEL,
            data: dataBankDepo,
            dates,
        };
        const datasetOwnMoney = {
            label: OWN_MONEY_LABEL,
            data: dataOwnMoney,
            dates,
        };
        const datasetIndexFund = {
            label: INDEX_FUND_LABEL,
            data: dataIndexFund,
            dates,
        };

        chart2.config.data.datasets.push(datasetTotal);
        chart2.config.data.datasets.push(datasetBankDepo);
        chart2.config.data.datasets.push(datasetOwnMoney);
        chart2.config.data.datasets.push(datasetIndexFund);

        setChartInstance(chart2);

        onLegendClick(legendItem, options);

        expect(datasetTotal.data).not.toBe(dataTotal);
        expect(datasetBankDepo.data).not.toBe(dataBankDepo);
        expect(datasetOwnMoney.data).not.toBe(dataOwnMoney);
        expect(datasetIndexFund.data).not.toBe(dataIndexFund);
    });
});
