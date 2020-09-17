import moment from "moment";

export function dateFormat(dateUTC, format = 'YYYY.MM.DD') {
    if (String(dateUTC).length <= 10) {
        dateUTC *= 1000;
    }

    return moment(dateUTC).format(format);
}
