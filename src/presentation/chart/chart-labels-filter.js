import {legendItemsStore, addLegendItem} from "@store";
import {isObject} from "@helpers";

export function labelsFilter(item) {
    if (!isObject(item)) {
        return;
    }

    const title = item.text.toLowerCase();
    const existingLabels = legendItemsStore.getState();

    if (existingLabels.includes(title) === false) {
        addLegendItem(title);
        return true;
    } else {
        return false;
    }
}
