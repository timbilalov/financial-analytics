<script>
    import {locales, makeExportUrl} from "@presentation";

    let exportUrl = '';
</script>

<input type="text" bind:value={exportUrl}><button on:click={async () => exportUrl = await makeExportUrl()}>{locales('common.export')}</button>
