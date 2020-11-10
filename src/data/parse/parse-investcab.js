import {dateFormat} from "@utils/helpers";

export function parseResponseDataInvestcab(responseData) {
    const parsed = JSON.parse(responseData);
    const datesArray = parsed.t;
    const openingPricesArray = parsed.o;
    const closingPricesArray = parsed.c;
    const parsedDataCount = datesArray.length;
    const clearParsedData = [];
    const data = [];

    let prevDate;
    let prevDataObject;

    for (let i = 0; i < parsedDataCount; i++) {
        const dateUTC = datesArray[i];
        const date = dateFormat(dateUTC);
        const openingPrice = openingPricesArray[i];
        const closingPrice = closingPricesArray[i];

        if (date === prevDate) {
            prevDataObject.closingPrice = closingPrice;
        } else {
            const dataObject = {
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

        const dataObject = {
            date,
            value,
        };

        data.push(dataObject);
    }

    return data;
}
