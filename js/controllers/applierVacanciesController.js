talenting.controller('applierVacanciesController', ['$scope', '$http', '$location','userService', '$cookies', function($scope, $http, $location, userService, $cookies) {

    $scope.appliedVacancies = [];
    $scope.userSession;


    let session = $cookies.get('user');


    if(!session){
        $location.path('/401');
    }else{
        $scope.userSession = JSON.parse($cookies.get('user'));
        if($scope.userSession.role !== 'employee'){
            $location.path('/403');
        }
    }

    $scope.switch = {
        toMyFavorites: () => {
            $location.path('/myFavorites');
        }
    };


    $scope.retrieveUserVacancies = () => {
        $http({
            method: 'GET',
            url: 'http://localhost:8080/talenting/vacanciesByApplier',
            params: { applierId: $scope.userSession.id }
        }).then( response => {
            $scope.appliedVacancies = response.data;
            console.log(response);
            
        }, err => {
            console.log('This is the error ', err);
        });
    };

    $scope.disapply = (vacancyId, index) => {

        $http({
            method: "DELETE",
            url: 'http://localhost:8080/talenting/appliersInVacancies',
            params: {vacancyId: vacancyId}
        }).then( () => {

            $scope.appliedVacancies.splice(index, 1);

        });
    };


}]);