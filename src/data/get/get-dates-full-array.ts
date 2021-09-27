import moment from 'moment';
import { DATE_FORMATS } from '@constants';
import type { TAssets, TDate } from '@types';

export function getDatesFullArray(assets: TAssets): TDate[] {
    const dates: TDate[] = [];

    for (const { data } of assets) {
        const assetDates = data.map(item => item.date);

        for (const date of assetDates) {
            if (!dates.includes(date)) {
                dates.push(date);
            }
        }
    }

    dates.sort();

    const firstDate = moment(dates[0], DATE_FORMATS.default);
    const lastDate = moment(dates[dates.length - 1], DATE_FORMATS.default);
    const diff = lastDate.diff(firstDate, 'days');
    const datesFullArray: TDate[] = [];

    datesFullArray.push(dates[0]);

    for (let i = 0; i < diff; i++) {
        const date = firstDate.add(1, 'days').format(DATE_FORMATS.default);
        datesFullArray.push(date);
    }

    return datesFullArray;
}
