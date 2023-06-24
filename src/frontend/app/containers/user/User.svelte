<script>
    let jwtToken = '';
    let jwtTokenParsed = '';
    let login = '';
    let password = '';
    // let refreshCookie = '';

    // const getCookie = () => {
    //     const cookies = (document.cookie || '').split(';').map(el => el.trim());
    //     console.log('cookies', cookies)
    //
    //     for (const pair of cookies) {
    //         // console.log('pair', pair)
    //         const [key, value] = pair.split('=');
    //         if (key === 'jwtRefresh') {
    //             console.log('found', value);
    //             refreshCookie = value;
    //             return;
    //         }
    //     }
    //
    //     refreshCookie = '';
    // };

    // getCookie();

    const getJwtAppToken = () => jwtToken;
    const setJwtAppToken = async (useCredentials = false) => {
        if (jwtToken === '') {
            useCredentials = true;
        }

        console.log('setJwtAppToken', useCredentials);

        // const data = {
        //     username: login,
        //     password,
        // };
        //
        // var data2 = new FormData();
        // data2.append( "json", JSON.stringify( data ) );

        const params = `?username=${login}&password=${password}&token=${jwtToken}`;

        const options = {
            method: 'GET',
        };

        if (useCredentials) {
            options.credentials = 'include';
        }

        const response = await fetch('http://localhost:3000/auth/login' + params, options);
        // const response = await fetch('http://localhost:3000/auth/login' + params, {
        //     method: 'get',
        //     // method: "POST",
        //     // headers: {
        //     //     'Access-Control-Allow-Credentials': 'true',
        //     //     'Accept': 'application/json',
        //     //     'Content-Type': 'application/json'
        //     // },
        //     // body: JSON.stringify(data),
        //     // body: data2,
        //     // headers: {
        //     //     // 'Access-Control-Allow-Credentials': 'sdasd',
        //     //     // 'Access-Control-Allow-Headers': ['Authorization'],
        //     //     'Authorization': `Bearer ${jwtToken}`,
        //     //     // 'Content-Type': 'application/json'
        //     //     // 'Content-Type': 'application/x-www-form-urlencoded',
        //     // },
        //     credentials: 'include',
        // });
        const token = await response.text();
        console.log('token', token);

        if (token === 'expired') {
            jwtToken = '';
            setJwtAppToken(true);
            return;
        }

        jwtToken = token;

        // getCookie();
        // setTimeout(() => {
        //     getCookie();
        // }, 1000);
    };

    const tst = async () => {
        const token = document.body.querySelector('#token').textContent;
        const response = await fetch(`http://localhost:3000/auth/tst5?token=${token}`);
        const res = await response.text();
        console.log('tst2', res);
    }

    window.tst = tst;

    $: {
        try {
            if (jwtToken !== '' && !jwtToken.includes('hacker')) {
                const parts = jwtToken.split('.');
                console.log('parts', parts, atob(parts[0]), atob(parts[1]));
                jwtTokenParsed = JSON.stringify(atob(parts[1]));
            } else {
                jwtTokenParsed = '';
            }
        } catch(error) {
            jwtTokenParsed = 'err';
        }
    }

    const reg = async () => {
        const params = `?username=${login}&password=${password}`;

        const response = await fetch('http://localhost:3000/auth/register' + params, {
            credentials: 'include',
        });
        const token = await response.text();
        console.log('register token', token);
        jwtToken = token;

        // setTimeout(() => {
        //     getCookie();
        // }, 1000);
    };

    const unsetJwtAppToken = async () => {
        const response = await fetch('http://localhost:3000/auth/logout', {
            credentials: 'include',
        });
        // const token = await response.text();
        // console.log('token', token);
        jwtToken = '';
        // refreshCookie = '';

        // setTimeout(() => {
        //     getCookie();
        // }, 1000);
    };

    setTimeout(() => {
        // if (refreshCookie !== '') {
        // }
        setJwtAppToken();
    }, 1000);

    // const tst = async () => {
    //     const response = await fetch('http://localhost:3000/auth/test', {
    //         credentials: 'include',
    //         // credentials: 'same-origin',
    //     });
    //     const token = await response.text();
    //     console.log('token', token);
    //     // jwtToken = token;
    // };

    function loginFunction() {
        console.log('login function');
        setJwtAppToken();
    }

    function registerFunction() {
        console.log('register function');
        reg();
    }

    function logoutFunction() {
        console.log('logout function');
        unsetJwtAppToken();
    }
</script>

<style>
    #user {
        background-color: #eeeeee;
        padding: 10px;
        position: fixed;
        right: 10px;
        bottom: 10px;
        z-index: 2;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    }

    .vam {
        display: inline-block;
        vertical-align: middle;
    }

    .token {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>

<div id="user">
    login: <input type="text" bind:value={login} />
    <br />

    password: <input type="text" bind:value={password} />
    <br />

    <button on:click={loginFunction}>Log In</button>
    <button on:click={registerFunction}>Register</button>
    <button on:click={logoutFunction}>Log Out</button>
    <br />

    <span class="vam">jwtToken:</span> <span class="vam token" title={jwtToken}>{jwtToken}</span>
    <br />
    <span class="vam">jwtToken parsed:</span> <span class="vam token" title={jwtTokenParsed}>{jwtTokenParsed}</span>
</div>
