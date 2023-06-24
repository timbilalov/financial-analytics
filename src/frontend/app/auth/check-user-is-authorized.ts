// const env = JSON.parse(document.body.getAttribute('data-env'));
// const { user } = env;
// const { isUserAuthorized } = user;

let isAuthorized;

try {
    console.log("document.body.getAttribute('data-env')", document.body.getAttribute('data-env'));
    
    const env = JSON.parse(document.body.getAttribute('data-env') ?? '');
    isAuthorized = env.user.isUserAuthorized;
} catch (error) {
    // Do nothing.
}

export const checkUserIsAuthorized = async () => {
    if (isAuthorized !== undefined) {
        console.log('isAuthorized is already defined', isAuthorized);
        return isAuthorized;
    }

    const response = await fetch('/auth/is-authorized');

    let json;
    if (response.ok) {
        json = await response.text();
    }

    console.log('isAuthorized', json);

    isAuthorized = json === 'true';
    return isAuthorized;

    // return json === 'true';
};
