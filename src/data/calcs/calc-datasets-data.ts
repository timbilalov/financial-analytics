import { BANK_DEPOSIT, BANK_DEPOSIT_LABEL, CALC_CURRENCIES, CALC_METHODS, DATE_FORMATS, EARNED_MONEY_LABEL, FREE_MONEY_LABEL, INDEX_FUND_LABEL, OWN_MONEY_LABEL, TOTAL_LABEL } from '@constants';
import type { TAsset, TAssetCommon, TAssetDataItem, TCalcOptions, TDatasets, TDatasetsData, TDate } from '@types';
import { getAssetsFromDatasets, getDatesFullArray, getIndexFundData, getUsdData } from '../get';
import { errorHandler, isNullNumber, toFractionDigits } from '@helpers';
import moment from 'moment';

type TSavedValueItem = {
    value: number,
    valueAbsTotal?: number,
    usdValue: number,
    earned?: number,
    ownMoney?: number,
};

type TStepItem = {
    date: TDate,
}

type TOwnStepItem = {
    date: string;
    value: number;
};

type TSoldStepItem = {
    date: string;
    value: number;
};

type TEarnedStepItem = {
    date: string;
    value: number;
    currency: CALC_CURRENCIES;
};

type TFreeStepItem = {
    date: string;
    value: number;
    currency: CALC_CURRENCIES;
};

type TAbsoluteTotalStepItem = TStepItem & {
    absoluteTotal: number,
};

type TOwnStepItems = TOwnStepItem[];
type TSoldStepItems = TSoldStepItem[];
type TEarnedStepItems = TEarnedStepItem[];
type TFreeStepItems = TFreeStepItem[];
type TAbsoluteTotalStepItems = TAbsoluteTotalStepItem[];

const ERROR_MESSAGE = `Something wrong with 'calcDatasetsData' method`;

