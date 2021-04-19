import type {Store} from "effector";

export type TStoreOptions = {
    store: Store<unknown>,
    setStateFunction?: Function,
};

export type TAssetOptions = {
    ticker: string,
    isMoex?: boolean,
    isBond?: boolean,
};
