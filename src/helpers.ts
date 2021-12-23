import moment from 'moment';
import {
    BANK_DEPOSIT_LABEL,
    EARNED_MONEY_LABEL,
    INDEX_FUND_LABEL,
    OWN_MONEY_LABEL,
    TOTAL_LABEL,
} from '@constants';
import type { TObject } from '@types';

export function dateFormat(dateUTC: number, format = 'YYYY.MM.DD'): string {
    if (String(dateUTC).length <= 10) {
        dateUTC *= 1000;
    }

    return moment.utc(dateUTC).format(format);
}

// TODO: Подумать насчёт того, чтобы сделать более осмысленный обработчик ошибок.
export function errorHandler(message = 'unknown'): void {
    console.log('Ошибка: ' + message);
}

// NOTE: Сериализация и десериализация — очень простой и понятный способ глубокого клонирования.
// У него есть свои минусы, но, пока что, в данном приложении, на них можно закрыть глаза.
// UPD: С сериализацией есть проблемы NaN/Infinity:
// https://stackoverflow.com/questions/21896792/force-json-stringify-to-emit-nan-infinity-or-js-json-lib-that-does-so
// TODO: tests
// eslint-disable-next-line @typescript-eslint/ban-types
export function deepClone<T extends object>(obj: T): T {
    return JSON.parse(JSON.stringify(obj, function (key, value) {
        if (value !== value) {
            return 'NaN';
        }
        return value;
    }), function (key, value) {
        if (value === 'NaN') {
            return NaN;
        }
        return value;
    });
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isObjectsEqual(object1: object, object2: object): boolean {
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

export function isArraysSimilar(array1: unknown[], array2: unknown[]): boolean {
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

            // eslint-disable-next-line @typescript-eslint/ban-types
            if (!isObjectsEqual(value1 as object, value2 as object)) {
                result = false;
                break;
            }
        }
    }

    return result;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function debounce(func: Function, wait = 200): () => void {
    let timeout: number | undefined;

    return function executedFunction(...rest) {
        const later = function() {
            timeout = undefined;
            func.apply(this, rest);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function isLabelCommon(label: string): boolean {
    const commonLabels = [
        TOTAL_LABEL.toLowerCase(),
        BANK_DEPOSIT_LABEL.toLowerCase(),
        OWN_MONEY_LABEL.toLowerCase(),
        INDEX_FUND_LABEL.toLowerCase(),
        EARNED_MONEY_LABEL.toLowerCase(),
    ];

    label = label.toLowerCase();

    return commonLabels.includes(label);
}

// See: https://stackoverflow.com/a/46663081/11902026
export function isObject(value: unknown): boolean {
    return value instanceof Object && value.constructor === Object;
}

export function isEmptyString(value: string): boolean {
    return value.trim() === '';
}

export function extendObject<T, S>(object1: T, object2: S): T {
    return Object.assign({}, object1, object2) as T;
}

// TODO: Перевести остальные toFixed на эту функцию
export function toFractionDigits(num: number | string, digitsCount = 4): number {
    if (typeof num !== 'number' || isNaN(num)) {
        return NaN;
    }

    const multiplier = Math.pow(10, digitsCount);

    return Math.round(num * multiplier) / multiplier;
}

// TODO: Добавить тесты
export function hasOwnProperty(object: TObject, property: string): boolean {
    return Object.prototype.hasOwnProperty.call(object, property);
}

// TODO: Добавить тесты
export function isNullNumber(value: unknown): boolean {
    return value !== undefined && isNaN(value as number) || value === null;
}
