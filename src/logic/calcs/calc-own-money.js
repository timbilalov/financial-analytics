export function calcOwnMoney(datasets, datesFullArray) {
    const values = [];
    const dates = datesFullArray;

    datasets = datasets.filter(dataset => dataset.hidden !== true);

    let initialValues = [];

    for (const i in dates) {
        const date = dates[i];
        let total = 0;

        for (const j in datasets) {
            const dataset = datasets[j];
            const value = dataset.data[i];
            const valueAbsTotal = dataset?.dataAbsTotal[i];

            if (!isNaN(value) && value !== null) {
                if (initialValues[j] === undefined && valueAbsTotal !== undefined) {
                    initialValues[j] = {
                        date: date,
                        value: valueAbsTotal,
                    };
                }
            }
        }

        for (const n in datasets) {
            if (initialValues[n] !== undefined) {
                total += initialValues[n].value;
            }
        }

        values.push({
            value: total,
            date: date,
        });
    }

    return values;
}
