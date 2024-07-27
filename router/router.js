import Route from './route.js';
import { allRoutes, websiteName } from './allRoutes.js';
import { manageRoleElements, isConnected, getRole } from '../js/script.js';

// Création d'une route pour la page 404 (page introuvable)
const route404 = new Route("/404", "Page introuvable", [], "/pages/404.html");

// Fonction pour récupérer la route correspondant à une URL donnée
const getRouteByUrl = (url) => {
    let currentRoute = null;
    // Parcours de toutes les routes pour trouver la correspondance
    allRoutes.forEach((element) => {
        if (element.url === url) {
            currentRoute = element;
        }
    });
    // Si aucune correspondance n'est trouvée, on retourne la route 404
    // return currentRoute || route404;
    if (currentRoute) {
        return currentRoute;
    } else {
        return route404;
    }
};

// Fonction pour charger le contenu de la page
const LoadPageContent = async () => {
    const path = window.location.pathname;
    // Récupération de l'URL actuelle
    const currentRoute = getRouteByUrl(path);

    //Vérification des rôles autorisés à accéder à la page
    const rolesArray = currentRoute.authorize;

    if (rolesArray.length > 0) {
        if (rolesArray.includes('disconnected')) {
            if (isConnected()) {
                window.location.replace('/');
            }
        } else {
            const userRole = getRole();
            if (!rolesArray.includes(userRole)) {
                window.location.replace('/');
            }
        }
    }

    // Récupération du contenu HTML de la route
    const html = await fetch(currentRoute.pathHtml).then((data) => data.text());
    // Ajout du contenu HTML à l'élément avec l'ID "main-page"
    document.getElementById("main-page").innerHTML = html;

    // Ajout du contenu JavaScript
    if (currentRoute.pathJS) {
        // Création d'une balise script
        const scriptTag = document.createElement("script");
        scriptTag.setAttribute("type", "module");
        scriptTag.setAttribute("src", currentRoute.pathJS);

        // Ajout de la balise script au corps du document
        document.querySelector("body").appendChild(scriptTag);
    }

    // Changement du titre de la page
    document.title = `${currentRoute.title} - ${websiteName}`;

    // Masquer les éléments indisponibles en fonction du rôle
    manageRoleElements();
};

// Fonction pour gérer les événements de routage (clic sur les liens)
const routeEvent = (event) => {
    event = event || window.event;
    event.preventDefault();
    // Mise à jour de l'URL dans l'historique du navigateur
    window.history.pushState({}, "", event.target.href);

    // Chargement du contenu de la nouvelle page
    LoadPageContent();
};

// Gestion de l'événement de retour en arrière dans l'historique du navigateur
window.onpopstate = LoadPageContent;
// Assignation de la fonction routeEvent à la propriété route de la fenêtre
window.route = routeEvent;
// Chargement du contenu de la page au chargement initial
LoadPageContent();