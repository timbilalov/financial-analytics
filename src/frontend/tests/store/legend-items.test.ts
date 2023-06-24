import { addLegendItem, clearLegendItems, legendItemsStore } from '@store';

describe('legend-items store', function () {
    beforeEach(function () {
        clearLegendItems();
    });

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

        test('should not add an existing value', function () {
            const state = legendItemsStore.getState();

            const newValue = 'new-value';
            addLegendItem(newValue);
            const newState1 = legendItemsStore.getState();

            addLegendItem(newValue);
            const newState2 = legendItemsStore.getState();

            expect(newState1).not.toBe(state);
            expect(newState2).toBe(newState1);
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
