import type { TAsset } from './assets';

export type TPortfolioItem = {
    name: string,
    assets: TAsset[],
}
export type TPortfoliosState = {
    current: string,
    list: TPortfolioItem[],
};
