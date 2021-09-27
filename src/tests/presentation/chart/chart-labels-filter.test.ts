import { labelsFilter } from '@presentation';
import { addLegendItem } from '@store';
import type { TLabelItem } from '@types';

describe('chart-labels-filter', function () {
    test('should return true, if label doesnt exists', function () {
        const item: TLabelItem = {
            text: 'tst',
        };
        const result = labelsFilter(item);

        expect(result).toBe(true)
    });

    test('should return false, if label exists', function () {
        const item: TLabelItem = {
            text: 'tst2',
        };
        addLegendItem(item.text);
        const result = labelsFilter(item);

        expect(result).toBe(false)
    });
});
