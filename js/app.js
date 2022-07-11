var talenting = angular.module('talenting',['ngRoute']);

talenting.config(['$routeProvider', function($routeProvider){

    $routeProvider
        .when('/', {
            templateUrl: '/views/index.html'
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
        .otherwise({
            redirectTo: '/404'
        });


}]);
