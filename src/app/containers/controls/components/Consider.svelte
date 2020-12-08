<script>
    import {locales} from "@presentation";
    import {calcStore, setCalcUses} from "@store";

    let useTaxes = calcStore.getState().uses.taxes;

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
