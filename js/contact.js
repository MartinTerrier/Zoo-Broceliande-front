const inputEmail = document.getElementById('email-input');
const inputMessage = document.getElementById('message-input');
const inputTitle = document.getElementById('title-input');
const btnSubmit = document.getElementById('btn-submit');

const validateEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(input.value.match(emailRegex)) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid"); 
        return true;
    }
    else{
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

const validateMessage = (input) => {
    if (input.value) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    }
    else{
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

const validateForm = () => {
    const isFormValid = validateEmail(inputEmail) && validateMessage(inputMessage);

    if (isFormValid) {
        btnSubmit.disabled = false;
    } else {
        btnSubmit.disabled = true;
    }
}

inputEmail.addEventListener('keyup', validateForm);
inputTitle.addEventListener('keyup', validateForm);
inputMessage.addEventListener('keyup', validateForm);
