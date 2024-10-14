import { jwtDecode } from "../node_modules/jwt-decode/build/esm/index.js";

const signoutBtn = document.getElementById('signout-btn');
const accountPageLink = document.getElementById('account-page');
const apiBaseUrl = 'http://localhost:3000';


signoutBtn.addEventListener('click', signout);

function setConnexionToken(token){
    localStorage.setItem('accessToken', token.accessToken);
}
function getConnexionToken(){
    const token = localStorage.getItem('accessToken');
    return token;
}

function getRole(){
    const accessToken = getConnexionToken();
    if (accessToken) {
        const decodedToken = jwtDecode(accessToken);
        return decodedToken.role;
    }
}

function isConnected () {
    return !!getConnexionToken()
}

function signout(){
    localStorage.removeItem('accessToken');
    window.location.reload();
}


function manageRoleElements () {
    const userConnected = isConnected();
    const role = getRole();

    const allRoleElements = document.querySelectorAll('[data-show]');

    allRoleElements.forEach((element) => {
        switch (element.dataset.show) {
            case 'disconnected':
                if (userConnected) {
                    element.classList.add('d-none');
                }
                break;
            case 'connected':
                if (!userConnected) {
                    element.classList.add('d-none');
                }
                break;
            case 'admin':
                if (!userConnected || role != 'admin') {
                    element.classList.add('d-none');
                }
                break;
            case 'vet':
                if (!userConnected || role != 'vet') {
                    element.classList.add('d-none');
                }
                break;
            case 'employee':
                if (!userConnected || (role != 'employee' && role != 'admin')) {
                    element.classList.add('d-none');
                }
                break;
        }
        if (role) {
            accountPageLink.innerHTML=`<a class="nav-link" href="/${role}">Mon compte</a>`
        };
    })
}

export { apiBaseUrl, setConnexionToken, getRole, isConnected, getConnexionToken, manageRoleElements };
