<script>
    import {locales} from "@presentation";
    import {calcOptionsStore, setCalcUses} from "@store";

    let useTaxes;

    calcOptionsStore.watch(function (state) {
        useTaxes = state.uses.taxes;
    });

    $: {
        setCalcUses({
            taxes: useTaxes,
        });
    }
</script>

<b>{locales('common.consider')}</b>:
<br>
<label>
    <input type="checkbox" bind:checked={useTaxes}>
    <span>{locales('use.taxes')}</span>
</label>
