import { setConnexionToken, apiBaseUrl, getConnexionToken } from "../script.js";

const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const btnSignIn = document.getElementById('btn-signin');
const signinForm = document.getElementById('signin-form');

const checkCredentials = async (e) => {
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
    .then(async (response) => {
        if (response.ok) {
            const json = await response.json();
            return json;
        } else {
            emailInput.classList.add('is-invalid');
            passwordInput.classList.add('is-invalid');
        }
    })
    .then((result) => {
        setConnexionToken(result);

        window.location.replace('/');
    })
    .catch((error) => console.error(error));
}

const submitOnEnter = (event) => {
    if (event.key === 'Enter') checkCredentials();
}

btnSignIn.addEventListener('click', checkCredentials);
emailInput.addEventListener('keydown', submitOnEnter);
passwordInput.addEventListener('keydown', submitOnEnter);