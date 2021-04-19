import {createStore, createEvent} from 'effector';
import {isEmptyString, LocalStorage} from "@utils";
import {DEFAULT_PORTFOLIO_NAME, STORAGE_KEYS, SUMMARY_PORTFOLIO_NAME} from "@constants";
import {deepClone, isObjectsEqual} from "@helpers";
import type {TAsset, TPortfolioItem, TPortfoliosState} from "@types";

const defaultState: TPortfoliosState = {
    current: DEFAULT_PORTFOLIO_NAME,
    list: [
        {
            name: DEFAULT_PORTFOLIO_NAME,
            assets: [],
        }
    ],
};
const initialState = Object.assign({}, defaultState, LocalStorage.get(STORAGE_KEYS.portfolios));

if (initialState.list.length > 1) {
    initialState.list = initialState.list.filter(item => item.name !== SUMMARY_PORTFOLIO_NAME);
    const allAssets = initialState.list.map(item => item.assets).reduce((prev, current) => prev.concat(current));
    initialState.list.push({
        name: SUMMARY_PORTFOLIO_NAME,
        assets: allAssets,
    });
}

export const portfoliosStore = createStore(initialState);
export const resetPortfoliosStore = createEvent();
export const addPortfolio = createEvent<string>();
export const removePortfolio = createEvent<string>();
export const setCurrentPortfolio = createEvent<string>();
export const addNewAsset = createEvent<TAsset>();
export const removeAsset = createEvent<TAsset>();
export const setAssets = createEvent<TAsset[]>();

portfoliosStore.watch((state) => {
    console.log('portfoliosStore changed', deepClone(state))
    LocalStorage.set(STORAGE_KEYS.portfolios, state);
});

portfoliosStore.reset(resetPortfoliosStore);

portfoliosStore.on(addPortfolio, (state: TPortfoliosState, payload: string) => {
    if (isEmptyString(payload) || state.list.find(item => item.name === payload) !== undefined || payload === SUMMARY_PORTFOLIO_NAME) {
        return state;
    }

    const newState = deepClone(state);
    const list = newState.list;
    const summary = list.find(item => item.name === SUMMARY_PORTFOLIO_NAME);

    list.push({
        name: payload,
        assets: [],
    });

    if (summary === undefined) {
        const allAssets = list.map(item => item.assets).reduce((prev, current) => prev.concat(current));

        list.push({
            name: SUMMARY_PORTFOLIO_NAME,
            assets: allAssets,
        });
    } else {
        list.splice(list.indexOf(summary), 1);
        list.push(summary);
    }

    return newState;
});

portfoliosStore.on(removePortfolio, (state: TPortfoliosState, payload: string) => {
    if (isEmptyString(payload) || state.list.find(item => item.name === payload) === undefined || payload === SUMMARY_PORTFOLIO_NAME) {
        return state;
    }

    const newState = deepClone(state);
    const list = newState.list;
    const summary = list.find(item => item.name === SUMMARY_PORTFOLIO_NAME);
    const portfolioToRemove = list.find(item => item.name === payload) as TPortfolioItem;

    list.splice(list.indexOf(portfolioToRemove), 1);

    if (summary !== undefined) {
        if (list.length <= 2) {
            list.splice(list.indexOf(summary), 1);
        } else {
            summary.assets = list.filter(item => item.name !== SUMMARY_PORTFOLIO_NAME).map(item => item.assets).reduce((prev, current) => prev.concat(current));
        }
    }

    if (list.length === 0) {
        return deepClone(defaultState);
    }

    if (payload === newState.current) {
        newState.current = list[0].name;
    }

    return newState;
});

portfoliosStore.on(setCurrentPortfolio, (state: TPortfoliosState, payload: string) => {
    if (isEmptyString(payload) || state.list.find(item => item.name === payload) === undefined || payload === state.current) {
        return state;
    }

    const newState = deepClone(state);

    newState.current = payload;

    return newState;
});

portfoliosStore.on(addNewAsset, (state: TPortfoliosState, payload: TAsset) => {
    const newState = deepClone(state);
    const currentPortfolio = newState.list.filter(item => item.name === state.current)[0];
    const currentAssets = currentPortfolio.assets;

    currentAssets.push(payload);

    return newState;
});

portfoliosStore.on(removeAsset, (state: TPortfoliosState, payload: TAsset) => {
    const newState = deepClone(state);
    const currentPortfolio = newState.list.filter(item => item.name === state.current)[0];
    const currentAssets = currentPortfolio.assets;

    let indexOf;

    for (let i = 0; i < currentAssets.length; i++) {
        if (isObjectsEqual(payload, currentAssets[i])) {
            indexOf = i;
            break;
        }
    }

    if (indexOf === undefined) {
        return state;
    }

    currentAssets.splice(indexOf, 1);

    return newState;
});

portfoliosStore.on(setAssets, (state: TPortfoliosState, assets: TAsset[]) => {
    const newState = deepClone(state);
    const currentPortfolio = newState.list.find(item => item.name === state.current) as TPortfolioItem;

    currentPortfolio.assets = deepClone(assets);

    return newState;
});
