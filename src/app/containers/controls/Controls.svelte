<script>
    import PortfolioList from './components/PortfolioList.svelte';
    import CalcMethod from './components/CalcMethod.svelte';
    import CalcCurrency from "./components/CalcCurrency.svelte";
    import Consider from "./components/Consider.svelte";
    import Assets from "./components/assets/Assets.svelte";
    import Splits from "./components/splits/Splits.svelte";
    import Export from "./components/Export.svelte";
</script>

<style>
    .controls {
        position: fixed;
        left: 10px;
        top: 40px;
        background-color: #fff;
        padding: 10px;
        overflow: auto;
        max-height: calc(100% - 40px);
        box-sizing: border-box;
        z-index: 2;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        opacity: 0.5;
    }

    .controls:hover {
        opacity: 1;
    }
</style>

<div class="controls">
    <PortfolioList />
    <hr>
    <CalcMethod />
    <hr>
    <CalcCurrency />
    <hr>
    <Consider />
    <hr>
    <Assets />
    <hr>
    <Splits />
    <hr>
    <Export />
</div>
