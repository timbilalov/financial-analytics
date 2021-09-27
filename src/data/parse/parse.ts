import { parseResponseDataMoex } from './parse-moex';
import { parseResponseDataInvestcab } from './parse-investcab';
import type {
    TAssetData,
    TFetchDataInvestcab,
    TFetchDataMoex,
} from '@types';

export function parseResponseData(responseData: TFetchDataMoex | TFetchDataInvestcab, useMoex = false, isBond = false): TAssetData | undefined {
    if (useMoex) {
        return parseResponseDataMoex(responseData as TFetchDataMoex, isBond);
    } else {
        return parseResponseDataInvestcab(responseData as TFetchDataInvestcab);
    }
}
