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
        toMyFavorites: () => {
            $location.path('/myFavorites');
        },
        toSocialMedia: () => {
            $location.path('/socialMedia');
        },
        toResume: () => {
            $location.path('/resume');
        },
        toLogin: () => {
            window.location.replace('/login');
        },
    };

    $scope.closeSession = () => {
        $cookies.remove('user');
        $cookies.remove('employeer');
        window.location.replace('/login');
    }


}]);