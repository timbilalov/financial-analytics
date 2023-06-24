<script>
  import { checkUserIsAuthorized } from 'app/auth';
    import NavLink from '../components/nav-link/NavLink.svelte';

    // const env = JSON.parse(document.body.getAttribute('data-env'));
    // const { user } = env;
    // const { isUserAuthorized } = user;

    const isUserAuthorized = checkUserIsAuthorized();

    console.log('Welcome page', 'isUserAuthorized', isUserAuthorized);

    if (isUserAuthorized) {
        window.location = '/portfolio';
    }
</script>

<h1>Welcome</h1>

<NavLink to="/login">Login</NavLink>
<NavLink to="/register">Registration</NavLink>
