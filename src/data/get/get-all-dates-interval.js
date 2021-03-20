import moment from "moment";
import {DATE_FORMATS, STORAGE_KEYS} from "@constants";
import LocalStorage from "@utils/local-storage";

export function getAllDatesInterval(items) {
    if (!Array.isArray(items)) {
        return;
    }

    const dates1 = [];

    for (const {data} of items) {
        const dates = data.map(item => item.date);

        for (const date of dates) {
            if (!dates1.includes(date)) {
                dates1.push(date);
            }
        }
    }

    dates1.sort();

    const firstDate = moment(dates1[0], DATE_FORMATS.default);
    const lastDate = moment(dates1[dates1.length - 1], DATE_FORMATS.default);
    const diff = lastDate.diff(firstDate, 'days');
    const dates2 = [];

    dates2.push(dates1[0]);

    for (let i = 0; i < diff; i++) {
        const date = firstDate.add(1, 'days').format(DATE_FORMATS.default);
        dates2.push(date);
    }

    return dates2;
}
