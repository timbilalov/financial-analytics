import {calcStore, setCalcMethod, setCalcUses, setCurrency, setDatesFullArray} from "@store";
import {CALC_CURRENCIES, CALC_METHODS} from "@constants";

describe('calc store', function () {
    test('store should exist', function () {
        const state = calcStore.getState();

        expect(state).toMatchObject({
            method: CALC_METHODS.RELATIVE,
            currency: CALC_CURRENCIES.RUB,
            uses: {
                taxes: true,
            },
        });
    });

    describe('setCalcMethod', function () {
        test('should return current state when pass wrong argument', function () {
            const prevState = calcStore.getState();

            setCalcMethod();
            const newState = calcStore.getState();

            expect(newState).toEqual(prevState);
        });

        test('should set a single method', function () {
            const newValue = CALC_METHODS.ABSOLUTE_TOTAL;

            setCalcMethod(newValue);
            const newState = calcStore.getState();

            expect(newState.method).toEqual(newValue);
        });

        test('should not set an unknown method', function () {
            const newValue = 'new-value';

            setCalcMethod(newValue);
            const newState = calcStore.getState();

            expect(newState.method).not.toEqual(newValue);
        });
    });

    describe('setCurrency', function () {
        test('should return current state when pass wrong argument', function () {
            const prevState = calcStore.getState();

            setCurrency();
            const newState = calcStore.getState();

            expect(newState).toEqual(prevState);
        });

        test('should set a single currency', function () {
            const newValue = CALC_CURRENCIES.USD;

            setCurrency(newValue);
            const newState = calcStore.getState();

            expect(newState.currency).toEqual(newValue);
        });

        test('should not set an unknown currency', function () {
            const newValue = 'new-value';

            setCurrency(newValue);
            const newState = calcStore.getState();

            expect(newState.currency).not.toEqual(newValue);
        });
    });

    describe('setCalcUses', function () {
        test('should return current state when pass wrong argument', function () {
            const prevState = calcStore.getState();

            setCalcUses();
            const newState = calcStore.getState();

            expect(newState).toEqual(prevState);
        });

        test('should set uses object', function () {
            const newValue = {
                taxes: false,
            };

            setCalcUses(newValue);
            const newState = calcStore.getState();

            expect(newState.uses).toEqual(newValue);
        });

        test('should not set an unknown uses object', function () {
            const newValue = {
                foo: 'bar',
            };

            setCalcUses(newValue);
            const newState = calcStore.getState();

            expect(newState.uses).not.toEqual(newValue);
            expect(newState.uses.foo).toEqual(undefined);
        });
    });
});
