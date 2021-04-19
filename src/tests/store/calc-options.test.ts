import {calcOptionsStore, setCalcMethod, setCalcUses, setCurrency, setDatesFullArray} from "@store";
import {CALC_CURRENCIES, CALC_METHODS} from "@constants";

describe('calc options store', function () {
    test('store should exist', function () {
        const state = calcOptionsStore.getState();

        expect(state).toMatchObject({
            method: CALC_METHODS.RELATIVE,
            currency: CALC_CURRENCIES.RUB,
            uses: {
                taxes: true,
            },
        });
    });

    describe('setCalcMethod', function () {
        test('should set a single method', function () {
            const newValue = CALC_METHODS.ABSOLUTE_TOTAL;

            setCalcMethod(newValue);
            const newState = calcOptionsStore.getState();

            expect(newState.method).toEqual(newValue);
        });
    });

    describe('setCurrency', function () {
        test('should set a single currency', function () {
            const newValue = CALC_CURRENCIES.USD;

            setCurrency(newValue);
            const newState = calcOptionsStore.getState();

            expect(newState.currency).toEqual(newValue);
        });
    });

    describe('setCalcUses', function () {
        test('should set uses object', function () {
            const newValue = {
                taxes: false,
            };

            setCalcUses(newValue);
            const newState = calcOptionsStore.getState();

            expect(newState.uses).toEqual(newValue);
        });
    });
});
