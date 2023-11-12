import { isEmptyString } from '@helpers';
import type { TAsset, TAssetOptions, TAssetRaw, TStoreOptions } from '@types';
import { getStoredData } from '../get';
import { assetsDataStore, setAssetsData } from '@store';
import moment from 'moment';
import { DATE_FORMATS } from '@constants';

export async function getSingleAssetData(assetRaw: TAssetRaw): Promise<TAsset | undefined> {
    const { ticker, buyDate, moex, usd, bond, hide } = assetRaw;
    const amount = parseInt(assetRaw.amount as string);
    const title = assetRaw.title || assetRaw.ticker.toUpperCase();

    if (isEmptyString(title || ticker)) {
        return;
    }

    const isMoex = moex === true || moex === '1' || moex === 1;
    const isUsd = usd === true || usd === '1' || usd === 1;
    const isBond = bond === true || bond === '1' || bond === 1;
    const shouldHide = hide === true || hide === '1' || hide === 1;

    if (shouldHide) {
        return;
    }

    const yesterday = moment().add(-1, 'days').format(DATE_FORMATS.default);
    const sellDate = assetRaw.sellDate || yesterday;

    const dates = [buyDate, sellDate];
    const storeOptions: TStoreOptions = {
        store: assetsDataStore,
        setStateFunction: setAssetsData,
    };
    const assetOptions: TAssetOptions = {
        ticker,
        isMoex,
        isBond,
    };
    const data = await getStoredData(dates, storeOptions, assetOptions);

    return {
        ticker,
        title,
        data,
        amount,
        isUsd,
        buyDate,
        sellDate,
        isBond,
    };
}
