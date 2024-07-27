const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const btnSignIn = document.getElementById('btn-signin');
const signinForm = document.getElementById('signin-form');

const checkCredentials = () => {
    let dataForm = new FormData(signinForm);

    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    let raw = JSON.stringify({
        'userName': dataForm.get('email'),
        'password': dataForm.get('password'),
    });

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
    };

    fetch(`${apiBaseUrl}/auth/login`, requestOptions)
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            emailInput.classList.add('is-invalid');
            passwordInput.classList.add('is-invalid');
        }
    })
    .then((result) => {
        setConnexionToken(result);
        setCookie(roleCookieName, 'admin', 7);
        window.location.replace('/');
    })
    .catch((error) => console.error(error));
}

btnSignIn.addEventListener('click', checkCredentials);