talenting.controller('navbarController', ['$scope', '$location','userService', function($scope, $location, userService) {


    $scope.switch = {
        toLandingPage: () => {
            $location.path('/')
        },
        toUserRegistration: () => {
            $location.path('/userRegistration')
        },
        toVacancyRegistration: () => {
            $location.path('/vacancyRegistration')
        },
        toProfile: () => {
            $location.path('/profile')
        }
    };


}]);