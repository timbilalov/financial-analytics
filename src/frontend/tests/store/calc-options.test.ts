import { calcOptionsStore, resetCalcOptionsStore, setCalcMethod, setCalcUses, setCurrency } from '@store';
import { CALC_CURRENCIES, CALC_METHODS } from '@constants';

describe('calc options store', function () {
    beforeEach(function () {
        resetCalcOptionsStore();
    });

    test('store should exist', function () {
        const state = calcOptionsStore.getState();

        expect(state).toMatchObject({
            method: CALC_METHODS.ABSOLUTE_TOTAL,
            currency: CALC_CURRENCIES.RUB,
            uses: {
                taxes: true,
            },
        });
    });

    describe('setCalcMethod', function () {
        test('should set a single method', function () {
            const newValue = CALC_METHODS.ABSOLUTE;

            const currentState = calcOptionsStore.getState();
            setCalcMethod(newValue);
            const newState = calcOptionsStore.getState();

            expect(newState.method).toEqual(newValue);
            expect(newState).not.toBe(currentState);
        });

        test('should return current state for existing method', function () {
            const newValue = CALC_METHODS.ABSOLUTE_TOTAL;

            const currentState = calcOptionsStore.getState();
            setCalcMethod(newValue);
            const newState = calcOptionsStore.getState();

            expect(newState).toBe(currentState);
        });
    });

    describe('setCurrency', function () {
        test('should set a single currency', function () {
            const newValue = CALC_CURRENCIES.USD;

            const currentState = calcOptionsStore.getState();
            setCurrency(newValue);
            const newState = calcOptionsStore.getState();

            expect(newState.currency).toEqual(newValue);
            expect(newState).not.toBe(currentState);
        });

        test('should return current state for existing currency', function () {
            const newValue = CALC_CURRENCIES.RUB;

            const currentState = calcOptionsStore.getState();
            setCurrency(newValue);
            const newState = calcOptionsStore.getState();

            expect(newState).toBe(currentState);
        });
    });

    describe('setCalcUses', function () {
        test('should set uses object', function () {
            const newValue = {
                taxes: false,
            };

            const currentState = calcOptionsStore.getState();
            setCalcUses(newValue);
            const newState = calcOptionsStore.getState();

            expect(newState.uses).toEqual(newValue);
            expect(newState).not.toBe(currentState);
        });

        test('should return current state for existing uses object', function () {
            const newValue = {
                taxes: true,
            };

            const currentState = calcOptionsStore.getState();
            setCalcUses(newValue);
            const newState = calcOptionsStore.getState();

            expect(newState).toBe(currentState);
        });
    });
});
