<script>
    import { createEventDispatcher } from 'svelte';
    import {locales} from "@presentation";
    import {ASSET_DEFAULT_FIELDS} from "@constants";
    import {addNewAsset} from "@store";

    const assetFields = ASSET_DEFAULT_FIELDS;
    const dispatch = createEventDispatcher();

    let newAssetValues = {};
    let isReadyToSave;

    $: {
        isReadyToSave = newAssetValues.ticker && newAssetValues.buyDate && newAssetValues.amount;
    }

    function handleNewAssetFieldInput(event) {
        const {target} = event;
        const {name, value} = target;
        const field = name;

        newAssetValues[field] = value;
    }

    function save() {
        addNewAsset(newAssetValues);
        newAssetValues = {};
        done();
    }

    function cancel() {
        done();
    }

    function done() {
        dispatch('done');
    }
</script>

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
