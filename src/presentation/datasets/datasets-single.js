import {calcData} from "@logic";
import {
    BANK_DEPOSIT_LABEL,
    CALC_METHODS,
    DATE_FORMATS,
    INDEX_FUND_LABEL,
    OWN_MONEY_LABEL,
    TOTAL_LABEL
} from "@constants";
import moment from "moment";
import {addDatasetColor, datasetsColorsStore} from "@store";
import {isLabelCommon, isObject} from "@helpers";

export function prepareSingleDataset(options) {
    if (!isObject(options)) {
        return;
    }

    const {title, data, amount, isUsd, datesFullArray, calcMethod, usdData, calcCurrency, useTaxes} = options;

    const datasetsColors = datasetsColorsStore.getState();
    const getRandomNumber = () => Math.round(Math.random() * 255);

    let colorRGB;
    let opacity = 0.6;
    let borderWidth = 1;
    let borderDash;

    if (datasetsColors[title] !== undefined) {
        colorRGB = datasetsColors[title];
    } else {
        colorRGB = [getRandomNumber(), getRandomNumber(), getRandomNumber()];
    }

    if (title === TOTAL_LABEL) {
        colorRGB = [0, 0, 0];
        opacity = 1;
        borderWidth = 2;
    }

    if (title === BANK_DEPOSIT_LABEL) {
        colorRGB = [160, 160, 160];
        opacity = 0.7;
        borderWidth = 2;
        borderDash = [20, 20];
    }

    if (title === INDEX_FUND_LABEL) {
        colorRGB = [20, 80, 150];
        opacity = 0.7;
        borderWidth = 2;
        borderDash = [3, 3];
    }

    if (title === OWN_MONEY_LABEL) {
        colorRGB = [20, 160, 20];
        opacity = 0.15;
        borderWidth = 0;
    }

    addDatasetColor({
        title,
        color: colorRGB,
    });

    let values;
    let valuesAbsTotal;
    let dates;
    let hasBegun = false;
    let prevValue;
    let prevValueAbsTotal;
    let calculatedData;
    let calculatedDataAbsTotal;
    let shouldStoreAbsTotal = false;

    if (isLabelCommon(title)) {
        calculatedData = data;
    } else {
        calculatedData = calcData(title, data, amount, isUsd, calcMethod, usdData, calcCurrency, useTaxes);
        shouldStoreAbsTotal = true;
        calculatedDataAbsTotal = calcData(title, data, amount, isUsd, CALC_METHODS.ABSOLUTE_TOTAL, usdData, calcCurrency, useTaxes);
    }

    if (Array.isArray(datesFullArray) && datesFullArray.length !== 0) {
        dates = datesFullArray.slice(0);
        values = [];
        valuesAbsTotal = [];

        for (const [index, date] of dates.entries()) {
            let valueByDate;
            let valueByDateAbsTotal;
            const itemFilteredByDate = calculatedData.filter(item => item.date === date)[0];
            const itemFilteredByDateAbsTotal = shouldStoreAbsTotal && calculatedDataAbsTotal.filter(item => item.date === date)[0];
            if (itemFilteredByDate !== undefined) {
                valueByDate = itemFilteredByDate.value;
                valueByDateAbsTotal = shouldStoreAbsTotal && itemFilteredByDateAbsTotal.value;
                hasBegun = true;
                prevValue = valueByDate;
                prevValueAbsTotal = shouldStoreAbsTotal && valueByDateAbsTotal;
            } else {
                const date1 = moment(calculatedData[calculatedData.length - 1].date, DATE_FORMATS.default);
                const date2 = moment(date, DATE_FORMATS.default);
                const diff = date2.diff(date1, 'days');

                // TODO: С этим бывают косяки. Поправить.
                let hasFinished = diff > 0;

                if (!hasBegun || hasFinished) {
                    valueByDate = NaN;
                    valueByDateAbsTotal = NaN;
                } else {
                    valueByDate = prevValue;
                    valueByDateAbsTotal = prevValueAbsTotal;
                }
            }
            values.push(valueByDate);
            shouldStoreAbsTotal && valuesAbsTotal.push(valueByDateAbsTotal);
        }
    } else {
        dates = calculatedData.map(item => item.date);
        values = calculatedData.map(item => item.value);
    }

    const dataset = {
        label: title,
        backgroundColor: `rgba(${colorRGB.join(', ')}, 0.2)`,
        borderColor: `rgba(${colorRGB.join(', ')}, ${opacity})`,
        data: values,
        dates: dates,
        type: 'line',
        pointRadius: 0,
        fill: false,
        lineTension: 0,
        borderWidth,
        amount,
        isUsd,
    };

    if (shouldStoreAbsTotal) {
        dataset.dataAbsTotal = valuesAbsTotal;
    }

    if (borderDash !== undefined) {
        dataset.borderDash = borderDash;
    }

    if (title === OWN_MONEY_LABEL) {
        dataset.type = 'bar';
    }

    return dataset;
}
