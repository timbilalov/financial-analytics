import {fetchData} from "@fetch";
import {parseResponseData} from "@parse";
import {isObject} from "@helpers";
import {normalizeAssetData} from "./normalize-asset-data";

export async function getSingleAssetData(asset) {
    if (!isObject(asset)) {
        return;
    }

    const { ticker, title, buyDate, sellDate, moex, usd, bond, hide } = asset;
    const amount = parseInt(asset.amount);

    if (typeof(title || ticker) !== 'string' || typeof buyDate !== 'string' || typeof amount !== 'number') {
        return;
    }

    const isMoex = moex === true || moex === '1' || moex === 1;
    const isUsd = usd === true || usd === '1' || usd === 1;
    const isBond = bond === true || bond === '1' || bond === 1;
    const shouldHide = hide === true || hide === '1' || hide === 1;

    if (shouldHide) {
        return;
    }

    const dataRaw = await fetchData(ticker, buyDate, sellDate, isMoex, isBond);
    const dataParsed = parseResponseData(dataRaw, isMoex, isBond);
    const dataNormalized = normalizeAssetData(dataParsed, buyDate, sellDate);

    if (dataNormalized === undefined || dataNormalized.length === 0) {
        return;
    }

    const data = {
        title: title || ticker.toUpperCase(),
        data: dataParsed,
        amount: amount,
        isUsd: isUsd,
    };

    return data;
}

