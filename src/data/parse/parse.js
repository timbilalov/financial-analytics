import {parseResponseDataMoex} from "./parse-moex";
import {parseResponseDataInvestcab} from "./parse-investcab";

export function parseResponseData(responseData, useMoex = false) {
    if (useMoex === true) {
        return parseResponseDataMoex(responseData);
    } else {
        return parseResponseDataInvestcab(responseData);
    }
}
