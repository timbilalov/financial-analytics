import moment from 'moment';
import { DATE_FORMATS } from '@constants';
import { deepClone } from '@helpers';
import type { TAssetData, TAssetDataItem, TAssetOptions, TDate } from '@types';

export function normalizeAssetData(data: TAssetData, dateTo?: TDate, dateFrom?: TDate, assetOptions?: TAssetOptions): TAssetData {
    if (data.length === 0) {
        return [];
    }

    const format = DATE_FORMATS.default;
    const unitOfTime = 'days';
    const yesterday = moment().add(-1, unitOfTime).format(format);

    // NOTE: Пока что считаем, что отсчёт всегда с даты, которая пришла с парсинга.
    // Иначе бы пришлось экстраполировать в прошлое, что не очень-то корректно.
    if (!dateFrom) {
        dateFrom = data[0].date;
    }

    // NOTE: Если не указано, берём вчерашний день (потому что продажа ещё не совершена)
    if (!dateTo) {
        dateTo = yesterday;
    }

    const firstDate = moment(dateFrom, format);
    const lastDate = moment(dateTo, format);
    const lastDataAvailableItem = data[data.length - 1];
    const lastDataAvailableDate = moment(lastDataAvailableItem.date, format);
    const daysDiff = lastDate.diff(firstDate, unitOfTime) + 1;
    const dataNormalized: TAssetData = [];

    // TODO: tests
    for (let i = 0; i < daysDiff; i++) {
        const date = moment(firstDate).add(i, unitOfTime);
        const dateFormatted = date.format(format);
        const dataItem = data.filter(item => item.date === dateFormatted)[0];

        // Weekend, days without any data.
        if (dataItem === undefined && i === 0) {
            continue;
        }

        let dataItemNormalizedByDate: TAssetDataItem;

        const isFinishedBond = assetOptions?.isBond && date.diff(lastDataAvailableDate, unitOfTime) === 0;

        if (isFinishedBond) {
            break;
        }

        if (dataItem !== undefined) {
            dataItemNormalizedByDate = deepClone(dataItem);
        } else {
            const prev = dataNormalized[dataNormalized.length - 1];

            if (prev === undefined) {
                continue;
            } else {
                dataItemNormalizedByDate = {
                    ...prev,
                    date: dateFormatted,
                };
            }
        }

        dataNormalized.push(dataItemNormalizedByDate);
    }

    return dataNormalized;
}
