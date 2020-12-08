<script>
    import {locales} from "@presentation";
    import {makeExportUrl} from "@helpers";

    let exportUrl = '';
</script>

<input type="text" bind:value={exportUrl}><button on:click={async () => exportUrl = await makeExportUrl()}>{locales('common.export')}</button>
