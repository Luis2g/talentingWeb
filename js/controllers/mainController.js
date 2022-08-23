talenting.controller('mainController', ['$scope', '$http', '$location','userService', '$cookies', 'alertService', function($scope, $http, $location, userService, $cookies, alertService) {


    $http.defaults.headers.post["Content-Type"] = "application/json";
    $scope.availableVacancies = [];
    $scope.userSession;
    $scope.vacancies = {};
    $scope.states = [{ "clave": "1", "estado": "Aguascalientes", "abreviatura": "Ags." }, { "clave": "10", "estado": "Durango", "abreviatura": "Dgo." }, { "clave": "11", "estado": "Guanajuato", "abreviatura": "Gto." }, { "clave": "12", "estado": "Guerrero", "abreviatura": "Gro." }, { "clave": "13", "estado": "Hidalgo", "abreviatura": "Hgo." }, { "clave": "14", "estado": "Jalisco", "abreviatura": "Jal." }, { "clave": "15", "estado": "México", "abreviatura": "Mex." }, { "clave": "16", "estado": "Michoac", "abreviatura": "Mich." }, { "clave": "17", "estado": "Morelos", "abreviatura": "Mor." }, { "clave": "18", "estado": "Nayarit", "abreviatura": "Nay." }, { "clave": "19", "estado": "Nuevo Leon", "abreviatura": "NL" }, { "clave": "2", "estado": "Baja California", "abreviatura": "BC" }, { "clave": "20", "estado": "Oaxaca", "abreviatura": "Oax." }, { "clave": "21", "estado": "Puebla", "abreviatura": "Pue." }, { "clave": "22", "estado": "Queretaro", "abreviatura": "Qro." }, { "clave": "23", "estado": "Quintana Roo", "abreviatura": "Q. Roo" }, { "clave": "24", "estado": "San Luis Potosi", "abreviatura": "SLP" }, { "clave": "25", "estado": "Sinaloa", "abreviatura": "Sin." }, { "clave": "26", "estado": "Sonora", "abreviatura": "Son." }, { "clave": "27", "estado": "Tabasco", "abreviatura": "Tab." }, { "clave": "28", "estado": "Tamaulipas", "abreviatura": "Tamps." }, { "clave": "29", "estado": "Tlaxcala", "abreviatura": "Tlax." }, { "clave": "3", "estado": "Baja California Sur", "abreviatura": "BCS" }, { "clave": "30", "estado": "Veracruz de Ignacio de la Llave", "abreviatura": "Ver." }, { "clave": "31", "estado": "Yucatan", "abreviatura": "Yuc." }, { "clave": "32", "estado": "Zacatecas", "abreviatura": "Zac." }, { "clave": "4", "estado": "Campeche", "abreviatura": "Camp." }, { "clave": "5", "estado": "Coahuila de Zaragoza", "abreviatura": "Coah." }, { "clave": "6", "estado": "Colima", "abreviatura": "Col." }, { "clave": "7", "estado": "Chiapas", "abreviatura": "Chis." }, { "clave": "8", "estado": "Chihuahua", "abreviatura": "Chih." }, { "clave": "9", "estado": "Ciudad de M", "abreviatura": "CDMX" }];
    $scope.stateSelected;
    $scope.vacancyTitle;
    
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
    };

    $scope.filterVacancy = () => {
        if (($scope.vacancyTitle !== undefined) && ($scope.vacancyTitle !== "") && ($scope.stateSelected !== undefined) && ($scope.stateSelected !== null)) {
            let idToSend = $scope.userSession !== undefined ? $scope.userSession.person.id : 0;
            $http({
                method: "GET",
                url: 'http://localhost:8080/talenting/vacanciesAccordingToTitleAndState',
                params: { userId: idToSend, title: $scope.vacancyTitle, state: $scope.stateSelected }
            }).then(response => {

                $scope.availableVacancies = response.data

            });
        } else if (($scope.vacancyTitle === undefined || $scope.vacancyTitle === "") && ($scope.stateSelected !== undefined) && ($scope.stateSelected !== null)) {
            let idToSend = $scope.userSession !== undefined ? $scope.userSession.person.id : 0;
            $http({
                method: "GET",
                url: 'http://localhost:8080/talenting/vacanciesAccordingToFilter',
                params: { userId: idToSend, state: $scope.stateSelected }
            }).then(response => {

                $scope.availableVacancies = response.data

            });
        } else if (($scope.vacancyTitle !== undefined) && ($scope.vacancyTitle !== "") && ($scope.stateSelected === undefined || $scope.stateSelected === null)) {
            let idToSend = $scope.userSession !== undefined ? $scope.userSession.person.id : 0;
            $http({
                method: "GET",
                url: 'http://localhost:8080/talenting/vacanciesAccordingToTitle',
                params: { userId: idToSend, title: $scope.vacancyTitle }
            }).then(response => {

                $scope.availableVacancies = response.data

            });
        }
        else if(($scope.vacancyTitle === "" || $scope.vacancyTitle === undefined) && ($scope.stateSelected === null || $scope.stateSelected === undefined)){
            let idToSend = $scope.userSession !== undefined ? $scope.userSession.person.id : 0;
            $http({
                method: "GET",
                url: 'http://localhost:8080/talenting/vacanciesAccordingToFilter',
                params: { userId: idToSend, state: 'all' }
            }).then(response => {

                $scope.availableVacancies = response.data

            });
        }
    };

}]);