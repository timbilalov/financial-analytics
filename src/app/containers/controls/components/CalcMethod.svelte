<script>
    import {CALC_METHODS} from "@constants";
    import {locales} from "@presentation";
    import {calcOptionsStore, setCalcMethod} from "@store";

    let calcMethod;

    calcOptionsStore.watch(function (state) {
        calcMethod = state.method;
    });

    $: {
        setCalcMethod(calcMethod);
    }
</script>

<b>{locales('common.calc')}</b>:
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
