export function labelsFilter(item, legendItemsToLink) {
    const title = item.text.toLowerCase();

    if (!legendItemsToLink.includes(title)) {
        legendItemsToLink.push(title);
        return true;
    } else {
        return false;
    }
}
