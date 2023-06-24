<script>
    import { Link } from 'svelte-routing';
    console.log('login page frontend');

    let backUrl;

    // $: backUrl = new URL(window.location.href).searchParams.get('backUrl');
    // console.log(window.location);

    const getProps = () => {
        backUrl = new URL(window.location.href).searchParams.get('backUrl');
    };
</script>

<style>
</style>

<h1>Login</h1>
<Link to="#" getProps={getProps} />
<form action="/auth/authorize" method="POST">
    <div>
        <input type="text" name="username" placeholder="username" />
    </div>
    <div>
        <input type="password" name="password" placeholder="password" />
    </div>
    <div>
        <input type="text" name="backUrl" value={backUrl} />
    </div>
    <div>
        <button type="submit">
            Submit
        </button>
    </div>
</form>
