import {locales} from "@presentation";
import {LOCALES_TEXT_FALLBACK} from "@constants";

describe('locales', function () {
    const textFallback = LOCALES_TEXT_FALLBACK;

    test('should return fallback text for wrong arguments', function () {
        const result1 = locales();
        const result2 = locales(123);
        const result3 = locales(['str']);
        const result4 = locales(null);
        const result5 = locales(function () { return 22; });
        const result6 = locales({ foo: 'bar' });

        expect(result1).toBe(textFallback);
        expect(result2).toBe(textFallback);
        expect(result3).toBe(textFallback);
        expect(result4).toBe(textFallback);
        expect(result5).toBe(textFallback);
        expect(result6).toBe(textFallback);
    });

    test('should return fallback text for missed texts', function () {
        const result = locales('foo.bar');

        expect(result).toBe(textFallback);
    });

    test('should return normal text for existing texts', function () {
        const result = locales('common.portfolio');

        expect(result).not.toBe(textFallback);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });
});
