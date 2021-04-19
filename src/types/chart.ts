import type {TDatasets} from "./datasets";

export type TChartInstance = {
    config: {
        data: {
            datasets: TDatasets,
        },
    },
    update: () => void,
    destroy?: () => void,
    labelCallback?: () => void,
    legendClick?: () => void,
}; // TODO
