<script>
    import {createEventDispatcher} from 'svelte';
    import {locales} from "@presentation";
    import {ASSET_DEFAULT_FIELDS} from "@constants";
    import {portfoliosStore, setAssets} from "@store";
    import {deepClone} from "@helpers";

    const assetFields = ASSET_DEFAULT_FIELDS;
    const dispatch = createEventDispatcher();

    let assets = [];
    let assetsNotChanged = [];

    portfoliosStore.watch(function (state) {
        const currentPortfolio = state.list.filter(item => item.name === state.current)[0];

        assets = deepClone(currentPortfolio.assets);
        assetsNotChanged = deepClone(assets);
    });

    function removeAsset(asset) {
        if (assets.includes(asset)) {
            assets.splice(assets.indexOf(asset), 1);
            assets = assets;
        }
    }

    function save() {
        setAssets(assets);
        done();
    }

    function cancel() {
        assets = deepClone(assetsNotChanged);
        done();
    }

    function done() {
        dispatch('done');
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
        <button on:click={save}>{locales('actions.save')}</button>
        <button on:click={cancel}>{locales('actions.cancel')}</button>
    </div>
</div>
