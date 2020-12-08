<script>
    import {locales} from "@presentation";
    import {CALC_CURRENCIES} from "@constants";
    import {calcStore, setCurrency} from "@store";

    let calcCurrency = calcStore.getState().currency;

    $: {
        setCurrency(calcCurrency);
    }
</script>

<b>{locales('common.calcCurrency')}</b>:
<br>
<label>
    <input type="radio" bind:group={calcCurrency} value={CALC_CURRENCIES.RUB}>
    <span>{locales('calcCurrency.rub')}</span>
</label>
<br>
<label>
    <input type="radio" bind:group={calcCurrency} value={CALC_CURRENCIES.USD}>
    <span>{locales('calcCurrency.usd')}</span>
</label>
