import { jwtDecode } from "../node_modules/jwt-decode/build/esm/index.js";

const signoutBtn = document.getElementById('signout-btn');
const apiBaseUrl = 'http://localhost:3000';


signoutBtn.addEventListener('click', signout);

// function setCookie(name,value,days) {
//     var expires = "";
//     if (days) {
//         var date = new Date();
//         date.setTime(date.getTime() + (days*24*60*60*1000));
//         expires = `; expires=${date.toUTCString()}`;
//     }
//     document.cookie = `${name}=${(value || "")}${expires}; path=/`;
// }
// function getCookie(name) {
//     var nameEQ = name + "=";
//     var ca = document.cookie.split(';');
//     for(var i=0;i < ca.length;i++) {
//         var c = ca[i];
//         while (c.charAt(0)==' ') c = c.substring(1,c.length);
//         if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
//     }
//     return null;
// }
// function eraseCookie(name) {   
// document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
// }

function setConnexionToken(token){
    // setCookie(tokenCookieName, token, 7);
    localStorage.setItem('accessToken', token.accessToken)
}
function getConnexionToken(){
    // return getCookie(tokenCookieName);
    return localStorage.getItem('accessToken')
}

// const roleCookieName = 'role';
function getRole(){
    // return getCookie(roleCookieName);
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


export function manageRoleElements () {
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
                if (!userConnected || role != 'employee') {
                    element.classList.add('d-none');
                }
                break;
        }
    })
}

export { apiBaseUrl, setConnexionToken, getRole, isConnected, getConnexionToken };
