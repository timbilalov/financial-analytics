import {
    addNewAsset,
    addPortfolio,
    portfoliosStore,
    removeAsset,
    removePortfolio, resetPortfoliosStore,
    setAssets,
    setCurrentPortfolio,
} from '@store';
import { DEFAULT_PORTFOLIO_NAME, SUMMARY_PORTFOLIO_NAME } from '@constants';
import { deepClone, isArraysSimilar, isObjectsEqual } from '@helpers';
import type { TAsset } from '@types';

describe('portfolios store', function () {
    const newPortfolioName = 'some-portfolio';
    const newPortfolioName2 = 'some-portfolio-2';
    const newPortfolioName3 = 'some-portfolio-3';
    const newAsset: TAsset = {
        ticker: 'bac',
        data: [
            {
                date: '2020.01.01',
                value: 100,
            },
        ],
        amount: 1,
        isUsd: true,
    };
    const newAsset2: TAsset = {
        ticker: 'bac2',
        data: [
            {
                date: '2020.01.01',
                value: 100,
            },
        ],
        amount: 11,
        isUsd: true,
    };
    const newAsset3: TAsset = {
        ticker: 't',
        data: [
            {
                date: '2020.01.01',
                value: 100,
            },
        ],
        amount: 2,
        isUsd: true,
    };
    const newAsset4: TAsset = {
        ticker: 'pfe',
        data: [
            {
                date: '2020.01.01',
                value: 100,
            },
        ],
        amount: 20,
        isUsd: true,
    };

    beforeEach(function () {
        resetPortfoliosStore();
    });

    test('store should exist', function () {
        const state = portfoliosStore.getState();

        expect(state.current).toEqual(DEFAULT_PORTFOLIO_NAME);
        expect(Array.isArray(state.list)).toEqual(true);
        expect(state.list.length).toEqual(1);
        expect(state.list[0].name).toEqual(state.current);
        expect(Array.isArray(state.list[0].assets)).toEqual(true);
        expect(state.list[0].assets.length).toEqual(0);
    });

    describe('addPortfolio', function () {
        test('should add single item', function () {
            addPortfolio(newPortfolioName);
            const state = portfoliosStore.getState();
            const newPortfolio = state.list.filter(item => item.name === newPortfolioName)[0];

            expect(state.list[0].name).toEqual(state.current);
            expect(state.list[1].name).toEqual(newPortfolioName);
            expect(newPortfolio).not.toBe(undefined);
            expect(newPortfolio.assets.length).toEqual(0);
        });

        test('should not add single item multiple times', function () {
            addPortfolio(newPortfolioName);
            addPortfolio(newPortfolioName);
            addPortfolio(newPortfolioName);

            const state = portfoliosStore.getState();

            expect(state.list.filter(item => item.name === newPortfolioName).length).toEqual(1);
        });

        test('should add summary', function () {
            addPortfolio(newPortfolioName);

            const state = portfoliosStore.getState();
            const list = state.list;
            const summary = list.filter(item => item.name === SUMMARY_PORTFOLIO_NAME)[0];

            expect(state.list.length).toEqual(3);
            expect(summary).not.toBe(undefined);
            expect(list[2].name).toBe(SUMMARY_PORTFOLIO_NAME);
        });
    });

    describe('removePortfolio', function () {
        test('should remove single item', function () {
            addPortfolio(newPortfolioName);
            const state = portfoliosStore.getState();
            const portfolio = state.list.filter(item => item.name === newPortfolioName)[0];

            removePortfolio(newPortfolioName);
            const newState = portfoliosStore.getState();
            const newPortfolio = newState.list.filter(item => item.name === newPortfolioName)[0];

            expect(portfolio).not.toEqual(undefined);
            expect(newPortfolio).toEqual(undefined);
        });

        test('should auto-remove summary', function () {
            addPortfolio(newPortfolioName);
            const state = portfoliosStore.getState();
            const list = state.list;
            const summary = list.filter(item => item.name === SUMMARY_PORTFOLIO_NAME)[0];

            removePortfolio(newPortfolioName);
            const newState = portfoliosStore.getState();
            const newList = newState.list;
            const newSummary = newList.filter(item => item.name === SUMMARY_PORTFOLIO_NAME)[0];

            expect(summary).not.toEqual(undefined);
            expect(newSummary).toEqual(undefined);
            expect(state.list.length).toEqual(3);
            expect(newState.list.length).toEqual(1);
        });

        test('should return default state when removed last portfolio', function () {
            addPortfolio(newPortfolioName);
            addPortfolio(newPortfolioName2);
            removePortfolio(newPortfolioName);
            removePortfolio(newPortfolioName2);

            const prevState = portfoliosStore.getState();
            removePortfolio(prevState.current);

            const newState = portfoliosStore.getState();

            expect(newState).toEqual(portfoliosStore.defaultState);
        });

        test('should set default portfolio when remove current', function () {
            addPortfolio(newPortfolioName);
            setCurrentPortfolio(newPortfolioName);
            removePortfolio(newPortfolioName);

            const newState = portfoliosStore.getState();

            expect(newState.current).toBe(DEFAULT_PORTFOLIO_NAME);
        });

        test('should set first remaining portfolio when remove default', function () {
            addPortfolio(newPortfolioName);
            removePortfolio(portfoliosStore.defaultState.current);

            const newState = portfoliosStore.getState();

            expect(newState.current).toBe(newPortfolioName);
        });

        test('should update summary', function () {
            addPortfolio(newPortfolioName);
            addPortfolio(newPortfolioName2);
            addPortfolio(newPortfolioName3);

            setCurrentPortfolio(newPortfolioName);
            addNewAsset(newAsset);
            addNewAsset(newAsset2);
            setCurrentPortfolio(newPortfolioName2);
            addNewAsset(newAsset3);
            setCurrentPortfolio(newPortfolioName3);
            addNewAsset(newAsset4);

            removePortfolio(newPortfolioName2);

            const newState = portfoliosStore.getState();
            const summary = newState.list.filter(item => item.name === SUMMARY_PORTFOLIO_NAME)[0];

            expect(summary).not.toBe(undefined);
            expect(summary.assets).toEqual([
                newAsset,
                newAsset2,
                newAsset4,
            ]);
        });
    });

    describe('setCurrentPortfolio', function () {
        test('should change current', function () {
            addPortfolio(newPortfolioName);
            const previousState = portfoliosStore.getState();
            const previousCurrent = previousState.current;

            setCurrentPortfolio(newPortfolioName);
            const newState = portfoliosStore.getState();
            const newCurrent = newState.current;

            expect(newCurrent).toEqual(newPortfolioName);
            expect(newCurrent).not.toEqual(previousCurrent);
        });

        test('should not change list', function () {
            addPortfolio(newPortfolioName2);
            const previousState = portfoliosStore.getState();
            const previousList = deepClone(previousState.list);

            setCurrentPortfolio(newPortfolioName2);
            const newState = portfoliosStore.getState();
            const newList = deepClone(newState.list);

            expect(isArraysSimilar(newList, previousList)).toEqual(true);
        });
    });

    describe('addNewAsset', function () {
        test('should add a single asset', function () {
            addNewAsset(newAsset);

            const state = portfoliosStore.getState();
            const list = state.list.filter(item => item.name === state.current)[0];
            const assets = list.assets;

            expect(assets.includes(newAsset)).toBe(true);
        });

        test('should not duplicate a single asset', function () {
            addNewAsset(newAsset);
            addNewAsset(newAsset);
            addNewAsset(newAsset);

            const state = portfoliosStore.getState();
            const list = state.list.filter(item => item.name === state.current)[0];
            const assets = list.assets;
            const assetsFiltered = assets.filter(item => item === newAsset);

            expect(assetsFiltered.length).toBe(1);
        });
    });

    describe('removeAsset', function () {
        test('should return current state when pass a missed asset', function () {
            const prevState = portfoliosStore.getState();
            const missedAsset: TAsset = {
                ticker: 'wrong ticker',
                data: [
                    {
                        date: '2022.01.01',
                        value: 50,
                    },
                ],
                amount: 2,
                isUsd: false,
            };

            removeAsset(missedAsset);
            const newState = portfoliosStore.getState();

            expect(newState).toBe(prevState);
        });

        test('should remove a single asset', function () {
            addNewAsset(newAsset);
            addNewAsset(newAsset2);
            removeAsset(newAsset);

            const state = portfoliosStore.getState();
            const list = state.list.filter(item => item.name === state.current)[0];
            const assets = list.assets;

            expect(assets.filter(item => isObjectsEqual(item, newAsset)).length).toBe(0);
            expect(assets.filter(item => isObjectsEqual(item, newAsset2)).length).toBe(1);
        });
    });

    describe('setAssets', function () {
        test('should set an array of assets', function () {
            const assetsToSet = [
                newAsset,
                newAsset2,
            ];

            setAssets(assetsToSet);

            const newState = portfoliosStore.getState();
            const assets = newState.list.filter(item => item.name === newState.current)[0].assets;

            expect(assets).toEqual(assetsToSet);
        });
    });
});
