<script>
    import Storage from '../../utils/storage';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    const STORAGE_KEYS = {
        assets: 'assets',
    };

    let assets = Storage.get(STORAGE_KEYS.assets) || [];
    let isAddDialogOpened = false;
    let isManageDialogOpened = false;
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

    function onManageButtonClick() {
        if (isManageDialogOpened) {
            closeManageDialog();
        } else {
            openManageDialog();
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

    function openManageDialog() {
        isManageDialogOpened = true;
    }

    function closeManageDialog() {
        isManageDialogOpened = false;
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

    function handleMoexInput(event) {
        newAssetValues.moex = event.target.value;
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

    function removeAsset(asset) {
        assets.splice(assets.indexOf(asset), 1);
        assets = assets;
    }

    function updateAssets() {
        update();
        isManageDialogOpened = false;
    }
</script>

<style>
    .table {
        width: 100%;
        border-collapse: collapse;
    }

    .table td {
        border: 1px solid #cccccc;
        min-width: 20px;
    }

    .remove {
        font-weight: bold;
        cursor: pointer;
    }
</style>

<div>
    Assets: {assets.length}
    <button on:click={onAddButtonClick}>add</button>
    <button on:click={onManageButtonClick}>manage</button>
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
            MOEX: <input type="text" value={newAssetValues.moex || ''} on:input={handleMoexInput}>
        </div>
        <div>
            <button disabled={!isReadyToSave} on:click={save}>Save</button>
            <button on:click={cancel}>Cancel</button>
        </div>
    {/if}

    {#if isManageDialogOpened}
        <hr>
        <div>
            <table class="table" cellpadding="0" cellspacing="0">
                <tbody>
                    {#each assets as asset}
                        <tr>
                            <td contenteditable="true" bind:innerHTML={asset.ticker}></td>
                            <td contenteditable="true" bind:innerHTML={asset.buyDate}></td>
                            <td contenteditable="true" bind:innerHTML={asset.amount}></td>
                            <td contenteditable="true" bind:innerHTML={asset.moex}></td>
                            <td><span class="remove" on:click={removeAsset(asset)}>delete</span></td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            <button on:click={updateAssets}>save</button>
        </div>
    {/if}
</div>