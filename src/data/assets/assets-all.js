import {getData} from "../get";

export async function getAssetsData(assets, force = false, currentAssetsToLink) {
    if (!force && (JSON.stringify(assets) === JSON.stringify(currentAssetsToLink))) { // TODO
        return;
    }

    const items = [];
    currentAssetsToLink = Array.from(assets);

    for (const { ticker, buyDate, sellDate, amount, moex, usd, hide } of assets) {
        const isMoex = moex === true || moex === '1';
        const isUsd = usd === true || usd === '1';
        const shouldHide = hide === true || hide === '1';

        if (shouldHide) {
            continue;
        }

        const data = await getData(ticker, buyDate, sellDate, amount, isMoex, isUsd);
        console.log('ticker', ticker, isUsd, buyDate, sellDate, amount, data)
        if (data) {
            items.push(data);
        }
    }

    return items;
}
