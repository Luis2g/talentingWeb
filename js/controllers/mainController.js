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
                    $scope.availableVacancies[index].applied = 0;
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
    
    $scope.openModalInformation = (fullVacancy) => {
        console.log(fullVacancy);
        $scope.vacancies = angular.copy(fullVacancy);
        $("#infoPostulation").modal("show");

    };


    // INICIO DE GESTIÓN DE CORREOS

    $scope.idCuenta = "630cce4546413763c6b1b0e1";
    $scope.apiKey = "HynpY4dSSJqRVazpEq9dTg";
    $scope.listaActualizar = [];
    $scope.contacto = [];

    $scope.guardarLista = () => {
        console.log($scope.nombreLista);
        let nombreLista = $scope.nombreLista;
        $http({
            method: "POST",
            url: "https://mailifyapis.com/v1/lists",
            data: {"name": nombreLista},
            headers:{
                Accountid: $scope.idCuenta,
                Apikey: $scope.apiKey,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then( response => {
            $scope.consultarLista();
            $("#listaModal").modal("hide");
            $scope.nombreLista = '';
        });
    }

    $scope.consultarLista = () => {
        $http({
            method: "GET",
            url: 'https://mailifyapis.com/v1/lists?offset=0',
            headers: {
                Accountid: $scope.idCuenta,
                Apikey: $scope.apiKey
            }
        }).then( response => {
            $scope.listas = response.data;
        });
    }

    $scope.consultarListaPorId = (lista) => {
        $scope.listaActualizar = angular.copy(lista);
        console.log(lista)
        $("#actualizarLista").modal("show");
    }

    $scope.actualizarLista = (lista) => {
        console.log(lista.name);
        $http({
            method: "PUT",
            url: 'https://mailifyapis.com/v1/lists/'+lista.id,
            data: {"name": lista.name, readOnly: false},
            headers: {
                Accountid: $scope.idCuenta,
                Apikey: $scope.apiKey
            }
        }).then( response => {
            $scope.consultarLista();
            $("#actualizarLista").modal("hide");
            $scope.nombreListaActualizar = '';
        });
    }

    $scope.eliminarLista = (id) => {
        swal.fire({
            title: "Confirmación de eliminación de lista",
            text: "¿Estás seguro de eliminar la lista?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'Si',
            confirmButtonColor: '#3085d6',
            cancelButtonText: 'No'
        }).then(async (isConfirm) => {
            if (isConfirm.value){    
                $http({
                    method: "DELETE",
                    url: 'https://mailifyapis.com/v1/lists/'+id,
                    headers: {
                        Accountid: $scope.idCuenta,
                        Apikey: $scope.apiKey
                    }
                }).then( response => {
                    $scope.consultarLista();
                });
            }
        });
        
    }


    $scope.consultarContacto = (lista) => {
        $http({
            method: "GET",
            url: 'https://mailifyapis.com/v1/lists/'+lista.id+'/contacts?offset=0',
            headers: {
                Accountid: $scope.idCuenta,
                Apikey: $scope.apiKey
            }
        }).then( response => {
            $scope.listaSeleccionadaContacto = angular.copy(lista);
            $scope.contactos = response.data;
            console.log(response);
            $("#consultarContacto").modal("show");
        });
    }

    $scope.agregarContacto = (lista) => {
        console.log(lista);
        $scope.contacto.lista = lista;
        $("#contactoModal").modal("show");
    }

    $scope.guardarContacto = (contacto) => {
        $http({
            method: "POST",
            url: 'https://mailifyapis.com/v1/lists/'+contacto.lista.id+'/contacts',
            data: {"email": contacto.email, "phone": contacto.telefono},
            headers:{
                Accountid: $scope.idCuenta,
                Apikey: $scope.apiKey,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then( response => {
            $scope.consultarLista();
            $("#contactoModal").modal("hide");
            $scope.contacto.email = '';
            $scope.contacto.telefono = '';
        });
    }

    $scope.consultarContactoPorId = (contacto) => {
        console.log(contacto);
        $scope.contactoActualizado = angular.copy(contacto);
        $scope.contactoActualizado.listaSeleccionadaContacto = $scope.listaSeleccionadaContacto;
        $("#actualizarContacto").modal("show");
    }

    $scope.actualizarContacto = (contacto) => {
        console.log(contacto);
        $http({
            method: "PUT",
            url: 'https://mailifyapis.com/v1/lists/'+$scope.contactoActualizado.listaSeleccionadaContacto.id+'/contacts/'+contacto.id,
            data: {"email": contacto.email, "phone": contacto.phone},
            headers: {
                Accountid: $scope.idCuenta,
                Apikey: $scope.apiKey
            }
        }).then( response => {
            $scope.consultarContacto($scope.contactoActualizado.listaSeleccionadaContacto);
            $("#actualizarContacto").modal("hide");
            $scope.nombreListaActualizar = '';
        });
    }

    $scope.eliminarContacto = (contacto) => {
        swal.fire({
            title: "Confirmación de eliminación de contacto",
            text: "¿Estás seguro de eliminar el contacto?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'Si',
            confirmButtonColor: '#3085d6',
            cancelButtonText: 'No'
        }).then(async (isConfirm) => {
            if (isConfirm.value){    
                $http({
                    method: "DELETE",
                    url: 'https://mailifyapis.com/v1/lists/'+$scope.listaSeleccionadaContacto.id+'/contacts/'+contacto.id,
                    headers: {
                        Accountid: $scope.idCuenta,
                        Apikey: $scope.apiKey
                    }
                }).then( response => {
                    $scope.consultarContacto($scope.listaSeleccionadaContacto);
                });
            }
        });
    }

    $scope.consultarCampania = () => {
        //?offset=0&search=campaign&state=DRAFT
        $http({
            method: "GET",
            url: 'https://mailifyapis.com/v1/campaigns',
            headers: {
                Accountid: $scope.idCuenta,
                Apikey: $scope.apiKey,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then( response => {
            $scope.campanias = response.data;
        });
    }

    $scope.guardarCampania = (campania) => {
        console.log(campania);
        $http({
            method: "POST",
            url: 'https://mailifyapis.com/v1/campaigns/email',
            data: {"name": campania.nombre, "emailFrom": campania.email, "aliasFrom": campania.alias, "emailReplyTo": campania.email, "aliasReplyTo": campania.alias, "subject": campania.asunto},
            headers: {
                Accountid: $scope.idCuenta,
                Apikey: $scope.apiKey,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then( response => {
            $scope.consultarCampania();
            $("#agregarCampania").modal("hide");
            $scope.campania.nombre = '';
            $scope.campania.email = '';
            $scope.campania.alias = '';
            $scope.campania.asunto = '';
        });
    }

    $scope.asignarListaCampania = [];

    $scope.consultarCampaniaPorId = (campania) => {
        $scope.asignarListaCampaniaObj = angular.copy(campania);
        console.log($scope.asignarListaCampaniaObj);
        $('#asignarLista').modal("show");
    }

    $scope.asignarListaCampania = (lista) => {
        console.log(lista);
        console.log($scope.asignarListaCampaniaObj);
        $http({
            method: "POST",
            url: 'https://mailifyapis.com/v1/campaigns/'+$scope.asignarListaCampaniaObj.id+'/list',
            data: {"listId": lista.id},
            headers: {
                Accountid: $scope.idCuenta,
                Apikey: $scope.apiKey,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(response => {
            $scope.consultarCampania();
            $('#asignarLista').modal("hide");
            console.log(response);
        });
    }
    $scope.asignarPlantillaCampaniaObj = [];
    $scope.consultarDetallesCampania = (campania) => {
        console.log(campania);
        $http({
            method: "GET",
            url: 'https://mailifyapis.com/v1/campaigns/'+campania.id,
            headers: {
                Accountid: $scope.idCuenta,
                Apikey: $scope.apiKey
            }
        }).then( response => {
            $scope.detallesDeCampania = response.data;
            console.log(response.data.campaign);
            console.log($scope.detallesDeCampania);
        });
        $('#detallesCampania').modal("show");
    }

    $scope.consultarPlantillaCampania = (campania) => {
        $scope.asignarPlantillaCampaniaObj = angular.copy(campania);
        $http({
            method: "GET",
            url: 'https://mailifyapis.com/v1/templates',
            headers: {
                Accountid: $scope.idCuenta,
                Apikey: $scope.apiKey
            }
        }).then( response => {
            $scope.plantillas = response.data.templates;
            console.log(response.data);
        });
        $('#asignarPlantilla').modal("show");
    }

    $scope.asignarPlantillaCampania = (plantilla) => {
        console.log(plantilla);
        console.log($scope.asignarPlantillaCampaniaObj);
        $http({
            method: "POST",
            url: 'https://mailifyapis.com/v1/campaigns/'+$scope.asignarPlantillaCampaniaObj.id+'/content',
            data: {"templateId": plantilla.id},
            headers: {
                Accountid: $scope.idCuenta,
                Apikey: $scope.apiKey,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(response => {
            $scope.consultarCampania();
            $('#asignarPlantilla').modal("hide");
            console.log(response);
        });
    }

    $scope.enviarCorreos = (campania) => {
        swal.fire({
            title: "Confirmación de envio de correos",
            text: "¿Estás seguro de enviar los correos?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'Si',
            confirmButtonColor: '#3085d6',
            cancelButtonText: 'No'
        }).then(async (isConfirm) => {
            if (isConfirm.value){    
                $http({
                    method: "POST",
                    url: 'https://mailifyapis.com/v1/campaigns/'+campania.id+'/send',
                    headers: {
                        Accountid: $scope.idCuenta,
                        Apikey: $scope.apiKey
                    }
                }).then( response => {
                    console.log((response))
                    $scope.consultarCampania();
                });
            }
        });
    }

    // FIN DE GESTIÓN DE CORREOS

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