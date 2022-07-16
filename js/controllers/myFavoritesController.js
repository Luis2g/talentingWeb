talenting.controller('myFavoritesController', ['$scope', '$http', '$location','userService', '$cookies', 'alertService', function($scope, $http, $location, userService, $cookies, alertService) {

    $scope.userSession;
    $scope.myFavoriteOnes = [];

    let session = $cookies.get('user');

    if(!session){
        $location.path('/401');
    }else{
        $scope.userSession = JSON.parse($cookies.get('user'));
        if($scope.userSession.role !== 'employee'){
            $location.path('/403');
        }
    }

    $scope.switch =  {
        toMyVacancies : () => {
            $location.path('myVacancies');
        },
        toMyFavorites : () => {
            $location.path('myFavorites');
        }   
    }

    $scope.retrieveFavoriteOnes = () => {
        $http({
            method: 'GET',
            url: 'http://localhost:8080/talenting/myfavoriteVacancies',
            params: {personId: $scope.userSession.person.id}
        }).then( response => {
            console.log(response);

            $scope.myFavoriteOnes = response.data;

        }).catch( err => {

        });
    };



    //to share one
    $scope.share = (vacancyId, index) => {

        let sharedOneDTO = { vacancy: {id: vacancyId}, person: {id: $scope.userSession.person.id} };

        $http({
            method: "POST",
            url: 'http://localhost:8080/talenting/sharedVacancies',
            data: sharedOneDTO
        }).then( response => {

            $scope.myFavoriteOnes[index].shared = response.data.id;
            alertService.showAlert.info('¡Has compartido una vacante!');

        });
    };

    $scope.unShare = (vacancyId, index) => {

        $http({
            method: "DELETE",
            url: 'http://localhost:8080/talenting/sharedVacancies',
            params: {vacancyId: vacancyId}
        }).then( () => {

            $scope.myFavoriteOnes[index].shared = 0;

        });
    };

    $scope.favorite = (vacancyId, index) => {

        let sharedOneDTO = { vacancy: {id: vacancyId}, person: {id: $scope.userSession.person.id} };

        $http({
            method: "POST",
            url: 'http://localhost:8080/talenting/favoriteVacancies',
            data: sharedOneDTO
        }).then( response => {

            $scope.myFavoriteOnes[index].favorite = response.data.id;

        });
    };

    $scope.unFavorite = (vacancyId, index) => {

        $http({
            method: "DELETE",
            url: 'http://localhost:8080/talenting/favoriteVacancies',
            params: {vacancyId: vacancyId}
        }).then( () => {

            $scope.myFavoriteOnes.splice(index, 1)
            alertService.showAlert.info('Se ha removido de su lista de favoritos');

            // $scope.myFavoriteOnes[index].favorite = 0;
        });
    };

    // to apply to a vacancy
    $scope.apply = (vacancyId, index) => {

        let applierInVacancy = { person: {id: $scope.userSession.person.id }, vacancy: {id: vacancyId}, status: 'En espera'}

        $http({
            method: "POST",
            url: 'http://localhost:8080/talenting/appliersInVacancies',
            data: applierInVacancy
        }).then( response => {
            $scope.myFavoriteOnes[index].applied = response.data.id;
            alertService.showAlert.info('¡Has aplicado para una vacante!');
        });
    };
    // to disapple to a vacancy
    $scope.disapply = (vacancyId, index) => {

        $http({
            method: "DELETE",
            url: 'http://localhost:8080/talenting/appliersInVacancies',
            params: {vacancyId: vacancyId}
        }).then( () => {

            $scope.myFavoriteOnes[index].applied = 0;
            
        });
    };

}]);