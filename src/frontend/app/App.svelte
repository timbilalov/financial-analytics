<script>
    import { Router, Link, Route, navigate } from "svelte-routing";
    import Portfolio from "./routes/Portfolio.svelte";
    import About from "./routes/About.svelte";
    import Welcome from "./routes/Welcome.svelte";
    import Login from "./routes/Login.svelte";
    import Logout from "./routes/Logout.svelte";
    import Error404 from "./routes/Error404.svelte";

    import NavLink from './components/nav-link/NavLink.svelte';
    import { checkUserIsAuthorized } from "./auth";

    export let url = "";

    // const env = JSON.parse(document.body.getAttribute('data-env'));
    // const { user } = env;
    // const { isUserAuthorized } = user;

    const isUserAuthorized = checkUserIsAuthorized();

    console.log('App url', url, 'isUserAuthorized', isUserAuthorized)
</script>

<Router url="{url}">
    <nav>
        {#if !isUserAuthorized}
            <NavLink to="/">Welcome</NavLink>
        {/if}
        <NavLink to="/portfolio">Portfolio</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/about/55">About 2</NavLink>
        <NavLink to="/about/666">About 3</NavLink>

        {#if isUserAuthorized}
            <NavLink to="/logout">Logout</NavLink>
        {:else}
            <NavLink to="/login">Login</NavLink>
        {/if}
    </nav>

    <div>
        <Route path="about/:id" let:params>
            <About id="{params.id}" />
        </Route>
        <Route path="about" component="{About}" />
        <Route path="/login" component="{Login}" />
        <Route path="/logout" component="{Logout}" />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/" component="{Welcome}" />
        <Route><Error404 /></Route>
    </div>
</Router>
