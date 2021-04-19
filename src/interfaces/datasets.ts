export interface dataset {
    label: string;
    backgroundColor: string;
    borderColor: string;
    data: number[];
    dataAbsTotal?: number[];
    dates: string[];
    type: string;
    pointRadius: number;
    fill: string | false;
    lineTension: number;
    borderWidth: number;
    borderDash?: number;
    amount: number;
    isUsd: boolean;
}
