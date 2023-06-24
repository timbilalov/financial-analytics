import { legendItemsStore, addLegendItem } from '@store';
import type { TLabelItem } from '@types';

export function labelsFilter(item: TLabelItem): boolean {
    const title = item.text.toLowerCase();
    const existingLabels = legendItemsStore.getState();

    if (!existingLabels.includes(title)) {
        addLegendItem(title);
        return true;
    } else {
        return false;
    }
}
