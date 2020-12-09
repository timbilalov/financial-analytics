import {createStore, createEvent} from 'effector';
import LocalStorage from "@utils/local-storage";
import {DEFAULT_PORTFOLIO_NAME, STORAGE_KEYS} from "@constants";
import {deepClone, isObjectsEqual} from "@helpers";

const portfolios = LocalStorage.get(STORAGE_KEYS.portfolios) || {};

if (portfolios.current === undefined) {
    portfolios.current = DEFAULT_PORTFOLIO_NAME;
}

if (portfolios.list === undefined) {
    portfolios.list = [
        {
            name: portfolios.current,
            assets: [],
        }
    ];
}

export const portfoliosStore = createStore(portfolios);
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
    if (typeof name !== 'string' || name.trim() === '' || state.list.filter(item => item.name === name).length !== 0) {
        return state;
    }

    const newState = deepClone(state);
    newState.list.push({
        name,
        assets: [],
    });

    return newState;
});

portfoliosStore.on(removePortfolio, function (state, name) {
    if (typeof name !== 'string' || name.trim() === '' || state.list.filter(item => item.name === name).length === 0) {
        return state;
    }

    const newState = deepClone(state);

    let indexToSplice;
    for (let i = 0; i < newState.list.length; i++) {
        if (newState.list[i].name === name) {
            indexToSplice = i;
            break;
        }
    }

    newState.list.splice(indexToSplice, 1);

    if (newState.list.length === 0) {
        newState.list.push({
            name: DEFAULT_PORTFOLIO_NAME,
            assets: [],
        })
    }

    if (name === newState.current) {
        newState.current = newState.list[0].name;
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
