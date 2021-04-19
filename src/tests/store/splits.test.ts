import {addNewSplit, removeSplit, resetSplitsStore, setSplits, splitsStore} from "@store";
import {deepClone, isObjectsEqual} from "@helpers";
import type {TSplitItem} from "@types";

describe('splits store', function () {
    const ticker = 'tst';
    const newSplitDataToSet: TSplitItem = {
        ticker,
        splitDate: '2020.01.01',
        amountBefore: 2,
        amountAfter: 3,
    };
    const newSplitDataToSet2: TSplitItem = {
        ticker,
        splitDate: '2020.02.01',
        amountBefore: 6,
        amountAfter: 5,
    };

    const splitDataToCheck = deepClone(newSplitDataToSet);
    delete splitDataToCheck.ticker;

    const splitDataToCheck2 = deepClone(newSplitDataToSet2);
    delete splitDataToCheck2.ticker;

    beforeEach(function () {
        resetSplitsStore();
    });

    test('store should exist', function () {
        const state = splitsStore.getState();

        expect(state).toMatchObject({});
    });

    describe('addNewSplit', function () {
        test('should add new split for new ticker', function () {
            const prevState = splitsStore.getState();
            const prevSplitData = prevState[ticker];

            addNewSplit(newSplitDataToSet);

            const newState = splitsStore.getState();
            const newSplitData = newState[ticker];

            expect(prevSplitData).toBe(undefined);
            expect(Array.isArray(newSplitData)).toBe(true);
            expect(newSplitData.length).toBe(1);
            expect(newSplitData.find(item => isObjectsEqual(item, splitDataToCheck))).not.toBe(undefined);
            expect(newState.length).toBe(1);
        });

        test('should not duplicate splits', function () {
            addNewSplit(newSplitDataToSet);

            const prevState = splitsStore.getState();
            const prevSplitData = prevState[ticker];

            addNewSplit(newSplitDataToSet);
            addNewSplit(newSplitDataToSet);
            addNewSplit(newSplitDataToSet);

            const newState = splitsStore.getState();
            const newSplitData = newState[ticker];

            expect(newSplitData).not.toBe(undefined);
            expect(newSplitData).toEqual(prevSplitData);
            expect(newState.length).toBe(1);
        });

        test('should add one more split to existing ticker', function () {
            addNewSplit(newSplitDataToSet);

            const prevState = splitsStore.getState();
            const prevSplitData = prevState[ticker];

            addNewSplit(newSplitDataToSet2);

            const newState = splitsStore.getState();
            const newSplitData = newState[ticker];

            expect(Array.isArray(prevSplitData)).toBe(true);
            expect(Array.isArray(newSplitData)).toBe(true);
            expect(prevSplitData.find(item => isObjectsEqual(item, splitDataToCheck2))).toBe(undefined);
            expect(newSplitData.find(item => isObjectsEqual(item, splitDataToCheck2))).not.toBe(undefined);
            expect(newSplitData.length).toBe(prevSplitData.length + 1);
            expect(newState.length).toBe(2);
        });
    });

    describe('removeSplit', function () {
        test('should remove existing split', function () {
            addNewSplit(newSplitDataToSet);
            addNewSplit(newSplitDataToSet2);

            const prevState = splitsStore.getState();
            const prevSplitData = prevState[ticker];

            removeSplit(newSplitDataToSet2);

            const newState = splitsStore.getState();
            const newSplitData = newState[ticker];

            expect(prevSplitData.find(item => isObjectsEqual(item, splitDataToCheck2))).not.toBe(undefined);
            expect(newSplitData.find(item => isObjectsEqual(item, splitDataToCheck2))).toBe(undefined);
            expect(newSplitData.length).toBe(prevSplitData.length - 1);
            expect(newState.length).toBe(1);
        });

        test('should do nothing when trying to remove missed split', function () {
            addNewSplit(newSplitDataToSet);

            const prevState = splitsStore.getState();
            const prevSplitData = prevState[ticker];

            removeSplit(newSplitDataToSet2);

            const newState = splitsStore.getState();
            const newSplitData = newState[ticker];

            expect(newSplitData.length).toBe(prevSplitData.length);
            expect(newSplitData).toEqual(prevSplitData);
            expect(newState.length).toBe(1);
        });

        test('should remove last split for ticker', function () {
            addNewSplit(newSplitDataToSet);

            const prevState = splitsStore.getState();
            const prevSplitData = prevState[ticker];

            removeSplit(newSplitDataToSet);

            const newState = splitsStore.getState();
            const newSplitData = newState[ticker];

            expect(newSplitData).not.toEqual(prevSplitData);
            expect(newSplitData).toBe(undefined);
            expect(newState.length).toBe(0);
        });
    });

    describe('setSplits', function () {
        test('should set a list of (edited) splits', function () {
            addNewSplit(newSplitDataToSet);
            addNewSplit(newSplitDataToSet2);

            const prevState = splitsStore.getState();

            const ticker2 = 'tst2';
            const splitsToSet: TSplitItem[] = [
                {
                    ticker: ticker,
                    splitDate: '2020.01.02',
                    amountBefore: 33,
                    amountAfter: 43,
                },
                {
                    ticker: ticker,
                    splitDate: '2020.01.03',
                    amountBefore: 35,
                    amountAfter: 45,
                },
                {
                    ticker: ticker,
                    splitDate: '2020.01.04',
                    amountBefore: 36,
                    amountAfter: 46,
                },
                {
                    ticker: ticker2,
                    splitDate: '2020.01.05',
                    amountBefore: 13,
                    amountAfter: 15,
                },
            ];

            setSplits(splitsToSet);

            const newState = splitsStore.getState();

            expect(newState).not.toEqual(prevState);
            expect(newState[ticker].length).toBe(3);
            expect(newState[ticker]).toEqual([
                {
                    splitDate: '2020.01.02',
                    amountBefore: 33,
                    amountAfter: 43,
                },
                {
                    splitDate: '2020.01.03',
                    amountBefore: 35,
                    amountAfter: 45,
                },
                {
                    splitDate: '2020.01.04',
                    amountBefore: 36,
                    amountAfter: 46,
                },
            ]);
            expect(newState[ticker2].length).toBe(1);
            expect(newState[ticker2]).toEqual([
                {
                    splitDate: '2020.01.05',
                    amountBefore: 13,
                    amountAfter: 15,
                },
            ]);

            expect(newState.length).toBe(4);
        });
    });
});
