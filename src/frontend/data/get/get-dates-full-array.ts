import type { TAssets, TDate } from '@types';
import { normalizeDatesArray } from './normalize-dates-array';

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

    return normalizeDatesArray(dates);
}
