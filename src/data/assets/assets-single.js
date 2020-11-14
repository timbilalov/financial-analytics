import {fetchData} from "@fetch";
import {parseResponseData} from "@parse";

export async function getSingleAssetData(asset) {
    const { ticker, title, buyDate, sellDate, amount, moex, usd, bond, hide } = asset;

    const isMoex = moex === true || moex === '1';
    const isUsd = usd === true || usd === '1';
    const isBond = bond === true || bond === '1';
    const shouldHide = hide === true || hide === '1';

    if (shouldHide) {
        return;
    }

    const dataRaw = await fetchData(ticker, buyDate, sellDate, isMoex, isBond);
    const dataParsed = parseResponseData(dataRaw, isMoex, isBond);

    const data = {
        title: title || ticker.toUpperCase(),
        data: dataParsed,
        amount: amount,
        isUsd: isUsd,
    };

    console.log('ticker', ticker, buyDate, amount, data)

    if (dataParsed && dataParsed.length !== 0) {
        return data;
    }
}

