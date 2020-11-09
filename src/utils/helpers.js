import moment from "moment";

export function dateFormat(dateUTC, format = 'YYYY.MM.DD') {
    if (String(dateUTC).length <= 10) {
        dateUTC *= 1000;
    }

    return moment(dateUTC).format(format);
}

// TODO: Подумать насчёт того, чтобы сделать более осмысленный обработчик ошибок.
export function errorHandler() {
    console.log("Ошибка HTTP: " + response.status);
}
