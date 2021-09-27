import { chartInstanceStore, setChartInstance } from '@store';
import type { TChartInstance } from '@types';
import { datasets } from '@test-constants';

describe('chart-instance store', function () {
    test('store should exist', function () {
        const state = chartInstanceStore.getState();

        expect(state).toMatchObject({});
    });

    describe('setChartInstance', function () {
        test('should set an object', function () {
            const newValue: TChartInstance = {
                // foo: 'bar',
                config: {
                    data: {
                        datasets,
                    },
                },
                update: () => {
                    // do nothing
                },
                destroy: () => {
                    // do nothing
                },
                labelCallback: () => {
                    // do nothing
                },
                legendClick: () => {
                    // do nothing
                },
            };

            setChartInstance(newValue);
            const newState = chartInstanceStore.getState();

            expect(newState).toEqual(newValue);
        });
    });
});
