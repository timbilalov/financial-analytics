<script>
    import {locales} from "@presentation";
    import {splitsStore} from "@store";
    import AddNewSplit from "./components/AddNewSplit.svelte";
    import ManageSplits from "./components/ManageSplits.svelte";

    let splitsCount = 0;
    let isAddDialogOpened = false;
    let isManageDialogOpened = false;

    splitsStore.watch(function (state) {
        splitsCount = state.length;
    });

    function onAddButtonClick() {
        isAddDialogOpened = !isAddDialogOpened;

        if (isAddDialogOpened === true) {
            isManageDialogOpened = false;
        }
    }

    function onManageButtonClick() {
        isManageDialogOpened = !isManageDialogOpened;

        if (isManageDialogOpened === true) {
            isAddDialogOpened = false;
        }
    }

    function handleNewSplitDone() {
        isAddDialogOpened = false;
    }

    function handleManageSplitsDone() {
        isManageDialogOpened = false;
    }
</script>

{locales('common.splits')}: {splitsCount}
<br>

<button on:click={onAddButtonClick}>{locales('actions.add')}</button>
<button on:click={onManageButtonClick}>{locales('actions.change')}</button>

{#if isAddDialogOpened}
    <AddNewSplit on:done={handleNewSplitDone} />
{/if}

{#if isManageDialogOpened}
    <ManageSplits on:done={handleManageSplitsDone} />
{/if}
