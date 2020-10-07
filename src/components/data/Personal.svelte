<script>
    import Storage from '../../utils/storage';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    const STORAGE_KEYS = {
        assets: 'assets',
    };

    let assets = Storage.get(STORAGE_KEYS.assets) || [];
    let isAddDialogOpened = false;
    let newAssetValues = {};
    let isReadyToSave;

    $: {
        Storage.set(STORAGE_KEYS.assets, assets);
        isReadyToSave = newAssetValues.ticker && newAssetValues.buyDate && newAssetValues.amount;
    }

    function update() {
        dispatch('updateAssets', {
            assets,
        });
    }

    function onAddButtonClick() {
        if (isAddDialogOpened) {
            closeAddDialog();
        } else {
            openAddDialog();
        }
    }

    function onClearButtonClick() {
        assets = [];
        update();
    }

    function openAddDialog() {
        isAddDialogOpened = true;
    }

    function closeAddDialog() {
        isAddDialogOpened = false;
    }

    function handleTickerInput(event) {
        newAssetValues.ticker = event.target.value;
    }

    function handleBuyDateInput(event) {
        newAssetValues.buyDate = event.target.value;
    }

    function handleAmountInput(event) {
        newAssetValues.amount = event.target.value;
    }

    function save() {
        assets.push(Object.assign({}, newAssetValues));
        assets = assets;

        update();

        clearNewAssetData();
        closeAddDialog();
    }

    function cancel() {
        closeAddDialog();
    }

    function clearNewAssetData() {
        newAssetValues = {};
    }
</script>

<div>
    Assets: {assets.length}
    <button on:click={onAddButtonClick}>add</button>
    <button disabled>manage</button>
    <button on:click={onClearButtonClick}>clear</button>

    {#if isAddDialogOpened}
        <hr>
        <div>
            Ticker: <input type="text" value={newAssetValues.ticker || ''} on:input={handleTickerInput}>
        </div>
        <div>
            Buy date: <input type="text" value={newAssetValues.buyDate || ''} on:input={handleBuyDateInput}>
        </div>
        <div>
            Amount: <input type="text" value={newAssetValues.amount || ''} on:input={handleAmountInput}>
        </div>
        <div>
            <button disabled={!isReadyToSave} on:click={save}>Save</button>
            <button on:click={cancel}>Cancel</button>
        </div>
    {/if}
</div>