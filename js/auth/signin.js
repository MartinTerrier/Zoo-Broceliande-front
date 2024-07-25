const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const btnSignIn = document.getElementById('btn-signin');

const checkCredentials = () => {
    if (emailInput.value === 'test@mail.com' && passwordInput.value === '123') {
        const token = 'bfizapehfpzuegbfuvbze';
        window.location.replace('/');
    } else {
        emailInput.classList.add('is-invalid');
        passwordInput.classList.add('is-invalid');
    }
}

btnSignIn.addEventListener('click', checkCredentials);