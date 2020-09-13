<script>
    import debounce from 'lodash/debounce';

    let query = 'lkoh';
    let data = [];
    let fetched = false;

    const handleInput = debounce(event => {
        query = event.target.value;
    }, 1500);

    $: console.log('query', query)
    $: {
        getData(query);
    }

    async function getData(symbol) {
        data = [];
        fetched = false;
        const url = `https://investcab.ru/api/chistory?symbol=${symbol}&resolution=60&from=1596618000&to=1599001126`;
        let response = await fetch(url);
        fetched = true;

        console.log('response', response)

        if (response.ok) {
            let json = await response.json();
            console.log('json', json, JSON.parse(json))
            const parsed = JSON.parse(json);
            data = parsed.o;
        } else {
            console.log("Ошибка HTTP: " + response.status);
        }
    }
</script>

<input type="search" value={query} on:input={handleInput}>

{#if query !== ''}
    {#if data.length > 0}
        <div>Data count: {data.length}</div>
    {:else if !fetched}
        <div>Searching for {query}...</div>
    {:else if fetched && data.length === 0}
        <div>nothing was found</div>
    {/if}
{/if}
