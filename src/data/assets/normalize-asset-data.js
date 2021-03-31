import moment from "moment";
import {DATE_FORMATS} from "@constants";
import {deepClone, isObject} from "@helpers";

export function normalizeAssetData(data, buyDate, sellDate) {
    if (!Array.isArray(data)) {
        return;
    }

    for (const item of data) {
        if (!isObject(item) || typeof item.date !== 'string' || typeof item.value !== 'number') {
            return;
        }
    }

    if (data.length === 0) {
        return [];
    }

    const yesterday = moment().add(-1, 'days').format(DATE_FORMATS.default);

    // NOTE: Пока что считаем, что отсчёт всегда с даты, которая пришла с парсинга.
    // Иначе бы пришлось экстраполировать в прошлое, что не очень-то корректно.
    buyDate = data[0].date;

    // NOTE: Если не указано, берём вчерашний день (потому что продажа ещё не совершена)
    if (typeof sellDate !== 'string' || sellDate === '') {
        sellDate = yesterday;
    }

    const daysDiff = moment(sellDate, DATE_FORMATS.default).diff(moment(buyDate, DATE_FORMATS.default), 'days') + 1;
    const dataNormalized = [];

    for (let i = 0; i < daysDiff; i++) {
        const date = moment(buyDate, DATE_FORMATS.default).add(i, 'days').format(DATE_FORMATS.default);
        const dataItem = data.filter(item => item.date === date)[0];

        let dataItemNormalizedByDate;

        if (dataItem !== undefined) {
            dataItemNormalizedByDate = deepClone(dataItem);
        } else {
            dataItemNormalizedByDate = {
                date,
                value: dataNormalized[i - 1].value,
            };
        }

        dataNormalized.push(dataItemNormalizedByDate);
    }

    return dataNormalized;
}
