<script>
    import {locales} from "@presentation";
    import {CALC_CURRENCIES} from "@constants";
    import {calcOptionsStore, setCurrency} from "@store";

    let calcCurrency;

    calcOptionsStore.watch(function (state) {
        calcCurrency = state.currency;
    });

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
