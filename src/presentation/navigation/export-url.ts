import {EXPORT_HREF_PARAM_NAME, STORAGE_KEYS} from "@constants";
import {LocalStorage} from "@utils";

export function makeExportUrl(): string {
    const namesArray = [
        STORAGE_KEYS.portfolios,
        STORAGE_KEYS.calc,
    ];
    const encodedString = LocalStorage.export(namesArray);

    let urlToShare = window.location.href;
    const hash = window.location.hash;
    urlToShare = urlToShare.replace(hash, '');
    urlToShare += `#${EXPORT_HREF_PARAM_NAME}=${encodedString}`;

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(urlToShare);
    }

    return urlToShare;
}
