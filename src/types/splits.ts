import type {TDate} from "./common";

export type TSplitItem = {
    ticker?: string,
    splitDate: TDate,
    amountBefore: number,
    amountAfter: number,
};

export type TSplits = {
    [key: string]: TSplitItem[],
};
