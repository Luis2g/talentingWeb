talenting.controller('mainController', ['$scope', '$http', '$location','userService', '$cookies', 'alertService', function($scope, $http, $location, userService, $cookies, alertService) {


    $http.defaults.headers.post["Content-Type"] = "application/json";
    $scope.availableVacancies = [];
    $scope.userSession;
    $scope.vacancies = {};
    
    let session = $cookies.get('user');

    if(session){
        $scope.userSession = JSON.parse($cookies.get('user'));
        console.log($scope.userSession);
    }else{
        $scope.userSession
    }

    $scope.retrieveVacancies = () => {
        
        let idToSend = $scope.userSession !== undefined ? $scope.userSession.person.id : 0;

        $http({
            method: "GET",
            url: 'http://localhost:8080/talenting/vacanciesAccordingToFilter',
            params: {userId: idToSend, state: 'all'}
        }).then( response => {

            console.log(response);

            $scope.availableVacancies = response.data

        });
    }


    // to apply to a vacancy
    $scope.apply = (vacancyId, index) => {

        let applierInVacancy = { 
            person: {id: $scope.userSession.person.id }, 
            vacancy: {id: vacancyId}, status: 'En espera'
        }

        $http({
            method: "POST",
            url: 'http://localhost:8080/talenting/appliersInVacancies',
            data: applierInVacancy
        }).then( response => {
            $scope.availableVacancies[index].applied = response.data.id;
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

            $scope.availableVacancies[index].applied = 0;
            
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

            $scope.availableVacancies[index].shared = response.data.id;
            alertService.showAlert.info('¡Has compartido una vacante!');

        });
    };

    $scope.unShare = (vacancyId, index) => {

        $http({
            method: "DELETE",
            url: 'http://localhost:8080/talenting/sharedVacancies',
            params: {vacancyId: vacancyId}
        }).then( () => {

            $scope.availableVacancies[index].shared = 0;

        });
    };

    $scope.favorite = (vacancyId, index) => {

        let sharedOneDTO = { vacancy: {id: vacancyId}, person: {id: $scope.userSession.person.id} };

        $http({
            method: "POST",
            url: 'http://localhost:8080/talenting/favoriteVacancies',
            data: sharedOneDTO
        }).then( response => {

            $scope.availableVacancies[index].favorite = response.data.id;

        });
    };

    $scope.unFavorite = (vacancyId, index) => {

        $http({
            method: "DELETE",
            url: 'http://localhost:8080/talenting/favoriteVacancies',
            params: {vacancyId: vacancyId}
        }).then( () => {

            $scope.availableVacancies[index].favorite = 0;
        });
    };
    
    $scope.openModalInformation = (index) => {
        console.log(index);
        console.log($scope.availableVacancies);;
        $("#infoPostulation").modal("show");
        $scope.vacancies = angular.copy($scope.availableVacancies.find(e =>
                e.vacancy.id === index
            ));
        console.log($scope.vacancies);
    }

}]);