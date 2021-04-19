import type {CALC_CURRENCIES, CALC_METHODS} from "@constants";

export type TCalcUses = {
    taxes: boolean,
}

export type TCalcOptions = {
    method: CALC_METHODS,
    currency: CALC_CURRENCIES,
    uses: TCalcUses,
};
