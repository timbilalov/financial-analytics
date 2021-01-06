<script>
    import {locales} from "@presentation";
    import {SUMMARY_PORTFOLIO_NAME} from "@constants";
    import {portfoliosStore, addPortfolio, removePortfolio, setCurrentPortfolio} from "@store";

    let currentPortfolio;
    let portfolioList;
    let newPortfolioTitle = '';

    function clearNewPortfolioField () {
        newPortfolioTitle = '';
    }

    portfoliosStore.watch(function (state) {
        portfolioList = state.list.map(item => item.name);
        currentPortfolio = state.current;
    });

    addPortfolio.watch(clearNewPortfolioField);
    removePortfolio.watch(clearNewPortfolioField);

    $: {
        setCurrentPortfolio(currentPortfolio);
    }
</script>

<b>{locales('common.portfolio')}</b>:
<br>

{#each portfolioList as item (item)}
    <label style="display: inline-block;">
        <input type="radio" bind:group={currentPortfolio} value={item}>
        <span>{item}</span>
    </label>
    <button on:click={removePortfolio(item)}>{locales('actions.remove')}</button>
    <br>
{/each}

{#if portfolioList.length > 1}
    <label style="display: inline-block;">
        <input type="radio" bind:group={currentPortfolio} value={SUMMARY_PORTFOLIO_NAME}>
        <span>{locales('common.summaryPortfolio')}</span>
    </label>
    <br>
{/if}

<input type="text" bind:value={newPortfolioTitle}><button on:click={addPortfolio(newPortfolioTitle)}>{locales('actions.add')}</button>
