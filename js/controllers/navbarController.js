talenting.controller('navbarController', ['$scope', '$location','userService', '$cookies', function($scope, $location, userService, $cookies) {


    $scope.session = $cookies.get('user');

    if($scope.session !== undefined){
        $scope.session = JSON.parse($scope.session);
    }


    $scope.switch = {
        toMainView: () => {
            $location.path('/');
        },
        toLandingPage: () => {
            $location.path('/landingPage');
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
        toResume: () => {
            $location.path('/resume');
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