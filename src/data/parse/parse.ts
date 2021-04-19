import {parseResponseDataMoex} from "./parse-moex";
import {parseResponseDataInvestcab} from "./parse-investcab";
import type {TAssetData} from "@types";

export function parseResponseData(responseData, useMoex = false, isBond = false): TAssetData | undefined {
    if (useMoex) {
        return parseResponseDataMoex(responseData, isBond);
    } else {
        return parseResponseDataInvestcab(responseData);
    }
}
