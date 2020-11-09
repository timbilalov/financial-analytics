<script>
    import Storage from '@utils/storage';
    import { createEventDispatcher } from 'svelte';
    import {ASSET_DEFAULT_FIELDS, STORAGE_KEYS} from "@constants";

    const dispatch = createEventDispatcher();

    let assets = Storage.get(STORAGE_KEYS.assets) || [];
    let isAddDialogOpened = false;
    let isManageDialogOpened = false;
    let newAssetValues = {};
    let isReadyToSave;
    let assetFields = ASSET_DEFAULT_FIELDS;

    $: {
        isReadyToSave = newAssetValues.ticker && newAssetValues.buyDate && newAssetValues.amount;
    }

    function update() {
        Storage.set(STORAGE_KEYS.assets, assets);
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

    function handleNewAssetFieldInput(event) {
        const {target} = event;
        const {name, value} = target;
        const field = name;

        newAssetValues[field] = value;
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

    .table td,
    .table th {
        border: 1px solid #cccccc;
        min-width: 20px;
        text-align: left;
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
        {#each assetFields as field}
            <div>
                {field}: <input type="text" name={field} value={newAssetValues[field] || ''} on:input={handleNewAssetFieldInput}>
            </div>
        {/each}
        <div>
            <button disabled={!isReadyToSave} on:click={save}>Save</button>
            <button on:click={cancel}>Cancel</button>
        </div>
    {/if}

    {#if isManageDialogOpened}
        <hr>
        <div>
            <table class="table" cellpadding="0" cellspacing="0">
                <thead>
                    <tr>
                        {#each assetFields as field}
                            <th>{field}</th>
                        {/each}
                        <th>actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each assets as asset}
                        <tr>
                            {#each assetFields as field}
                                <td contenteditable="true" bind:innerHTML={asset[field]}></td>
                            {/each}
                            <td><span class="remove" on:click={removeAsset(asset)}>delete</span></td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            <button on:click={updateAssets}>save</button>
        </div>
    {/if}
</div>