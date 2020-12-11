import moment from "moment";
import {BANK_DEPOSIT_LABEL, EXPORT_HREF_PARAM_NAME, OWN_MONEY_LABEL, STORAGE_KEYS, TOTAL_LABEL} from "@constants";
import LocalStorage from '@utils/local-storage';

export function dateFormat(dateUTC, format = 'YYYY.MM.DD') {
    if (String(dateUTC).length <= 10) {
        dateUTC *= 1000;
    }

    return moment(dateUTC).format(format);
}

// TODO: Подумать насчёт того, чтобы сделать более осмысленный обработчик ошибок.
export function errorHandler(message = 'unknown') {
    if (typeof message !== 'string') {
        message = message.toString();
    }

    console.log("Ошибка: " + message);
}

export async function makeExportUrl() {
    const namesArray = [
        STORAGE_KEYS.portfolios,
        STORAGE_KEYS.calc,
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

// NOTE: Сериализация и десериализация — очень простой и понятный способ глубокого клонирования. У него есть свои минусы, но, пока что, в данном приложении, на них можно закрыть глаза.
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function isObjectsEqual(object1, object2) {
    if (typeof object1 !== 'object' || typeof object2 !== 'object') {
        return object1 === object2;
    }

    let result = true;

    const object1KeysCount = Object.keys(object1).length;
    const object2KeysCount = Object.keys(object2).length;

    if (object1KeysCount !== object2KeysCount) {
        result = false;
    } else {
        for (const prop in object1) {
            if (object1[prop] !== object2[prop]) {
                if (typeof object1[prop] === 'object') {
                    result = isObjectsEqual(object1[prop], object2[prop]);
                } else {
                    result = false;
                }

                if (result === false) {
                    break;
                }
            }
        }
    }

    return result;
}

export function isArraysSimilar(array1, array2) {
    let result = true;

    const array1Length = array1.length;
    const array2Length = array2.length;

    if (array1Length !== array2Length) {
        result = false;
    } else {
        array1 = deepClone(array1);
        array2 = deepClone(array2);

        const sortFunc = function (a, b) {
            const stringA = JSON.stringify(a);
            const stringB = JSON.stringify(b);

            return stringA > stringB ? 1 : -1;
        };

        array1.sort(sortFunc);
        array2.sort(sortFunc);

        for (const index in array1) {
            const value1 = array1[index];
            const value2 = array2[index];

            if (isObjectsEqual(value1, value2) === false) {
                result = false;
                break;
            }
        }
    }

    return result;
}

export function debounce(func, wait = 200, immediate) {
    let timeout;

    return function executedFunction() {
        const context = this;
        const args = arguments;

        const later = function() {
            timeout = null;

            if (!immediate) {
                func.apply(context, args);
            }
        };

        const callNow = immediate && !timeout;

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);

        if (callNow) {
            func.apply(context, args);
        }
    };
}

export function isLabelCommon(label) {
    if (typeof label !== 'string') {
        return;
    }

    const commonLabels = [
        TOTAL_LABEL.toLowerCase(),
        BANK_DEPOSIT_LABEL.toLowerCase(),
        OWN_MONEY_LABEL.toLowerCase(),
    ];

    label = label.toLowerCase();

    return commonLabels.includes(label);
}