export async function calcDatasetsData(assets: TAsset[], calcOptions: TCalcOptions): Promise<TDatasetsData> {
    const assetsMap: TDatasetsData = new Map();

    if (assets.length === 0) {
        return assetsMap;
    }

    const assetsSorted = assets.sort((a, b) => {
        const buyDateA = a.buyDate;
        const buyDateB = b.buyDate;
        const sellDateA = a.sellDate;
        const sellDateB = b.sellDate;

        if (sellDateA !== undefined && sellDateB !== undefined) {
            return moment(sellDateA, DATE_FORMATS.default).diff(moment(sellDateB, DATE_FORMATS.default), 'days');
        }

        return moment(buyDateA, DATE_FORMATS.default).diff(moment(buyDateB, DATE_FORMATS.default), 'days');
    });

    const usdData = await getUsdData(assetsSorted);
    const datesFullArray = getDatesFullArray(assetsSorted);
    const indexFundData = await getIndexFundData(assetsSorted);

    const ownMoneySteps: TOwnStepItems = [];
    const soldMoneySteps: TSoldStepItems = [];
    const earnedMoneySteps: TEarnedStepItems = [];
    const freeMoneySteps: TFreeStepItems = [];

    const calculateCurrentFreeMoney = (usdValue: number) => {
        return freeMoneySteps.reduce((prev, step) => {
            const usdValueStep = usdData.find(item => item.date === step.date)?.values.current;

            if (!usdValueStep) {
                errorHandler(ERROR_MESSAGE);
                return prev;
            }

            const coef = usdValue / usdValueStep;

            let current = step.value;

            if (step.currency === CALC_CURRENCIES.RUB && calcOptions.currency === CALC_CURRENCIES.USD) {
                current /= coef;
            } else if (step.currency === CALC_CURRENCIES.USD && calcOptions.currency === CALC_CURRENCIES.RUB) {
                current *= coef;
            }

            return prev + current;
        }, 0);
    };

    const pushToAssetsMap = (asset: TAsset | string, value: number) => {
        const values = assetsMap.get(asset) ?? [];
        values.push(value);
        assetsMap.set(asset, values);
    };

    // For bonds.
    const accumulatedBondEarnedNkdMap: WeakMap<TAsset, number> = new Map();
    const accumulatedBondFreeMoneyMap: WeakMap<TAsset, number> = new Map();

    for (let i = 0; i < datesFullArray.length; ++i) {
        const date = datesFullArray[i];
        const hasNextDate = Boolean(datesFullArray[i + 1]);
        const indexFundValue = indexFundData.find(item => item.date === date)?.values.current;
        const usdValue = usdData.find(item => item.date === date)?.values.current;

        if (!usdValue || !indexFundValue) {
            errorHandler(ERROR_MESSAGE);
            continue;
        }

        let iterationFreeMoney = 0;
        let iterationOwnMoney = 0;
        let iterationEarnedMoney = 0;
        let iterationBankDeposit = 0;
        let iterationTotal = 0;
        let iterationIndexFund = 0;

        for (let j = 0; j < assetsSorted.length; ++j) {
            const asset = assetsSorted[j];
            const assetData = asset.data;

            if (assetData.length === 0) {
                continue;
            }

            const firstDataItem = assetData[0];
            const lastDataItem = assetData[assetData.length - 1];
            const hasStarted = moment(date, DATE_FORMATS.default).diff(moment(firstDataItem.date, DATE_FORMATS.default), 'days') >= 0;
            const hasFinished = moment(date, DATE_FORMATS.default).diff(moment(lastDataItem.date, DATE_FORMATS.default), 'days') > 0;

            if (!hasStarted || hasFinished) {
                pushToAssetsMap(asset, NaN);
                continue;
            }

            // Asset has been sold.
            if (lastDataItem.date === date && hasNextDate) {
                let earnedValue: number;
                let freeValue: number;
                let soldValue: number;

                if (asset.isBond) {
                    const lastBondNkd = lastDataItem.values.bond?.nominalNkd ?? 0;
                    const lastBondNominalValue = lastDataItem.values.bond?.nominalValue ?? 0;

                    earnedValue = lastBondNkd * asset.amount;
                    freeValue = (lastBondNkd + lastBondNominalValue) * asset.amount;
                    const assetData: number[] | undefined = assetsMap.get(asset);
                    soldValue = assetData?.[assetData.length - 1] ?? 0;
                } else {
                    const firstValue = firstDataItem.values.current * asset.amount;
                    const lastValue = lastDataItem.values.current * asset.amount;
                    const earned = lastValue - firstValue;

                    earnedValue = earned;
                    freeValue = lastValue;
                    soldValue = earned;
                }

                if (asset.isUsd && calcOptions.currency === CALC_CURRENCIES.RUB) {
                    freeValue *= usdValue;
                    earnedValue *= usdValue;
                    soldValue *= usdValue;
                } else if (!asset.isUsd && calcOptions.currency === CALC_CURRENCIES.USD) {
                    freeValue /= usdValue;
                    earnedValue /= usdValue;
                    soldValue /= usdValue;
                }

                earnedMoneySteps.push({
                    date,
                    value: earnedValue,
                    currency: asset.isUsd ? CALC_CURRENCIES.USD : CALC_CURRENCIES.RUB,
                });

                freeMoneySteps.push({
                    date,
                    value: freeValue,
                    currency: asset.isUsd ? CALC_CURRENCIES.USD : CALC_CURRENCIES.RUB,
                });

                soldMoneySteps.push({
                    date,
                    value: soldValue,
                });

                pushToAssetsMap(asset, NaN);
                continue;
            }

            const dataItem = assetData.find(item => item.date === date)!;

            let current = dataItem.values.current;
            let freeMoneyDecrement = 0;

            const prevDataItem = dataItem ?
                    assetData[assetData.indexOf(dataItem) - 1] ?? dataItem :
                    dataItem;

            // For bonds.
            if (dataItem.values.bond && prevDataItem.values.bond) {
                const currentBondNkd = dataItem.values.bond.currentNkd;

                const currentNominalValue = dataItem.values.bond.nominalValue;
                const prevNkd = prevDataItem.values.bond.currentNkd;
                const prevNominalValue = prevDataItem.values.bond.nominalValue;

                let accumulatedBondNkd = accumulatedBondEarnedNkdMap.get(asset) ?? 0;
                let accumulatedBondFreeMoney = accumulatedBondFreeMoneyMap.get(asset) ?? 0;

                if (currentBondNkd < prevNkd) {
                    let earnedBondNkd = prevDataItem.values.bond.nominalNkd;

                    accumulatedBondNkd += earnedBondNkd;

                    if (calcOptions.currency === CALC_CURRENCIES.USD) {
                        earnedBondNkd /= usdValue;
                    }

                    earnedMoneySteps.push({
                        date,
                        value: earnedBondNkd * asset.amount,
                        currency: CALC_CURRENCIES.RUB,
                    });

                    freeMoneySteps.push({
                        date,
                        value: earnedBondNkd * asset.amount,
                        currency: CALC_CURRENCIES.RUB,
                    });
                }

                if (currentNominalValue < prevNominalValue) {
                    let earnedBondFreeMoney = prevNominalValue - currentNominalValue;

                    accumulatedBondFreeMoney += earnedBondFreeMoney;

                    if (calcOptions.currency === CALC_CURRENCIES.USD) {
                        earnedBondFreeMoney /= usdValue;
                    }

                    freeMoneySteps.push({
                        date,
                        value: earnedBondFreeMoney * asset.amount,
                        currency: CALC_CURRENCIES.RUB,
                    });
                }

                accumulatedBondFreeMoney -= freeMoneyDecrement;
                current += currentBondNkd;

                if (calcOptions.method === CALC_METHODS.ABSOLUTE) {
                    current += accumulatedBondFreeMoney + accumulatedBondNkd;
                }

                accumulatedBondEarnedNkdMap.set(asset, accumulatedBondNkd);
                accumulatedBondFreeMoneyMap.set(asset, accumulatedBondFreeMoney);
            }

            // Apply amount.
            current *= asset.amount;

            // Apply currency.
            if (!asset.isUsd && calcOptions.currency === CALC_CURRENCIES.USD) {
                current /= usdValue;
            } else if (asset.isUsd && calcOptions.currency === CALC_CURRENCIES.RUB) {
                current *= usdValue;
            }

            // Asset has bought.
            if (firstDataItem.date === date) {
                const currentFreeMoney = calculateCurrentFreeMoney(usdValue);
                const cost = current;
                const ownMoneyNeeded = Math.max(0, cost - currentFreeMoney);

                freeMoneyDecrement = cost - ownMoneyNeeded;

                if (ownMoneyNeeded > 0) {
                    ownMoneySteps.push({
                        date,
                        value: ownMoneyNeeded,
                    });
                }

                if (freeMoneyDecrement > 0) {
                    if (freeMoneyDecrement >= currentFreeMoney) {
                        freeMoneySteps.splice(0, freeMoneySteps.length);
                    } else {
                        freeMoneySteps.push({
                            date,
                            value: -freeMoneyDecrement,
                            currency: asset.isUsd ? CALC_CURRENCIES.USD : CALC_CURRENCIES.RUB,
                        });
                    }
                }
            }


            switch (calcOptions.method) {
                case CALC_METHODS.ABSOLUTE:
                    let initialValue = firstDataItem.values.current;
                    const usdValueInitial = usdData.find(item => item.date === firstDataItem.date)?.values.current;

                    if (!usdValueInitial) {
                        errorHandler(ERROR_MESSAGE);
                        continue;
                    }

                    if (asset.isBond) {
                        initialValue += firstDataItem.values.bond?.currentNkd ?? 0;
                    }

                    // Apply currency.
                    if (!asset.isUsd && calcOptions.currency === CALC_CURRENCIES.USD) {
                        initialValue /= usdValueInitial;
                    } else if (asset.isUsd && calcOptions.currency === CALC_CURRENCIES.RUB) {
                        initialValue *= usdValueInitial;
                    }

                    initialValue *= asset.amount;
                    current -= initialValue;
            }

            iterationTotal += current;
            pushToAssetsMap(asset, toFractionDigits(current));
        }

        iterationEarnedMoney = earnedMoneySteps.reduce((prev, step) => {
            const usdValueStep = usdData.find(item => item.date === step.date)?.values.current;

            if (!usdValueStep) {
                errorHandler(ERROR_MESSAGE);
                return prev;
            }

            const coef = usdValue / usdValueStep;

            let current = step.value;

            if (step.currency === CALC_CURRENCIES.RUB && calcOptions.currency === CALC_CURRENCIES.USD) {
                current /= coef;
            } else if (step.currency === CALC_CURRENCIES.USD && calcOptions.currency === CALC_CURRENCIES.RUB) {
                current *= coef;
            }

            return prev + current;
        }, 0);

        iterationFreeMoney = calculateCurrentFreeMoney(usdValue);

        iterationIndexFund = ownMoneySteps.reduce((prev, step) => {
            const indexFundValueStep = indexFundData.find(item => item.date === step.date)?.values.current;
            const usdValueStep = usdData.find(item => item.date === step.date)?.values.current;

            if (!indexFundValueStep || !usdValueStep) {
                errorHandler(ERROR_MESSAGE);
                return prev;
            }

            let coef = indexFundValue / indexFundValueStep;
            let current: number;

            switch (calcOptions.currency) {
                case CALC_CURRENCIES.RUB:
                    coef *= usdValue / usdValueStep;
                    break;
            }

            switch (calcOptions.method) {
                case CALC_METHODS.ABSOLUTE:
                    current = step.value * (coef - 1);
                    break;

                case CALC_METHODS.ABSOLUTE_TOTAL:
                default:
                    current = step.value * coef;
                    break;
            }

            return prev + current;
        }, 0);

        if (calcOptions.method === CALC_METHODS.ABSOLUTE_TOTAL) {
            iterationTotal += iterationFreeMoney;
        }

        if (calcOptions.method === CALC_METHODS.ABSOLUTE) {
            const totalSold = soldMoneySteps.reduce((prev, cur) => prev + cur.value, 0);
            iterationTotal += totalSold;
        }

        iterationOwnMoney = ownMoneySteps.reduce((prev, step) => {
            const usdValueStep = usdData.find(item => item.date === step.date)?.values.current;

            if (!usdValueStep) {
                errorHandler(ERROR_MESSAGE);
                return prev;
            }

            let coef = 1;
            let current: number;

            switch (calcOptions.currency) {
                case CALC_CURRENCIES.USD:
                    coef /= usdValue / usdValueStep;
                    break;
            }

            current = step.value * coef;

            return prev + current;
        }, 0);

        iterationBankDeposit = ownMoneySteps.reduce((prev, step) => {
            const daysDiff = moment(date, DATE_FORMATS.default).diff(moment(step.date, DATE_FORMATS.default), 'days');
            const bankDepositIncrement = daysDiff / 365 * BANK_DEPOSIT;
            const usdValueStep = usdData.find(item => item.date === step.date)?.values.current;

            if (!usdValueStep) {
                errorHandler(ERROR_MESSAGE);
                return prev;
            }

            let current: number;
            switch (calcOptions.method) {
                case CALC_METHODS.ABSOLUTE:
                    current = step.value * bankDepositIncrement;
                    break;

                case CALC_METHODS.ABSOLUTE_TOTAL:
                default:
                    current = step.value * (1 + bankDepositIncrement);
                    break;
            }

            switch (calcOptions.currency) {
                case CALC_CURRENCIES.USD:
                    current /= usdValue / usdValueStep;
                    break;
            }

            return prev + current;
        }, 0);


        pushToAssetsMap(TOTAL_LABEL, toFractionDigits(iterationTotal));
        pushToAssetsMap(FREE_MONEY_LABEL, toFractionDigits(iterationFreeMoney));
        pushToAssetsMap(OWN_MONEY_LABEL, toFractionDigits(iterationOwnMoney));
        pushToAssetsMap(INDEX_FUND_LABEL, toFractionDigits(iterationIndexFund));
        pushToAssetsMap(BANK_DEPOSIT_LABEL, toFractionDigits(iterationBankDeposit));
        pushToAssetsMap(EARNED_MONEY_LABEL, toFractionDigits(iterationEarnedMoney));
    }

    return assetsMap;
}
