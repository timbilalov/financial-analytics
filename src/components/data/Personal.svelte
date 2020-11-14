<script>
    import { createEventDispatcher } from 'svelte';
    import {ASSET_DEFAULT_FIELDS} from "@constants";
    import {locales} from "@presentation";

    export let assets;

    const dispatch = createEventDispatcher();

    let isAddDialogOpened = false;
    let isManageDialogOpened = false;
    let newAssetValues = {};
    let isReadyToSave;
    let assetFields = ASSET_DEFAULT_FIELDS;

    $: {
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
        closeManageDialog();

        isAddDialogOpened = true;
    }

    function closeAddDialog() {
        isAddDialogOpened = false;
    }

    function openManageDialog() {
        closeAddDialog();

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
        closeManageDialog();
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
    {locales('common.assets')}: {assets.length}
    <br>

    <button on:click={onAddButtonClick}>{locales('actions.add')}</button>
    <button on:click={onManageButtonClick}>{locales('actions.change')}</button>
    <button on:click={onClearButtonClick}>{locales('actions.clear')}</button>

    {#if isAddDialogOpened}
        <hr>
        {#each assetFields as field}
            <div>
                {locales(`assets.${field}`)}: <input type="text" name={field} value={newAssetValues[field] || ''} on:input={handleNewAssetFieldInput}>
            </div>
        {/each}
        <div>
            <button disabled={!isReadyToSave} on:click={save}>{locales('actions.save')}</button>
            <button on:click={cancel}>{locales('actions.cancel')}</button>
        </div>
    {/if}

    {#if isManageDialogOpened}
        <hr>
        <div>
            <table class="table" cellpadding="0" cellspacing="0">
                <thead>
                    <tr>
                        {#each assetFields as field}
                            <th>{locales(`assets.${field}`)}</th>
                        {/each}
                        <th>{locales(`common.actions`)}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each assets as asset}
                        <tr>
                            {#each assetFields as field}
                                <td contenteditable="true" bind:textContent={asset[field]}></td>
                            {/each}
                            <td><span class="remove" on:click={removeAsset(asset)}>{locales('actions.remove')}</span></td>
                        </tr>
                    {/each}
                </tbody>
            </table>

            <div>
                <button on:click={updateAssets}>{locales('actions.save')}</button>
                <button on:click={cancel}>{locales('actions.cancel')}</button>
            </div>
        </div>
    {/if}
</div>