<script>
    import {createEventDispatcher} from 'svelte';
    import {locales} from "@presentation";
    import {SPLIT_DEFAULT_FIELDS} from "@constants";
    import {setSplits, splitsStore} from "@store";
    import {deepClone} from "@helpers";

    const splitFields = SPLIT_DEFAULT_FIELDS;
    const dispatch = createEventDispatcher();

    let splits = [];
    let splitsNotChanged = [];

    splitsStore.watch(function (state) {
        splits = [];
        const splitsCurrentState = deepClone(state);
        for (const ticker in splitsCurrentState) {
            if (!splitsCurrentState.hasOwnProperty(ticker)) {
                continue;
            }
            const tickerData = splitsCurrentState[ticker] || [];
            tickerData.forEach(item => {
                item.ticker = ticker;
                splits.push(item);
            });
        }
        splitsNotChanged = deepClone(splits);
    });

    function removeSplit(split) {
        if (splits.includes(split)) {
            splits.splice(splits.indexOf(split), 1);
            splits = splits;
        }
    }

    function save() {
        setSplits(splits);
        done();
    }

    function cancel() {
        splits = deepClone(splitsNotChanged);
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
                {#each splitFields as field}
                    <th>{locales(`splits.${field}`)}</th>
                {/each}
                <th>{locales(`common.actions`)}</th>
            </tr>
        </thead>
        <tbody>
            {#each splits as split}
                <tr>
                    {#each splitFields as field}
                        <td contenteditable="true" bind:textContent={split[field]}></td>
                    {/each}
                    <td><span class="remove" on:click={removeSplit(split)}>{locales('actions.remove')}</span></td>
                </tr>
            {/each}
        </tbody>
    </table>

    <div>
        <button on:click={save}>{locales('actions.save')}</button>
        <button on:click={cancel}>{locales('actions.cancel')}</button>
    </div>
</div>
