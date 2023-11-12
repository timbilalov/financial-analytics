import { CALC_METHODS } from '@constants';
import type { TCalcOptions, TDatasets, TTooltipItem } from '@types';
import { isEmptyString, toFractionDigits } from '@helpers';

type TData = {
    datasets: TDatasets,
};

export function labelCallback(tooltipItem: TTooltipItem, data: TData, calcOptions: TCalcOptions): string {
    const { method } = calcOptions;
    const dataset = data.datasets[tooltipItem.datasetIndex];
    const label = dataset.label;
    let labelText = '';

    if (isEmptyString(label)) {
        return labelText;
    }

    const date = tooltipItem.label;
    const sameLabelDatasets = data.datasets.filter(item => item.label === label);

    const nonZeroLabelValues = (function () {
        const index = sameLabelDatasets[0].dates.indexOf(date);
        return sameLabelDatasets.filter(item => !!item.data[index]).map(item => item.data[index]);
    })();

    const value = tooltipItem.value;

    sameLabelDatasets[0]._tooltipSameIndexes = sameLabelDatasets[0]._tooltipSameIndexes || [];
    if (!sameLabelDatasets[0]._tooltipSameIndexes.includes(tooltipItem.datasetIndex)) {
        sameLabelDatasets[0]._tooltipSameIndexes.push(tooltipItem.datasetIndex);
    }

    labelText = `${label}: ${toFractionDigits(value, 2)}`;
    if (nonZeroLabelValues.length > 1) {
        labelText = `${label}: ${toFractionDigits(nonZeroLabelValues.reduce((p, c) => p + c), 2)}`;
    }

    return labelText;
}
