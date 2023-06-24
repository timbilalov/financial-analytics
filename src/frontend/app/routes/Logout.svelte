<script>
    import { Link } from 'svelte-routing';
    console.log('logout page frontend');

    // const getProps = () => {
    //     // backUrl = new URL(window.location.href).searchParams.get('backUrl');
    // };

    window.location = '/auth/logout';
</script>

<style>
</style>

<h1>Logout</h1>
<!-- <Link to="#" getProps={getProps} /> -->
