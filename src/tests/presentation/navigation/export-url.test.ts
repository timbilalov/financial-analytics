import { makeExportUrl } from '@presentation';
import { EXPORT_HREF_PARAM_NAME } from '@constants';

describe('makeExportUrl', function () {
    test('properly exports', function () {
        const { href, hash } = window.location;

        Object.defineProperty(window, 'navigator', {
            value: {
                clipboard: {
                    writeText: () => true,
                },
            },
        });

        const url = makeExportUrl();

        expect(() => makeExportUrl()).not.toThrow();
        expect(typeof url).toEqual('string');
        expect(url.length).toBeGreaterThan(1);
        expect(url.indexOf(EXPORT_HREF_PARAM_NAME)).toEqual(href.length - hash.length + 1);
        expect(url.split('').filter(symbol => symbol === '=').length).toEqual(1);
    });
});
