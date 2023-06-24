import { locales } from '@presentation';
import { LOCALES_TEXT_FALLBACK } from '@constants';

describe('locales', function () {
    const textFallback = LOCALES_TEXT_FALLBACK;

    test('should return fallback text for missed texts or empty namespace', function () {
        const result1 = locales('foo.bar');
        const result2 = locales('');

        expect(result1).toBe(textFallback);
        expect(result2).toBe(textFallback);
    });

    test('should return normal text for existing texts', function () {
        const result = locales('common.portfolio');

        expect(result).not.toBe(textFallback);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });
});
