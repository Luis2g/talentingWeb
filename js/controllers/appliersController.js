talenting.controller('appliersController',
    ['$scope', '$http', '$location', 'userService', '$cookies', 'alertService',
        function ($scope, $http, $location, userService, $cookies, alertService) {
            $scope.email;
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
                        let company = $scope.vacancy.employeer.companyName
                        $scope.email = $scope.vacancy.employeer.companyName
                        let mail = {
                            to: applier.person.contactInformation.email,
                            subject: 'Notificación Talenting.',
                            content: 'Tu Curriculim Vitae ha sido visualizado por la empresa '+company+' a la cual te has postulado.', 
                        }
                        $http({
                            method: 'POST',
                            url: 'http://localhost:8080/talenting/sendNotification',
                            data: mail
                        }).then(response => {

                            let company = $scope.vacancy.employeer.companyName
    
                            let mail = {
                                to: applier.person.contactInformation.email,
                                subject: 'Notificación Talenting.',
                                content: 'Tu Curriculim Vitae ha sido visualizado por la empresa '+company+' a la cual te has postulado.', 
                            }
                        }, err => {
                        });
                        
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
                            let company = $scope.vacancy.employeer.companyName
                            if(status === 'Rechazado'){
                                let mail = {
                                    to: applier.person.contactInformation.email,
                                    subject: 'Notificación Talenting.',
                                    content: 'Tu solicitud para la vacante de la empresa '+company+' a la cual te has postulado, ha sido rechazada.', 
                                }
                                $http({
                                    method: 'POST',
                                    url: 'http://localhost:8080/talenting/sendNotification',
                                    data: mail
                                }).then(response => {
    
                                    let company = $scope.vacancy.employeer.companyName
            
                                    let mail = {
                                        to: applier.person.contactInformation.email,
                                        subject: 'Notificación Talenting.',
                                        content: 'Tu Curriculim Vitae ha sido visualizado por la empresa '+company+' a la cual te has postulado.', 
                                    }
                                }, err => {
                                });
                            }else if(status ==='Contratado'){
                                let mail = {
                                    to: applier.person.contactInformation.email,
                                    subject: 'Notificación Talenting.',
                                    content: '¡Felicidades!, te informamos que la empresa '+company+' te ha contratado, se contactarán contigo lo más pronto posible', 
                                }
                                $http({
                                    method: 'POST',
                                    url: 'http://localhost:8080/talenting/sendNotification',
                                    data: mail
                                }).then(response => {
    
                                    let company = $scope.vacancy.employeer.companyName
            
                                    let mail = {
                                        to: applier.person.contactInformation.email,
                                        subject: 'Notificación Talenting.',
                                        content: 'Tu Curriculim Vitae ha sido visualizado por la empresa '+company+' a la cual te has postulado.', 
                                    }
                                }, err => {
                                });
                            }
                            
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
                $scope.email = applier.person.contactInformation.email
                $scope.modal = new bootstrap.Modal(document.getElementById("interviewModal"), {});
                $scope.interviewModalRegister.$setUntouched();
                $scope.interviewModalRegister.$setPristine();

                $scope.modal.show();
            };

            $scope.formatDate = (date) => {
                let ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date);
                let mo = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(date);
                let da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(date);
                return  ye + "-" + mo + "-" + da;
            }


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
                    let company = $scope.vacancy.employeer.companyName
                    let fechaAgendada = $scope.formatDate($scope.interviewDate)
                    let mail = {
                            to: $scope.email,
                            subject: 'Notificación Talenting.',
                            content: 'La empresa '+company+' ha agendado una entravista de trabajo para la fecha: '+fechaAgendada, 
                        }
                        $http({
                            method: 'POST',
                            url: 'http://localhost:8080/talenting/sendNotification',
                            data: mail
                        }).then(response => {

                            let company = $scope.vacancy.employeer.companyName
    
                            let mail = {
                                to: applier.person.contactInformation.email,
                                subject: 'Notificación Talenting.',
                                content: 'Tu Curriculim Vitae ha sido visualizado por la empresa '+company+' a la cual te has postulado.', 
                            }
                        }, err => {
                        });
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