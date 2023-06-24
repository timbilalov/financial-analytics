<script>
    export let loading = true;
</script>

<style>
    @keyframes throbber {
        0% {
            transform: scale(1);
        }

        100% {
            transform: scale(0.2);
            opacity: 0.5;
        }
    }

    .overlay {
        position: absolute;
        z-index: 100;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.75);
        color: #000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
    }

    .overlay._visible {
        opacity: 1;
        pointer-events: auto;
    }

    .throbber {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 40px;
        height: 40px;
        margin-left: -20px;
        margin-top: -20px;
        border-radius: 50%;
        background-color: currentColor;
        box-sizing: border-box;
        animation: throbber 1s infinite alternate;
    }
</style>

<div class="overlay {loading ? '_visible' : ''}">
    <div class="throbber"></div>
</div>
