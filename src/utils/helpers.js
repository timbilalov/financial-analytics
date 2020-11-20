import moment from "moment";
import {EXPORT_HREF_PARAM_NAME, STORAGE_KEYS} from "@constants";
import LocalStorage from '@utils/local-storage';

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

export async function makeExportUrl() {
    const namesArray = [
        STORAGE_KEYS.portfoliosData,
        STORAGE_KEYS.portfolioList,
        STORAGE_KEYS.portfolio,
        STORAGE_KEYS.calcMethod,
        STORAGE_KEYS.calcCurrency,
    ];
    const encodedString = LocalStorage.export(namesArray);

    let urlToShare = window.location.href;
    const hash = window.location.hash;
    urlToShare = urlToShare.replace(hash, '');
    urlToShare += `#${EXPORT_HREF_PARAM_NAME}=${encodedString}`;

    const promise = new Promise(resolve => {
        navigator.clipboard.writeText(urlToShare).then(function() {
            resolve();
        });
    });

    await promise;

    return urlToShare;
}

export function checkImportUrl() {
    const hash = window.location.hash;

    if (!hash) {
        return;
    }

    let urlToReload = window.location.href;
    urlToReload = urlToReload.replace(hash, '');

    const encodedValues = hash.substring(EXPORT_HREF_PARAM_NAME.length + 2);
    const decodedValues = LocalStorage.import(encodedValues);

    if (decodedValues) {
        window.location.href = urlToReload;
    }
}
