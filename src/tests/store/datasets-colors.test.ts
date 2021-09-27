import { addDatasetColor, datasetsColorsStore, TColorsStoreItem } from '@store';

describe('datasets-colors store', function () {
    test('store should exist', function () {
        const state = datasetsColorsStore.getState();

        expect(state).toMatchObject({});
    });

    describe('addDatasetColor', function () {
        test('should add a single color object', function () {
            const newValue: TColorsStoreItem = {
                title: 'ticker',
                color: [251, 252, 253],
            };

            addDatasetColor(newValue);
            const newState = datasetsColorsStore.getState();

            expect(newState[newValue.title]).toEqual(newValue.color);
        });
    });
});
