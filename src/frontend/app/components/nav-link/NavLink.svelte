<script>
    import { Link, navigate } from "svelte-routing";

    import { NON_AUTH_PATHS } from '@common/constants';
    import { checkUserIsAuthorized } from "app/auth";
    
    export let to = "";
    // export let isStatic = false;
    
    function getProps({ location, href, isPartiallyCurrent, isCurrent }) {
        console.log('getProps here');
        const isActive = href === "/" ? isCurrent : isPartiallyCurrent || isCurrent;
        
        // The object returned here is spread on the anchor element's attributes
        if (isActive) {
            return { class: "active" };
        }
        return {};

        navigate(to);
    }

    let isLoading = false;

    const onClick = async () => {
        // if (isStatic) {
        //     console.log('static');
        //     window.location = to;
        //     return;
        // }

        if (isLoading) {
            return;
        }
        isLoading = true;

        await checkIsAuthorized();
        isLoading = false;

        // setTimeout(() => {
        //     isLoading = false;
        // }, 500);
    }

    // const isAuthorized = async () => {
    //     const response = await fetch('/auth/is-authorized');

    //     let json;
    //     if (response.ok) {
    //         json = await response.text();
    //     }

    //     console.log('isAuthorized', json);

    //     return json === 'true';
    // };

    const checkIsAuthorized = async () => {
        // const au = await isAuthorized();
        const au = await checkUserIsAuthorized();

        // const currentPath = window.location.pathname;
        const currentPath = to;
        // if (!au && currentPath !== '/login') {
        // } else {
        // }

        // const nonAuthPaths = [
        //     '/login',
        //     '/logout',
        //     '/',
        // ];

        // if (au || nonAuthPaths.includes(currentPath)) {
        if (au || NON_AUTH_PATHS.includes(currentPath)) {
            console.log('auth ok', to);
            navigate(to);
        } else {
            const loginRedirectUrl = `/login${currentPath ? `?backUrl=${currentPath}` : ''}`;
            console.log('noooooooo', loginRedirectUrl);
            navigate(loginRedirectUrl);
        }
    }
</script>

<style>
    .loading {
        opacity: 0.75;
        pointer-events: none;
    }
</style>

<!-- {#if isLoading}
    loading...
{/if}
{#if !isLoading}
{/if} -->
<button on:click={onClick} class={isLoading ? 'loading' : ''}>
    <!-- <Link to="#" getProps="{getProps}">
        <slot />
    </Link> -->
    <slot />
</button>

