import {legendItemsStore, addLegendItem} from "@store";

export function labelsFilter(item) {
    const title = item.text.toLowerCase();
    const existingLabels = legendItemsStore.getState();

    if (existingLabels.includes(title) === false) {
        addLegendItem(title);
        return true;
    } else {
        return false;
    }
}
