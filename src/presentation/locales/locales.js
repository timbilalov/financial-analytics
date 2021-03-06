import LocalStorage from '@utils/local-storage';
import {DEFAULT_LANGUAGE, LANGUAGES, LOCALES_TEXT_FALLBACK, STORAGE_KEYS} from "@constants";
import {LOCALES_RU} from "./locales-ru";
import {deepClone} from "@helpers";

export function locales(namespace) {
    const messageFallback = LOCALES_TEXT_FALLBACK;

    if (typeof namespace !== 'string') {
        return messageFallback;
    }

    let lang = LocalStorage.get(STORAGE_KEYS.lang);
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

    const namespaceSplit = namespace.split('.');

    let result = deepClone(localesObject);
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
