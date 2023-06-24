import { CALC_METHODS } from '@constants';
import type { TCalcOptions, TDatasets, TTooltipItem } from '@types';
import { isEmptyString } from '@helpers';

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

    labelText = `${label}: ${parseFloat(value).toFixed(2)}`;
    if (nonZeroLabelValues.length > 1) {
        if (sameLabelDatasets[0]._tooltipSameIndexes.indexOf(tooltipItem.datasetIndex) > 0) {
            labelText = '';
        } else {
            labelText = `${label}: [${nonZeroLabelValues.map(item => item.toFixed(2)).join(',')}]`;

            switch (method) {
                case CALC_METHODS.ABSOLUTE:
                case CALC_METHODS.ABSOLUTE_TOTAL:
                default:
                    labelText += `, total ${(nonZeroLabelValues.reduce((p, c) => p + c)).toFixed(2)}`;
                    break;
            }
        }
    }

    return labelText;
}
