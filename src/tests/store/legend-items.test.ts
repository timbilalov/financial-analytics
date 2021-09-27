import { addLegendItem, clearLegendItems, legendItemsStore } from '@store';

describe('legend-items store', function () {
    test('store should exist', function () {
        const state = legendItemsStore.getState();

        expect(Array.isArray(state)).toEqual(true);
    });

    describe('addLegendItem', function () {
        test('should add a single value', function () {
            const newValue = 'new-value';

            addLegendItem(newValue);
            const newState = legendItemsStore.getState();

            expect(newState.includes(newValue)).toEqual(true);
        });
    });

    describe('clearLegendItems', function () {
        test('should return an empty array', function () {
            clearLegendItems();
            const newState = legendItemsStore.getState();

            expect(newState).toEqual([]);
        });
    });
});
