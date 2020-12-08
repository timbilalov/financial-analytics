<script>
    import {locales} from "@presentation";
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

<input type="text" bind:value={newPortfolioTitle}><button on:click={addPortfolio(newPortfolioTitle)}>{locales('actions.add')}</button>
