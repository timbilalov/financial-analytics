import { dateFormat } from '@helpers';
import type { TAssetData, TAssetDataItem, TDate, TFetchResponseInvestCab } from '@types';

type TDataObject = {
    date: TDate,
    openingPrice: number,
    closingPrice: number,
};

export function parseResponseDataInvestcab(responseData: TFetchResponseInvestCab | string): TAssetData | undefined {
    let parsed = responseData as TFetchResponseInvestCab;

    if (typeof responseData === 'string') {
        parsed = JSON.parse(responseData);
    }

    if (!parsed || parsed.t === undefined || parsed.o === undefined || parsed.c === undefined) {
        return;
    }

    const datesArray = parsed.t;
    const openingPricesArray = parsed.o;
    const closingPricesArray = parsed.c;
    const parsedDataCount = datesArray.length;
    const clearParsedData: TDataObject[] = [];
    const data: TAssetData = [];

    let prevDate: TDate = '';
    let prevDataObject: TDataObject = {
        date: '',
        openingPrice: 0,
        closingPrice: 0,
    };

    for (let i = 0; i < parsedDataCount; i++) {
        const dateUTC = datesArray[i];
        const date: TDate = dateFormat(dateUTC);
        const openingPrice = openingPricesArray[i];
        const closingPrice = closingPricesArray[i];

        if (date === prevDate) {
            prevDataObject.closingPrice = closingPrice;
        } else {
            const dataObject: TDataObject = {
                date,
                openingPrice,
                closingPrice,
            };

            clearParsedData.push(dataObject);

            prevDate = date;
            prevDataObject = dataObject;
        }
    }

    for (let i = 0; i < clearParsedData.length; i++) {
        const { date, openingPrice, closingPrice } = clearParsedData[i];
        const value = (openingPrice + closingPrice) / 2;

        const dataObject: TAssetDataItem = {
            date,
            values: {
                current: value,
            },
        };

        data.push(dataObject);
    }

    return data;
}
