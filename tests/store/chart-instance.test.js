import {chartInstanceStore, setChartInstance} from "@store";

describe('chart-instance store', function () {
    test('store should exist', function () {
        const state = chartInstanceStore.getState();

        expect(state).toMatchObject({});
    });

    describe('setChartInstance', function () {
        test('should return current state when pass wrong argument', function () {
            const prevState = chartInstanceStore.getState();

            setChartInstance();
            const newState = chartInstanceStore.getState();

            expect(newState).toEqual(prevState);
        });

        test('should set an object', function () {
            const newValue = {
                foo: 'bar',
            };

            setChartInstance(newValue);
            const newState = chartInstanceStore.getState();

            expect(newState).toEqual(newValue);
        });
    });
});
