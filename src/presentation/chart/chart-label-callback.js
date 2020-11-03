import {CALC_METHODS} from "../../utils/constants";

export function labelCallback(tooltipItem, data, calcMethod) {
    const dataset = data.datasets[tooltipItem.datasetIndex];
    const label = dataset.label;
    const date = tooltipItem.label;
    const sameLabelDatasets = data.datasets.filter(item => item.label === label);

    const nonZeroLabelValues = (function () {
        const index = sameLabelDatasets[0].dates.indexOf(date);
        return sameLabelDatasets.filter(item => !!item.data[index]).map(item => item.data[index]);
    })();
    let labelText = '';

    if (label === undefined) {
        return '';
    }

    const value = tooltipItem.value;

    sameLabelDatasets[0]._tooltipSameIndexes = sameLabelDatasets[0]._tooltipSameIndexes || [];
    if (!sameLabelDatasets[0]._tooltipSameIndexes.includes(tooltipItem.datasetIndex)) {
        sameLabelDatasets[0]._tooltipSameIndexes.push(tooltipItem.datasetIndex);
    }

    labelText = `${label}: ${parseFloat(value).toFixed(2)}`;
    if (nonZeroLabelValues.length > 1) {
        if (sameLabelDatasets[0]._tooltipSameIndexes.indexOf(tooltipItem.datasetIndex) > 0) {
            labelText = undefined;
        } else {
            labelText = `${label}: [${nonZeroLabelValues.map(item => item.toFixed(2)).join(',')}]`;

            if (calcMethod === CALC_METHODS.RELATIVE) {
                labelText += `, avg ${(nonZeroLabelValues.reduce((p, c) => p + c) / nonZeroLabelValues.length).toFixed(2)}`;
            } else if (calcMethod === CALC_METHODS.ABSOLUTE || calcMethod === CALC_METHODS.ABSOLUTE_TOTAL) {
                labelText += `, total ${(nonZeroLabelValues.reduce((p, c) => p + c)).toFixed(2)}`;
            }
        }
    }

    return labelText;
}
