talenting.controller('navbarController', ['$scope', '$location','userService', '$cookies', function($scope, $location, userService, $cookies) {


    $scope.session = $cookies.get('user');

    if($scope.session !== undefined){
        $scope.session = JSON.parse($scope.session);
    }


    $scope.switch = {
        toLandingPage: () => {
            $location.path('/');
        },
        toUserRegistration: () => {
            $location.path('/userRegistration');
        },
        toVacancyRegistration: () => {
            $location.path('/vacancyRegistration');
        },
        toProfile: () => {
            $location.path('/profile');
        },
        toMyVacancies: () => {
            $location.path('/myVacancies');
        },
        toLogin: () => {
            window.location.replace('/login');
        },
    };

    $scope.closeSession = () => {
        $cookies.remove('user');
        window.location.replace('/login');
    }


}]);