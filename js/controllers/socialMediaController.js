talenting.controller('socialMediaController', ['$scope', '$http', '$location','userService', '$cookies', 'alertService', function($scope, $http, $location, userService, $cookies, alertService) {


    $scope.sharedVacancies = [];
    $scope.people = [];
    $scope.friends = [];

    $scope.userSession;
    
    let session = $cookies.get('user');

    if(session){
        $scope.userSession = JSON.parse($cookies.get('user'));
    }else{
        $scope.userSession
    }

    $scope.retrieveSharedVacancies = () => {
        $http({
            method: "GET",
            url: 'http://localhost:8080/talenting/socialMedia',
            params: {personId: $scope.userSession.person.id}
        }).then( response => {

            $scope.sharedVacancies = response.data;

            $scope.sharedVacancies.map( vacancy => {
                vacancy.peopleWhoSharedIt.map( person => {
                    if(person.id === $scope.userSession.id){
                        vacancy.you = true;
                    }else{
                        vacancy.you = false;
                    }
                });
            });
            
        });
    };

    $scope.getPeopleToAddAsFriends = () => {
        $http({
            method: 'GET',
            url: 'http://localhost:8080/talenting/getPeople',
            params: { personId: $scope.userSession.person.id }
        }).then( response => {
            $scope.people = response.data;
            $scope.getFriends();
        });
    };

    $scope.getFriends = () =>{
        $http({
            method: 'GET',
            url: 'http://localhost:8080/talenting/getFriends',
            params: { personId: $scope.userSession.person.id }
        }).then( response => {
            $scope.friends = response.data;
        });
    };

    $scope.deleteFriend = (friendId) =>{
        $http({
            method: 'DELETE',
            url: 'http://localhost:8080/talenting/deleteFriend',
            params: { personId: $scope.userSession.person.id, friendId: friendId }
        }).then( response => {
            $scope.getPeopleToAddAsFriends();
            $scope.getFriends();
        });
    };

    $scope.sendFriendshipRequest = ( personId, index ) => {

        let friendshipRequest = {person: {id: $scope.userSession.id}, friend: {id: personId}}
        $http({
            method: 'POST',
            url: 'http://localhost:8080/talenting/sendFriendshipRequest',
            data: friendshipRequest 
        }).then( response => {
            $scope.people[index].id = response.data.id
            $scope.people[index].whoSentIt = 'me';
            alertService.showAlert.info('¡Se ha enviado la solicitud de amistad!');
        })

    };

    $scope.cancelFriendshipRequest = ( requestId, index ) => {
        $http({
            method: 'DELETE',
            url: 'http://localhost:8080/talenting/cancelFriendshipRequest',
            params: { requestId: requestId } 
        }).then( () => {
            $scope.people[index].whoSentIt = null 
            alertService.showAlert.info('¡Se ha cancelado la solicitud!');
        })

    };

    $scope.confirmFriendshipRequest = ( requestId, index ) => {

        $http({
            method: 'PUT',
            url: 'http://localhost:8080/talenting/confirmFriendshipRequest',
            params: { requestId: requestId }
        }).then( () => {
            $scope.friends.push($scope.people[index].person);
            $scope.people.splice(index, 1);
            alertService.showAlert.info('¡Ahora son amigos!');
        })

    };

    $scope.rejectFriendshipRequest = ( requestId, index ) => {

        $http({
            method: 'DELETE',
            url: 'http://localhost:8080/talenting/rejectFriendshipRequest',
            params: { requestId: requestId }
        }).then( () => {
            $scope.people[index].whoSentIt = null;
            alertService.showAlert.info('¡Hecho!');
        })

    };

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
            $scope.sharedVacancies[index].applied = response.data.id;
            alertService.showAlert.info('¡Has aplicado para una vacante!');
        });
    };

    // to disapple to a vacancy
    $scope.disapply = (vacancyId, index) => {


        Swal.fire({
            title: '¿Estas seguro?',
            text: "Si retiras tu postulación todo tu proceso de contratación será cancelado",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#198754',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $http({
                    method: "DELETE",
                    url: 'http://localhost:8080/talenting/appliersInVacancies',
                    params: {vacancyId: vacancyId}
                }).then( () => {
                    $scope.sharedVacancies[index].applied = 0;
                    alertService.showAlert.info('¡Se ha retirado tu postulación!');
                });
            }
        })
    };
    

    //to share one
    $scope.share = (vacancyId, index) => {

        let sharedOneDTO = { vacancy: {id: vacancyId}, person: {id: $scope.userSession.person.id} };

        $http({
            method: "POST",
            url: 'http://localhost:8080/talenting/sharedVacancies',
            data: sharedOneDTO
        }).then( response => {

            $scope.sharedVacancies[index].shared = response.data.id;
            $scope.sharedVacancies[index].you = true;
            alertService.showAlert.info('¡Has compartido una vacante!');

        });
    };

    $scope.unShare = (vacancyId, index) => {

        $http({
            method: "DELETE",
            url: 'http://localhost:8080/talenting/sharedVacancies',
            params: {vacancyId: vacancyId}
        }).then( () => {
            $scope.sharedVacancies[index].you = false;
            $scope.sharedVacancies[index].shared = 0;

        });
    };

    $scope.favorite = (vacancyId, index) => {

        let sharedOneDTO = { vacancy: {id: vacancyId}, person: {id: $scope.userSession.person.id} };

        $http({
            method: "POST",
            url: 'http://localhost:8080/talenting/favoriteVacancies',
            data: sharedOneDTO
        }).then( response => {

            $scope.sharedVacancies[index].favorite = response.data.id;

        });
    };

    $scope.unFavorite = (vacancyId, index) => {

        $http({
            method: "DELETE",
            url: 'http://localhost:8080/talenting/favoriteVacancies',
            params: {vacancyId: vacancyId}
        }).then( () => {

            $scope.sharedVacancies[index].favorite = 0;
        });
    };


    $scope.openModalInformation = (fullVacancy) => {

        $scope.vacancies = angular.copy(fullVacancy);
        $("#infoPostulation").modal("show");

    };

}]);