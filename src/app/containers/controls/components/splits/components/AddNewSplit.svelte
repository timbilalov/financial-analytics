<script>
    import { createEventDispatcher } from 'svelte';
    import {locales} from "@presentation";
    import {SPLIT_DEFAULT_FIELDS} from "@constants";
    import {addNewSplit} from "@store";

    const splitFields = SPLIT_DEFAULT_FIELDS;
    const dispatch = createEventDispatcher();

    let newSplitValues = {};
    let isReadyToSave;

    $: {
        isReadyToSave = newSplitValues.ticker && newSplitValues.splitDate && newSplitValues.amountBefore && newSplitValues.amountAfter;
    }

    function handleNewSplitFieldInput(event) {
        const {target} = event;
        const {name, value} = target;
        newSplitValues[name] = value;
    }

    function save() {
        addNewSplit(newSplitValues);
        newSplitValues = {};
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
{#each splitFields as field}
    <div>
        {locales(`splits.${field}`)}: <input type="text" name={field} value={newSplitValues[field] || ''} on:input={handleNewSplitFieldInput}>
    </div>
{/each}
<div>
    <button disabled={!isReadyToSave} on:click={save}>{locales('actions.save')}</button>
    <button on:click={cancel}>{locales('actions.cancel')}</button>
</div>
