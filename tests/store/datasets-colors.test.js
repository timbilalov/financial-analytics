import {addDatasetColor, addLegendItem, clearLegendItems, datasetsColorsStore} from "@store";

describe('datasets-colors store', function () {
    test('store should exist', function () {
        const state = datasetsColorsStore.getState();

        expect(state).toMatchObject({});
    });

    describe('addDatasetColor', function () {
        test('should return current state when pass wrong argument', function () {
            const prevState = datasetsColorsStore.getState();

            addDatasetColor();
            const newState = datasetsColorsStore.getState();

            expect(newState).toEqual(prevState);
        });

        test('should add a single color object', function () {
            const newValue = {
                title: 'ticker',
                color: [251, 252, 253],
            };

            addDatasetColor(newValue);
            const newState = datasetsColorsStore.getState();

            expect(newState[newValue.title]).toEqual(newValue.color);
        });

        test('should not add a single color object, if some props missed', function () {
            const newValue = {
                foo: 'bar',
            };

            addDatasetColor(newValue);
            const newState = datasetsColorsStore.getState();

            expect(newState.foo).toEqual(undefined);
            expect(Object.values(newState).includes('bar')).toEqual(false);
        });
    });
});
