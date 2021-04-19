export type TDate = string; // TODO: Добавить type guard, или ещё как-либо проверять строку на соответствие.

export type TColorRBG = [number, number, number];

export type TBooleanByInput = boolean | string | number;

// TODO: Возможно, есть более лаконичное решение.
export type TObject = {
    [key: string]: unknown,
};
