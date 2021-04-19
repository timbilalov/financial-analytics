import {isEmptyString, LocalStorage} from '@utils';
import {DEFAULT_LANGUAGE, LANGUAGES, LOCALES_TEXT_FALLBACK, STORAGE_KEYS} from "@constants";
import {LOCALES_RU} from "./locales-ru";
import {deepClone} from "@helpers";

export function locales(namespace: string): string {
    const messageFallback = LOCALES_TEXT_FALLBACK;

    if (isEmptyString(namespace)) {
        return messageFallback;
    }

    let lang = LocalStorage.get(STORAGE_KEYS.lang) as string;
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
            const part = namespaceSplit.shift() as string;
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
