import type { TDate } from '@types';
import moment from 'moment';
import { DATE_FORMATS } from '@constants';

// TODO: tests
export function normalizeDatesArray(dates: TDate[] = []): TDate[] {
    const datesNormalized: TDate[] = [];

    const format = DATE_FORMATS.default;
    const unitOfTime = 'days';
    const firstDate = moment(dates[0], format);
    const lastDate = moment(dates[dates.length - 1], format);
    const diff = lastDate.diff(firstDate, unitOfTime);

    datesNormalized.push(dates[0]);
    for (let i = 0; i < diff; i++) {
        const date = firstDate.add(1, unitOfTime).format(format);
        datesNormalized.push(date);
    }

    return datesNormalized;
}
