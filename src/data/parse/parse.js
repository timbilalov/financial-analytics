import {parseResponseDataMoex} from "./parse-moex";
import {parseResponseDataInvestcab} from "./parse-investcab";

export function parseResponseData(responseData, useMoex = false, isBond = false) {
    if (useMoex === true) {
        return parseResponseDataMoex(responseData, isBond);
    } else {
        return parseResponseDataInvestcab(responseData);
    }
}
