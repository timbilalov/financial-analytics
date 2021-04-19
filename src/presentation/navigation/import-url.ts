import {EXPORT_HREF_PARAM_NAME} from "@constants";
import {LocalStorage} from "@utils";

export function checkImportUrl(): string | undefined {
    const hash = window.location.hash;
    let urlToReload = window.location.href;

    if (!hash) {
        return;
    }

    urlToReload = urlToReload.replace(hash, '');

    const encodedValues = hash.substring(EXPORT_HREF_PARAM_NAME.length + 2);
    const decodedValues = LocalStorage.import(encodedValues);

    if (decodedValues !== undefined) {
        window.location.href = urlToReload;
    }

    return urlToReload;
}
