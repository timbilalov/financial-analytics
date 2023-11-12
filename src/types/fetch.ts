export type TFetchDataItemMoex = [
    string,
    string,
    string,
    string,
    ...(number)[],
];

export type TFetchResponseMoex = {
    history: {
        metadata?: {
            [key: string]: {
                type: string,
                bytes?: number,
                max_size?: number,
            },
        },
        columns: string[],
        data: TFetchDataItemMoex[],
    },
    'history.cursor': {
        metadata?: {
            [key: string]: string,
        },
        columns: string[],
        data: Array<number[]>,
    }
}

export type TFetchDataMoex = TFetchDataItemMoex[];

export type TFetchResponseInvestCab = {
    t: number[],
    o: number[],
    h: number[],
    l: number[],
    c: number[],
    v: number[],
    s: string,
};

export type TFetchDataInvestcab = TFetchResponseInvestCab;

export type TFetchDataBcs = TFetchDataInvestcab & {
    scale: number;
};
