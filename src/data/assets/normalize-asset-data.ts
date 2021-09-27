import moment from 'moment';
import { DATE_FORMATS } from '@constants';
import { deepClone } from '@helpers';
import type { TAssetData, TDate } from '@types';

export function normalizeAssetData(data: TAssetData, sellDate?: TDate): TAssetData {
    if (data.length === 0) {
        return [];
    }

    const yesterday = moment().add(-1, 'days').format(DATE_FORMATS.default);

    // NOTE: Пока что считаем, что отсчёт всегда с даты, которая пришла с парсинга.
    // Иначе бы пришлось экстраполировать в прошлое, что не очень-то корректно.
    const buyDate = data[0].date;

    // NOTE: Если не указано, берём вчерашний день (потому что продажа ещё не совершена)
    // if (typeof sellDate !== 'string' || sellDate === '') {
    if (!sellDate) {
        sellDate = yesterday;
    }

    const daysDiff = moment(sellDate, DATE_FORMATS.default).diff(moment(buyDate, DATE_FORMATS.default), 'days') + 1;
    const dataNormalized: TAssetData = [];

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
