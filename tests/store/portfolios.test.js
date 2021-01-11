import {
    addNewAsset,
    addPortfolio,
    portfoliosStore,
    removeAsset,
    removePortfolio,
    setAssets,
    setCurrentPortfolio
} from "@store";
import {DEFAULT_PORTFOLIO_NAME, SUMMARY_PORTFOLIO_NAME} from "@constants";
import {deepClone, isArraysSimilar, isObjectsEqual} from "@helpers";

describe('portfolios store', function () {
    const newPortfolioName = 'some-portfolio';
    const newPortfolioName2 = 'some-portfolio-2';
    const newPortfolioName3 = 'some-portfolio-3';
    const newAsset = {
        ticker: 'bac',
        buyDate: '2020.01.01',
        amount: 1,
        isUsd: 1,
    };
    const newAsset2 = {
        ticker: 'bac',
        buyDate: '2020.02.01',
        amount: 10,
        isUsd: 1,
    };
    const newAsset3 = {
        ticker: 't',
        buyDate: '2020.02.05',
        amount: 2,
        isUsd: 1,
    };
    const newAsset4 = {
        ticker: 'pfe',
        buyDate: '2020.03.03',
        amount: 20,
        isUsd: 1,
    };

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
            const state = portfoliosStore.getState();
            const list = state.list;
            const summary = list.filter(item => item.name === SUMMARY_PORTFOLIO_NAME)[0];

            expect(state.list.length).toEqual(3);
            expect(summary).not.toBe(undefined);
            expect(list[2].name).toBe(SUMMARY_PORTFOLIO_NAME);
        });
    });

    describe('removePortfolio', function () {
        test('should return current state when pass wrong value', function () {
            const prevState = portfoliosStore.getState();

            removePortfolio();
            const newState = portfoliosStore.getState();

            removePortfolio('some-wrong-portfolio');
            const newState2 = portfoliosStore.getState();

            expect(newState).toEqual(prevState);
            expect(newState2).toEqual(prevState);
        });

        test('should remove single item', function () {
            removePortfolio(newPortfolioName);
            const state = portfoliosStore.getState();
            const newPortfolio = state.list.filter(item => item.name === newPortfolioName)[0];

            expect(newPortfolio).toEqual(undefined);
        });

        test('should auto-remove summary', function () {
            const state = portfoliosStore.getState();
            const list = state.list;
            const summary = list.filter(item => item.name === SUMMARY_PORTFOLIO_NAME)[0];

            expect(summary).toEqual(undefined);
            expect(state.list.length).toEqual(1);
        });

        test('should return default state when removed last portfolio', function () {
            const prevState = portfoliosStore.getState();
            removePortfolio(prevState.current);

            const newState = portfoliosStore.getState();

            expect(newState.current).toBe(DEFAULT_PORTFOLIO_NAME);
            expect(newState.list.length).toEqual(1);
            expect(newState.list[0].name).toBe(DEFAULT_PORTFOLIO_NAME);
            expect(newState.list[0].assets.length).toEqual(0);
        });

        test('should set first portfolio when remove current', function () {
            addPortfolio(newPortfolioName);
            setCurrentPortfolio(newPortfolioName);
            removePortfolio(newPortfolioName);

            const newState = portfoliosStore.getState();

            expect(newState.current).toBe(DEFAULT_PORTFOLIO_NAME);
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

            expect(summary.assets).toMatchObject([
                newAsset,
                newAsset2,
                newAsset4,
            ]);
        });
    });

    describe('setCurrentPortfolio', function () {
        test('should return current state when pass wrong argument', function () {
            const prevState = portfoliosStore.getState();

            setCurrentPortfolio();
            const newState = portfoliosStore.getState();

            expect(newState).toEqual(prevState);
        });

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
        test('should return current state when pass wrong argument', function () {
            const prevState = portfoliosStore.getState();

            addNewAsset();
            const newState = portfoliosStore.getState();

            expect(newState).toEqual(prevState);
        });

        test('should add a single asset', function () {
            addNewAsset(newAsset);

            const state = portfoliosStore.getState();
            const list = state.list.filter(item => item.name === state.current)[0];
            const assets = list.assets;

            expect(assets.indexOf(newAsset)).not.toBe(-1);
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
        test('should return current state when pass an undefined argument', function () {
            const prevState = portfoliosStore.getState();

            removeAsset();
            const newState = portfoliosStore.getState();

            expect(newState).toEqual(prevState);
        });

        test('should return current state when pass a missed asset', function () {
            const prevState = portfoliosStore.getState();
            const missedAsset = {
                ticker: 'wrong ticker',
                buyDate: '2010.01.01',
                amount: 2,
            };

            removeAsset(missedAsset);
            const newState = portfoliosStore.getState();

            expect(newState).toEqual(prevState);
        });

        test('should remove a single asset', function () {
            addNewAsset(newAsset);
            addNewAsset(newAsset2);
            removeAsset(newAsset);

            const state = portfoliosStore.getState();
            const list = state.list.filter(item => item.name === state.current)[0];
            const assets = list.assets;

            expect(assets.indexOf(newAsset)).toBe(-1);
            expect(assets.filter(item => isObjectsEqual(item, newAsset2)).length).toBe(1);
        });
    });

    describe('setAssets', function () {
        test('should return current state when pass an undefined argument', function () {
            const prevState = portfoliosStore.getState();

            setAssets();
            const newState = portfoliosStore.getState();

            expect(newState).toEqual(prevState);
        });

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
