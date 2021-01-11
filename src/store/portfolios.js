import {createStore, createEvent} from 'effector';
import LocalStorage from "@utils/local-storage";
import {DEFAULT_PORTFOLIO_NAME, STORAGE_KEYS, SUMMARY_PORTFOLIO_NAME} from "@constants";
import {deepClone, isObjectsEqual} from "@helpers";

const defaultState = {
    current: DEFAULT_PORTFOLIO_NAME,
    list: [
        {
            name: DEFAULT_PORTFOLIO_NAME,
            assets: [],
        }
    ],
};
const initialState = Object.assign({}, defaultState, LocalStorage.get(STORAGE_KEYS.portfolios));

export const portfoliosStore = createStore(initialState);
export const addPortfolio = createEvent();
export const removePortfolio = createEvent();
export const setCurrentPortfolio = createEvent();
export const addNewAsset = createEvent();
export const removeAsset = createEvent();
export const setAssets = createEvent();

portfoliosStore.watch(function (state) {
    console.log('portfoliosStore changed', deepClone(state))
    LocalStorage.set(STORAGE_KEYS.portfolios, state);
});

portfoliosStore.on(addPortfolio, function (state, name) {
    if (typeof name !== 'string' || name.trim() === '' || state.list.filter(item => item.name === name).length !== 0 || name === SUMMARY_PORTFOLIO_NAME) {
        return state;
    }

    const newState = deepClone(state);
    const list = newState.list;
    const summary = list.filter(item => item.name === SUMMARY_PORTFOLIO_NAME)[0];

    list.push({
        name,
        assets: [],
    });

    if (summary === undefined) {
        list.push({
            name: SUMMARY_PORTFOLIO_NAME,
            assets: [],
        });
    } else {
        list.splice(list.indexOf(summary), 1);
        list.push(summary);
    }

    return newState;
});

portfoliosStore.on(removePortfolio, function (state, name) {
    if (typeof name !== 'string' || name.trim() === '' || state.list.filter(item => item.name === name).length === 0 || name === SUMMARY_PORTFOLIO_NAME) {
        return state;
    }

    const newState = deepClone(state);
    const list = newState.list;
    const summary = list.filter(item => item.name === SUMMARY_PORTFOLIO_NAME)[0];
    const portfolioToRemove = list.filter(item => item.name === name)[0];

    list.splice(list.indexOf(portfolioToRemove), 1);

    if (summary !== undefined) {
        if (list.length <= 2) {
            list.splice(list.indexOf(summary), 1);
        } else {
            summary.assets = list.filter(item => item.name !== SUMMARY_PORTFOLIO_NAME).map(item => item.assets).reduce((p, c) => p.concat(c));
        }
    }

    if (list.length === 0) {
        return deepClone(defaultState);
    }

    if (name === newState.current) {
        newState.current = list[0].name;
    }

    return newState;
});

portfoliosStore.on(setCurrentPortfolio, function (state, name) {
    if (typeof name !== 'string' || name.trim() === '' || state.list.filter(item => item.name === name).length === 0 || name === state.current) {
        return state;
    }

    const newState = deepClone(state);

    newState.current = name;

    return newState;
});

portfoliosStore.on(addNewAsset, function (state, newAsset) {
    if (newAsset === undefined) {
        return state;
    }

    const newState = deepClone(state);
    const currentPortfolio = newState.list.filter(item => item.name === state.current)[0];
    const currentAssets = currentPortfolio.assets;

    currentAssets.push(newAsset);

    return newState;
});

portfoliosStore.on(removeAsset, function (state, asset) {
    if (asset === undefined) {
        return state;
    }

    const newState = deepClone(state);
    const currentPortfolio = newState.list.filter(item => item.name === state.current)[0];
    const currentAssets = currentPortfolio.assets;

    let indexOf;

    for (let i = 0; i < currentAssets.length; i++) {
        if (isObjectsEqual(asset, currentAssets[i])) {
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

portfoliosStore.on(setAssets, function (state, assets) {
    if (Array.isArray(assets) === false) {
        return state;
    }

    const newState = deepClone(state);
    const currentPortfolio = newState.list.filter(item => item.name === state.current)[0];

    currentPortfolio.assets = deepClone(assets);

    return newState;
});
