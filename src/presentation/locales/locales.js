import Storage from '@utils/storage';
import {DEFAULT_LANGUAGE, LANGUAGES, STORAGE_KEYS} from "@constants";
import {LOCALES_RU} from "./locales-ru";

export function locales(namespace) {
    const messageFallback = '...';

    if (namespace === undefined) {
        return messageFallback;
    }

    let lang = Storage.get(STORAGE_KEYS.lang);
    if (LANGUAGES[lang] === undefined) {
        lang = DEFAULT_LANGUAGE;
    }
    let localesObject;

    switch (lang) {
        default:
        case LANGUAGES.ru:
            localesObject = LOCALES_RU;
            break;
    }

    if (localesObject === undefined) {
        return messageFallback;
    }

    const namespaceSplit = namespace.split('.');

    let result = Object.assign({}, localesObject);
    let hasError = false;

    try {
        while (namespaceSplit.length !== 0) {
            const part = namespaceSplit.shift();
            result = result[part];
        }
    } catch (ignore) {
        hasError = true;
    }

    if (hasError || result === undefined) {
        return messageFallback;
    } else {
        return result;
    }
}
