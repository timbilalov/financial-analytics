import {labelsFilter} from "@presentation";
import {addLegendItem} from "@store";

describe('chart-labels-filter', function () {
    test('should return undefined for wrong arguments', function () {
        const result1 = labelsFilter();
        const result2 = labelsFilter(100500);
        const result3 = labelsFilter('str');
        const result4 = labelsFilter(null);
        const result5 = labelsFilter(function () { return 2; });

        expect(result1).toBe(undefined);
        expect(result2).toBe(undefined);
        expect(result3).toBe(undefined);
        expect(result4).toBe(undefined);
        expect(result5).toBe(undefined);
    });

    test('should return true, if label doesnt exists', function () {
        const item = {
            text: 'tst',
        };
        const result = labelsFilter(item);

        expect(result).toBe(true)
    });

    test('should return false, if label exists', function () {
        const item = {
            text: 'tst2',
        };
        addLegendItem(item.text);
        const result = labelsFilter(item);

        expect(result).toBe(false)
    });
});
