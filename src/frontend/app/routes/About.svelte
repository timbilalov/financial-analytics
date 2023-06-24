<script>
    export let id;
    console.log('id', id)
</script>

<style>
    .tst {
        color: green;
    }
    .tst2 {
        color: red;
    }
</style>

<h1>About3: <span class:tst2="{!!id}" class:tst="{!id}">{id}</span></h1>
