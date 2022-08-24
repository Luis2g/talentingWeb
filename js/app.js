var talenting = angular.module('talenting',['ngRoute', 'ngCookies']);

talenting.config(['$routeProvider', function($routeProvider){

    $routeProvider
        .when('/', {
            templateUrl: '/views/general/main.html',
            controller: 'mainController'
        })
        .when('/userRegistration', {
            templateUrl: '/views/users/userRegistration.html',
            controller: 'userController'
        })
        .when('/vacancyRegistration', {
            templateUrl: '/views/users/employeer/vacancyRegistration.html',
            controller: 'vacancyController'  
        })
        .when('/login', {
            templateUrl: '/views/login.html',
            controller: 'sessionController'
        })
        .when('/socialMedia', {
            templateUrl: '/views/users/applier/socialMedia.html',
            controller: 'socialMediaController'
        })
        .when('/applierPostulation', {
            templateUrl: '/views/users/applier/applierPostulation.html'
        })
        .when('/myVacancies', {
            templateUrl: '/views/users/applier/myVacancies.html',
            controller: 'applierVacanciesController'
        })
        .when('/myFavorites', {
            templateUrl: '/views/users/applier/myFavorites.html',
            controller: 'myFavoritesController'
        })
        .when('/vacancies', {
            templateUrl: '/views/users/applier/vacancies.html'
        })
        .when('/profile', {
            templateUrl: '/views/users/profile.html',
            controller: 'userController'
        })
        .when('/resume', {
            templateUrl: '/views/users/applier/resume.html',
            controller: 'resumeController'
        })
        .when('/appliersList', {
            templateUrl: '/views/users/employeer/appliersList.html',
            controller: 'appliersController'
        })
        .when('/landingPage', {
            templateUrl: "/views/general/landingPage.html",
            controller: 'landingPageController'
        })
        .when('/404', {
            templateUrl: "/views/errorPages/404.html"
        })
        .when('/401', {
            templateUrl: "/views/errorPages/401.html"
        })
        .when('/403', {
            templateUrl: "/views/errorPages/403.html"
        })
        .otherwise({
            redirectTo: '/404'
        });


}]);
