talenting.controller('appliersController',
    ['$scope', '$http', '$location', 'userService', '$cookies', 'alertService',
        function ($scope, $http, $location, userService, $cookies, alertService) {

            $scope.vacancy = JSON.parse(localStorage.getItem('vacancy'));
            $scope.appliers = {};
            $scope.applierInterview = [];
            $scope.now = Date.now();
            $scope.today = new Date($scope.now);
            $scope.today = $scope.today.toJSON().slice(0, 10);
            $scope.interviewDate;
            $scope.modal;
            $scope.frontVariables = {
                inValidInterviewForm: false
            }
            $http.defaults.headers.post["Content-Type"] = "application/json";

            $scope.loadAppliersByVacancy = () => {
                if ($scope.vacancy.id === undefined) {
                    $location.path('/vacancyRegistration');
                } else {
                    $http({
                        method: 'GET',
                        url: 'http://localhost:8080/talenting/appliersList',
                        params: { vacancyId: $scope.vacancy.id }
                    }).then(response => {
                        $scope.appliers = response.data;
                    }, err => {
                    });
                }
            };

            $scope.changeStatus = (status, applier) => {
                let id = applier.id;
                if (status === 'CV visto' && applier.status === 'En espera') {
                    $http({
                        method: 'POST',
                        url: 'http://localhost:8080/talenting/changeAppliersStatus',
                        params: { status: status, id: id }
                    }).then(response => {
                        $scope.loadAppliersByVacancy();
                    }, err => {
                    });
                }
            };

            $scope.changeOtherStatus = (status, applier) => {
                Swal.fire({
                    title: 'Cambiando el estado de la solicitud',
                    text: 'Desea cambiar el estado de la solicitud a ' + status,
                    icon: 'warning',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonColor: '#65D069',
                    cancelButtonColor: '#E07577',
                    cancelButtonText: 'No',
                    confirmButtonText: 'Sí',                    
                }).then((result) =>{
                    if(result.isConfirmed){
                        let id = applier.id;
                        $http({
                            method: 'POST',
                            url: 'http://localhost:8080/talenting/changeAppliersStatus',
                            params: { status: status, id: id }
                        }).then(response => {
                            alertService.showAlert.success('Se ha modificado el estado de la solicitud exitosamente');
                            $scope.loadAppliersByVacancy();
                        }, err => {
                            alertService.showAlert.error('Ocurrio un error al cambiar el estado de la solicitud');
                        });
                    }else{
                        Swal.fire({
                            title: '',
                            text: 'No se ha modificado el estado de la solicitud',
                            icon: 'warning',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Ok'
                        });
                    }
                });                
            };

            $scope.openModalInterview = (applier) => {
                $scope.applierInterview = applier;
                $scope.modal = new bootstrap.Modal(document.getElementById("interviewModal"), {});
                $scope.interviewModalRegister.$setUntouched();
                $scope.interviewModalRegister.$setPristine();

                $scope.modal.show();
            };

            $scope.setInterviewDate = () => {
                let date = new Date($scope.interviewDate);
                $scope.applierInterview.interviewDate = date.toJSON().slice(0, 10);;
                $scope.applierInterview.status = 'Entrevista';
                $http({
                    method: 'POST',
                    url: 'http://localhost:8080/talenting/appliersInVacancies',
                    data: $scope.applierInterview
                }).then(response => {
                    alertService.showAlert.success('Se ha registrado la entrevista exitosamente');
                    $scope.interviewDate = "";
                    $scope.modal.hide();
                }, err => {
                    alertService.showAlert.error('Ocurrio un error al registrar la entrevista');
                });
            };

            $scope.showAlert = () => {
                $scope.frontVariables.inValidInterviewForm = true;
                Swal.fire({
                    title: 'Verifica',
                    text: "Necesitas llenar todos los campos de manera correcta",
                    icon: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Entendido'
                });
            };

        }]);