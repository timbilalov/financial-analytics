<script>
    import {CALC_METHODS} from "@constants";
    import {locales} from "@presentation";
    import {calcStore, setCalcMethod} from "@store";

    let calcMethod = calcStore.getState().method;

    $: {
        setCalcMethod(calcMethod);
    }
</script>

<b>{locales('common.calc')}</b>:
<br>
<label>
    <input type="radio" bind:group={calcMethod} value={CALC_METHODS.RELATIVE}>
    <span>{locales('calcMethod.relative')}</span>
</label>
<br>
<label>
    <input type="radio" bind:group={calcMethod} value={CALC_METHODS.ABSOLUTE}>
    <span>{locales('calcMethod.absolute')}</span>
</label>
<br>
<label>
    <input type="radio" bind:group={calcMethod} value={CALC_METHODS.ABSOLUTE_TOTAL}>
    <span>{locales('calcMethod.absoluteTotal')}</span>
</label>
<br>
<label>
    <input type="radio" bind:group={calcMethod} value={CALC_METHODS.RELATIVE_ANNUAL}>
    <span>{locales('calcMethod.relativeAnnual')}</span>
</label>
