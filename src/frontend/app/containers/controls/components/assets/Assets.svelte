<script>
    import {locales} from "@presentation";
    import {portfoliosStore} from "@store";
    import AddNewAsset from "./components/AddNewAsset.svelte";
    import ManageAssets from "./components/ManageAssets.svelte";
    import {LocalStorage} from "@utils";
    import {STORAGE_KEYS, SUMMARY_PORTFOLIO_NAME} from "@constants";

    let assets = [];
    let isAddDialogOpened = false;
    let isManageDialogOpened = false;

    portfoliosStore.watch(function (state) {
        const currentPortfolioName = state.current;
        if (currentPortfolioName === SUMMARY_PORTFOLIO_NAME) {
            const allAssets = state.list.map(item => item.assets);
            assets = [];
        } else {
            const currentPortfolio = state.list.filter(item => item.name === currentPortfolioName)[0];
            assets = currentPortfolio.assets;
        }
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

    function handleNewAssetDone() {
        isAddDialogOpened = false;
    }

    function handleManageAssetsDone() {
        isManageDialogOpened = false;
    }

    function onClearCacheButtonClick() {
        const keysToClear = [
            STORAGE_KEYS.indexFund,
            STORAGE_KEYS.usdData,
            STORAGE_KEYS.assetsData,
        ];

        keysToClear.forEach(key => LocalStorage.remove(key));
        window.location.reload();
    }
</script>

{locales('common.assets')}: {assets.length}
<br>

<button on:click={onAddButtonClick}>{locales('actions.add')}</button>
<button on:click={onManageButtonClick}>{locales('actions.change')}</button>
<br>

<button on:click={onClearCacheButtonClick}>{locales('actions.clearCache')}</button>

{#if isAddDialogOpened}
    <AddNewAsset on:done={handleNewAssetDone} />
{/if}

{#if isManageDialogOpened}
    <ManageAssets on:done={handleManageAssetsDone} />
{/if}
