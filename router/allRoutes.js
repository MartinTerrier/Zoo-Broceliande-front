import Route from './route.js';

export const allRoutes = [
    new Route('/', 'Accueil', '/pages/home.html'),
    new Route('/signin', 'Connexion', '/pages/signin.html', '/js/auth/signin.js'),
    new Route('/services', 'Nos services', '/pages/services.html'),
    new Route('/habitats', 'Habitats et animaux', '/pages/habitats.html'),
    new Route('/comments', 'Vos commentaires', '/pages/comments.html'),
    new Route('/contact', 'Contactez-nous', '/pages/contact.html', '/js/contact.js'),
];

export const websiteName = 'Zoo Arcadia';