import { BANK_DEPOSIT, CALC_CURRENCIES, CALC_METHODS, DATE_FORMATS } from '@constants';
import type { TAssetDataItem, TCalcOptions, TDatasets, TDatasetsData, TDate } from '@types';
import { getAssetsFromDatasets, getDatesFullArray, getIndexFundData, getUsdData } from '../get';
import { isNullNumber, toFractionDigits } from '@helpers';
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

type TOwnStepItem = TStepItem & {
    own: number,
    indexFund: number,
    usdValue: number,
    assetIsUsd: boolean,
};

type TFreeStepItem = TStepItem & {
    free: number,
    usdValue: number,
    assetIsUsd: boolean,
};

type TEarnedStepItem = TStepItem & {
    earned: number,
    usdValue: number,
    assetIsUsd: boolean,
};

type TAbsoluteTotalStepItem = TStepItem & {
    absoluteTotal: number,
};

type TOwnStepItems = TOwnStepItem[];
type TEarnedStepItems = TEarnedStepItem[];
type TFreeStepItems = TFreeStepItem[];
type TAbsoluteTotalStepItems = TAbsoluteTotalStepItem[];

// TODO: Здесь довольно много логики сейчас. Подумать, есть ли возможность как-то порефакторить и/или разделить на части.
export async function calcDatasetsData(datasets: TDatasets, calcOptions: TCalcOptions): Promise<TDatasetsData> {
    if (datasets.length === 0) {
        return [];
    }

    const datasetsSorted = datasets.sort((a, b) => {
        const buyDateA = a.asset.buyDate;
        const buyDateB = b.asset.buyDate;
        const sellDateA = a.asset.sellDate;
        const sellDateB = b.asset.sellDate;

        if (sellDateA !== undefined && sellDateB !== undefined) {
            return moment(sellDateA, DATE_FORMATS.default).diff(moment(sellDateB, DATE_FORMATS.default), 'days');
        }

        return moment(buyDateA, DATE_FORMATS.default).diff(moment(buyDateB, DATE_FORMATS.default), 'days');
    });

    const assets = getAssetsFromDatasets(datasetsSorted);
    const usdData = await getUsdData(assets);
    const datesFullArray = getDatesFullArray(assets);
    const { currency, method } = calcOptions;

    const indexFundData = await getIndexFundData(assets);
    const data: TDatasetsData = [];
    const savedValues: TSavedValueItem[] = [];

    const ownMoneySteps: TOwnStepItems = [];
    const absoluteTotalSteps: TAbsoluteTotalStepItems = [];
    const earnedMoneySteps: TEarnedStepItems = [];
    let freeMoneySteps: TFreeStepItems = [];

    // Helper
    const getCurrentFreeMoney = (iterationUsdValue) => freeMoneySteps.reduce((prev, step) => {
        const { assetIsUsd, free, usdValue } = step;
        let current = free;
        if (assetIsUsd && currency === CALC_CURRENCIES.RUB) {
            current *= iterationUsdValue / usdValue;
        } else if (!assetIsUsd && currency === CALC_CURRENCIES.USD) {
            current *= usdValue / iterationUsdValue;
        }
        return prev + current;
    }, 0);

    for (let i = 0; i < datesFullArray.length; i++) {
        const iterationDate = datesFullArray[i];
        const iterationUsdValue = usdData.filter(item => item.date === iterationDate)[0].value;
        const iterationIndexFundValue = (indexFundData.find(item => item.date === iterationDate) as TAssetDataItem).value;

        let iterationAbsolute = 0;
        let hasActiveAssets = false;

        for (let j = 0; j < datasetsSorted.length; j++) {
            const dataset = datasetsSorted[j];
            if (dataset.hidden) {
                continue;
            }

            const datasetIterationIndex = dataset.dates.indexOf(iterationDate);
            const datasetValue = dataset.data[datasetIterationIndex];
            const datasetValueNext = dataset.data[datasetIterationIndex + 1];
            const datasetValueAbsTotal = (dataset.dataAbsTotal || [])[datasetIterationIndex];
            const datasetIsUsd = dataset.asset.isUsd;

            if (!isNullNumber(datasetValue)) {
                hasActiveAssets = true;

                if (savedValues[j] === undefined) {
                    savedValues[j] = {
                        value: datasetValue,
                        usdValue: iterationUsdValue,
                    };

                    if (datasetValueAbsTotal !== undefined) {
                        savedValues[j].valueAbsTotal = datasetValueAbsTotal;
                    }
                }

                const datasetValueAbsTotalInital = savedValues[j].valueAbsTotal;

                if (savedValues[j].ownMoney === undefined && datasetValueAbsTotalInital !== undefined) {
                    const neededToBuy = datasetValueAbsTotalInital;
                    const currentFreeMoney = getCurrentFreeMoney(iterationUsdValue);
                    const ownMoneyNeededForBuy = Math.max(0, neededToBuy - currentFreeMoney);

                    savedValues[j].ownMoney = ownMoneyNeededForBuy;

                    if (ownMoneyNeededForBuy > 0) {
                        ownMoneySteps.push({
                            date: iterationDate,
                            own: ownMoneyNeededForBuy,
                            indexFund: iterationIndexFundValue,
                            usdValue: iterationUsdValue,
                            assetIsUsd: datasetIsUsd,
                        });
                    }

                    const currentFreeMoneyForAbsoluteTotal = freeMoneySteps.reduce((prev, step) => prev + step.free, 0);
                    const ownMoneyForAbsoluteTotal = Math.max(0, neededToBuy - currentFreeMoneyForAbsoluteTotal);
                    if (ownMoneyForAbsoluteTotal > 0) {
                        absoluteTotalSteps.push({
                            date: iterationDate,
                            absoluteTotal: ownMoneyForAbsoluteTotal,
                        });
                    }

                    // Update free money steps array.
                    if (currentFreeMoney > 0) {
                        let remaining = neededToBuy;
                        const freeMoneyStepsUpdatedAfterBuy: TFreeStepItems = [];
                        freeMoneySteps.forEach(step => {
                            if (remaining <= 0) {
                                freeMoneyStepsUpdatedAfterBuy.push(step);
                                return;
                            }

                            const { assetIsUsd, free, usdValue } = step;
                            let current = free;
                            if (assetIsUsd && currency === CALC_CURRENCIES.RUB) {
                                current *= iterationUsdValue / usdValue;
                            } else if (!assetIsUsd && currency === CALC_CURRENCIES.USD) {
                                current *= usdValue / iterationUsdValue;
                            }

                            if (remaining >= current) {
                                remaining -= current;
                            } else {
                                const diff = current - remaining;
                                freeMoneyStepsUpdatedAfterBuy.push({
                                    date: step.date,
                                    free: diff,
                                    usdValue: iterationUsdValue,
                                    assetIsUsd,
                                });
                                remaining = 0;
                            }
                        });

                        freeMoneySteps = freeMoneyStepsUpdatedAfterBuy;
                    }
                }

                if (savedValues[j].earned === undefined && datasetValueAbsTotal !== undefined && datasetValueAbsTotalInital !== undefined && isNullNumber(datasetValueNext)) {
                    freeMoneySteps.push({
                        date: iterationDate,
                        free: datasetValueAbsTotal,
                        usdValue: iterationUsdValue,
                        assetIsUsd: datasetIsUsd,
                    });
                    const earned = datasetValueAbsTotal - datasetValueAbsTotalInital;
                    savedValues[j].earned = earned;

                    earnedMoneySteps.push({
                        date: iterationDate,
                        earned,
                        usdValue: iterationUsdValue,
                        assetIsUsd: datasetIsUsd,
                    });
                }
            }

            if (savedValues[j] !== undefined) {
                const absTotal = savedValues[j].valueAbsTotal;
                if (absTotal !== undefined) {
                    const earned = savedValues[j].earned;
                    if (earned !== undefined) {
                        iterationAbsolute += earned;
                    } else {
                        const curValue = datasetValueAbsTotal;
                        iterationAbsolute += curValue - absTotal;
                    }
                }
            }
        }

        const iterationIndexFund = ownMoneySteps.reduce((prev, step) => {
            const coef = iterationIndexFundValue / step.indexFund;

            let current: number;
            switch (method) {
                case CALC_METHODS.ABSOLUTE:
                    current = step.own * (coef - 1);
                    break;

                case CALC_METHODS.ABSOLUTE_TOTAL:
                default:
                    current = step.own * coef;
                    break;
            }

            switch (currency) {
                case CALC_CURRENCIES.USD:
                    current *= step.usdValue / iterationUsdValue;
                    break;
            }

            return prev + current;
        }, 0);

        const iterationBankDeposit = ownMoneySteps.reduce((prev, step) => {
            const daysDiff = moment(iterationDate, DATE_FORMATS.default).diff(moment(step.date, DATE_FORMATS.default), 'days');
            const bankDepositIncrement = daysDiff / 365 * BANK_DEPOSIT;

            let current: number;
            switch (method) {
                case CALC_METHODS.ABSOLUTE:
                    current = step.own * bankDepositIncrement;
                    break;

                case CALC_METHODS.ABSOLUTE_TOTAL:
                default:
                    current = step.own * (1 + bankDepositIncrement);
                    break;
            }

            switch (currency) {
                case CALC_CURRENCIES.USD:
                    current *= step.usdValue / iterationUsdValue;
                    break;
            }

            return prev + current;
        }, 0);

        const iterationOwnMoney = ownMoneySteps.reduce((prev, step) => {
            let current: number;
            switch (currency) {
                case CALC_CURRENCIES.USD:
                    current = step.own * (step.usdValue / iterationUsdValue);
                    break;

                case CALC_CURRENCIES.RUB:
                default:
                    current = step.own;
                    break;
            }

            return prev + current;
        }, 0);

        const absoluteTotalSaved = absoluteTotalSteps.reduce((prev, step) => prev + step.absoluteTotal, 0);
        let iterationTotal: number;
        switch (method) {
            case CALC_METHODS.ABSOLUTE:
                iterationTotal = iterationAbsolute;
                break;

            case CALC_METHODS.ABSOLUTE_TOTAL:
            default:
                iterationTotal = absoluteTotalSaved + iterationAbsolute;
                break;
        }

        const iterationEarnedMoney = earnedMoneySteps.reduce((prev, step) => {
            const { assetIsUsd, earned, usdValue } = step;

            let current = earned;
            if (assetIsUsd && currency === CALC_CURRENCIES.RUB) {
                current *= iterationUsdValue / usdValue;
            } else if (!assetIsUsd && currency === CALC_CURRENCIES.USD) {
                current *= usdValue / iterationUsdValue;
            }

            return prev + current;
        }, 0);

        const iterationFreeMoney = getCurrentFreeMoney(iterationUsdValue);
        if (!hasActiveAssets && method === CALC_METHODS.ABSOLUTE_TOTAL) {
            iterationTotal = iterationFreeMoney;
        }

        data.push({
            date: iterationDate,
            values: {
                absolute: toFractionDigits(iterationAbsolute),
                free: toFractionDigits(iterationFreeMoney),
                own: toFractionDigits(iterationOwnMoney),
                earned: toFractionDigits(iterationEarnedMoney),
                bankDeposit: toFractionDigits(iterationBankDeposit),
                indexFund: toFractionDigits(iterationIndexFund),
                total: toFractionDigits(iterationTotal),
            },
        });
    }

    return data;
}
