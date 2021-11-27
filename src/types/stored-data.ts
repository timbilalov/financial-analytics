import type { Store } from 'effector';

export type TStoreOptions = {
    store: Store<unknown>,
    // eslint-disable-next-line @typescript-eslint/ban-types
    setStateFunction?: Function,
};

export type TAssetOptions = {
    ticker: string,
    isMoex?: boolean,
    isBond?: boolean,
};
