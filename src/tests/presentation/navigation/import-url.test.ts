import {EXPORT_HREF_PARAM_NAME} from "@constants";
import {checkImportUrl} from '@presentation';

describe('checkImportUrl', function () {
    test('properly imports', function () {
        const urlToReload = checkImportUrl();

        const encodedString = 'N4IgZg9hIFwgRgQwE4gL5A'; // lz.compressToEncodedURIComponent(JSON.stringify({ foo: 'bar' }))
        const href = "http://dummy.com";
        const hash = `#${EXPORT_HREF_PARAM_NAME}=${encodedString}`;

        Object.defineProperty(window, 'location', {
            value: {
                href,
                hash,
            }
        });

        const urlToReload2 = checkImportUrl();

        expect(urlToReload).toBe(undefined);
        expect(urlToReload2).toBe(href);
    });

    // TODO: Добавить тест, проверяющий ворнинг при неправильной строке импорта.
});
