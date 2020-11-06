import {getData} from "../get";

export async function getAssetsData(assets, force = false, currentAssetsToLink) {
    // TEMP: Пока что работает не так, как надо. В дальнейшем — доработать.
    // if (!force && (JSON.stringify(assets) === JSON.stringify(currentAssetsToLink))) { // TODO
    //     return;
    // }

    const items = [];
    currentAssetsToLink = Array.from(assets);

    for (const { ticker, buyDate, sellDate, amount, moex, usd, bond, hide } of assets) {
        const isMoex = moex === true || moex === '1';
        const isUsd = usd === true || usd === '1';
        const isBond = bond === true || bond === '1';
        const shouldHide = hide === true || hide === '1';

        if (shouldHide) {
            continue;
        }

        const data = await getData(ticker, buyDate, sellDate, amount, isMoex, isUsd, isBond);
        console.log('ticker', ticker, isUsd, isBond, buyDate, sellDate, amount, data)
        if (data) {
            items.push(data);
        }
    }

    return items;
}
