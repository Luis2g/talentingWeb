var talenting = angular.module('talenting',['ngRoute']);

talenting.config(['$routeProvider', function($routeProvider){

    $routeProvider
        .when('/', {
            templateUrl: '/views/general/landing.html'
        })
        .when('/userRegistration', {
            templateUrl: '/views/users/userRegistration.html',
            controller: 'userController'
        })
        .when('/vacancyRegistration', {
            templateUrl: '/views/users/employeer/vacancyRegistration.html',
            controller: 'vacancyController'  
        })
        .when('/404', {
            templateUrl: "/views/errorPages/404.html"
        })
        .when('/login', {
            templateUrl: '/views/login.html',
            controller: 'sesionController'
        })
        .when('/userRegistration', {
            templateUrl: '/views/userRegistration.html',
            controller: 'userController'
        })
        .when('/socialMedia', {
            templateUrl: '/views/users/applier/socialMedia.html'
        })
        .when('/applierPostulation', {
            templateUrl: '/views/users/applier/applierPostulation.html'
        })
        .when('/favorites', {
            templateUrl: '/views/users/applier/favorites.html'
        })
        .when('/vacancies', {
            templateUrl: '/views/users/applier/vacancies.html'
        })
        .when('/profile', {
            templateUrl: '/views/users/profile.html'
        })
        .otherwise({
            redirectTo: '/404'
        });


}]);
