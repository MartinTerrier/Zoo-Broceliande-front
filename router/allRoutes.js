import Route from './route.js';

export const allRoutes = [
    new Route('/', 'Accueil', [], '/pages/home.html'),
    new Route('/signin', 'Connexion', [ 'disconnected' ], '/pages/signin.html', '/js/auth/signin.js'),
    new Route('/services', 'Nos services', [], '/pages/services.html', '/js/services.js'),
    new Route('/habitats', 'Habitats et animaux', [], '/pages/habitats.html'),
    new Route('/comments', 'Vos commentaires', [], '/pages/comments.html', '/js/comments.js'),
    new Route('/contact', 'Contactez-nous', [], '/pages/contact.html', '/js/contact.js'),
    new Route('/admin', 'Mon compte', [ 'admin' ], '/pages/admin.html'),
    new Route('/employee', 'Mon compte', [ 'employee' ], '/pages/employee.html'),
    new Route('/vet', 'Mon compte', [ 'vet' ], '/pages/vet.html'),
];

export const websiteName = 'Zoo Arcadia';