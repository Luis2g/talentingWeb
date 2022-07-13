talenting.controller('vacancyController', 
['$scope', '$http', 'userService', 'alertService', '$cookies',
function($scope, $http, userService, alertService, $cookies) {

    $scope.states = [{"clave":"1","estado":"Aguascalientes","abreviatura":"Ags."},{"clave":"10","estado":"Durango","abreviatura":"Dgo."},{"clave":"11","estado":"Guanajuato","abreviatura":"Gto."},{"clave":"12","estado":"Guerrero","abreviatura":"Gro."},{"clave":"13","estado":"Hidalgo","abreviatura":"Hgo."},{"clave":"14","estado":"Jalisco","abreviatura":"Jal."},{"clave":"15","estado":"México","abreviatura":"Mex."},{"clave":"16","estado":"Michoac","abreviatura":"Mich."},{"clave":"17","estado":"Morelos","abreviatura":"Mor."},{"clave":"18","estado":"Nayarit","abreviatura":"Nay."},{"clave":"19","estado":"Nuevo Leon","abreviatura":"NL"},{"clave":"2","estado":"Baja California","abreviatura":"BC"},{"clave":"20","estado":"Oaxaca","abreviatura":"Oax."},{"clave":"21","estado":"Puebla","abreviatura":"Pue."},{"clave":"22","estado":"Queretaro","abreviatura":"Qro."},{"clave":"23","estado":"Quintana Roo","abreviatura":"Q. Roo"},{"clave":"24","estado":"San Luis Potosi","abreviatura":"SLP"},{"clave":"25","estado":"Sinaloa","abreviatura":"Sin."},{"clave":"26","estado":"Sonora","abreviatura":"Son."},{"clave":"27","estado":"Tabasco","abreviatura":"Tab."},{"clave":"28","estado":"Tamaulipas","abreviatura":"Tamps."},{"clave":"29","estado":"Tlaxcala","abreviatura":"Tlax."},{"clave":"3","estado":"Baja California Sur","abreviatura":"BCS"},{"clave":"30","estado":"Veracruz de Ignacio de la Llave","abreviatura":"Ver."},{"clave":"31","estado":"Yucatan","abreviatura":"Yuc."},{"clave":"32","estado":"Zacatecas","abreviatura":"Zac."},{"clave":"4","estado":"Campeche","abreviatura":"Camp."},{"clave":"5","estado":"Coahuila de Zaragoza","abreviatura":"Coah."},{"clave":"6","estado":"Colima","abreviatura":"Col."},{"clave":"7","estado":"Chiapas","abreviatura":"Chis."},{"clave":"8","estado":"Chihuahua","abreviatura":"Chih."},{"clave":"9","estado":"Ciudad de M","abreviatura":"CDMX"}];
    $scope.modalities = ['Presencial', 'Virtual', 'Híbrida'];
    $scope.types = ['Tiempo completo', 'Medio tiempo', 'Fines de semana', 'Horarios flexibles'];
    $scope.paymentFrecuencies = ['Hora', 'Día', 'Semana', 'Quincena', 'Mes', 'Año'];
    $scope.benefits = ['Uniformes gratuitos', 'Vales de despensa', 'Opción a base laboral', 'Caja de ahorro', 'Apoyo de transporte', 'Teléfono de la empresa', 'Estacionamiento gratuito', 'Seguro de gastos médicos', 'Seguro dental', 'Servicio de comedor', 'Seguro de vida', 'Seguro de la vista', 'Vacaciones superiores a las de la ley', 'Descuentos'];
    $scope.benefitsToSave = [];
    $scope.benefitsToUpdate = [];
    $scope.postedVacancies = [];
    $scope.fullVacancyToUpdate = {};
    $scope.index = 0;
    $scope.userSession;
    $scope.frontVariables = {
        inValidVacancyForm: false
    }

    

    if(!$cookies.get('user')){
        window.location.replace('/login');
    }else{
        $scope.userSession = JSON.parse($cookies.get('user'));
    }

    $scope.loadVacancyToUpdate = (fullVacancy, indexIn) => {
        $scope.openModalForUpdate();

        $scope.index = indexIn;

        let state = {};
        $scope.benefitsToUpdate = [];

        try{
            $scope.states.map( x => {
                if(x.estado === fullVacancy.vacancy.stateInWhichIsAvailable){
                    return state = x;
                }
            });

        }catch(err){
            state = fullVacancy.vacancy.stateInWhichIsAvailable;
        }


        fullVacancy.retrievedBenefits.map( x => {
            $scope.benefitsToUpdate.push(x.name)
        } );


        let startDateValue; 
        let validityDateValue;
        try{
            startDateValue = new Date(fullVacancy.vacancy.startDate.split('T')[0] + " 00:00:00");
            validityDateValue = new Date(fullVacancy.vacancy.validityDate.split('T')[0] + " 00:00:00");

        }catch(err) {
            startDateValue = fullVacancy.vacancy.startDate;
            validityDateValue = fullVacancy.vacancy.validityDate;
        }
        console.log('this is the vacancy to update ', fullVacancy);

        $scope.fullVacancyToUpdate = {vacancy: {...fullVacancy.vacancy, stateInWhichIsAvailable: state, startDate: startDateValue, validityDate: validityDateValue}};
    }

    // $scope.vacancy = {};


    $scope.retrieveUserVacancies = () => {
        $http({
            method: 'GET',
            url: 'http://localhost:8080/talenting/vacancies',
            params: { params: $scope.userSession.id }
        }).then( response => {

            $scope.postedVacancies = response.data;
            
        }, err => {
            console.log('This is the error ', err);
        });
    }

    $scope.addOrRemoveBenefit = (benefit) => {

        let benefitIndex = $scope.benefitsToSave.indexOf(benefit);
        if(benefitIndex === -1){
            $scope.benefitsToSave.push(benefit);
        }else{
            $scope.benefitsToSave.splice(benefitIndex, 1);
        }
    }
    $scope.addOrRemoveBenefitToUpdate = (benefit) => {

        let benefitIndex = $scope.benefitsToUpdate.indexOf(benefit);
        console.log(benefitIndex);
        if(benefitIndex === -1){
            $scope.benefitsToUpdate.push(benefit);
        }else{
            $scope.benefitsToUpdate.splice(benefitIndex, 1);
        }
    }

    $scope.registerVacancy = () => {

        let vacancyDTO = { vacancy : {...$scope.vacancy, status: true, employeer: {id: $scope.userSession.id}}, benefits: $scope.benefitsToSave }


        $http({
            method: 'POST',
            url: 'http://localhost:8080/talenting/vacancies',
            data: vacancyDTO
        }).then( response => {

            $scope.closeModalForRegistration();


            console.log(response);

            let fixing = [];

            $scope.benefitsToSave.map( x => {
                fixing.push({name: x});
            } );

            let vacancyRecentlyCreated = { vacancy: { ...response.data }, retrievedBenefits: [...fixing] }
        

            $scope.postedVacancies.push(vacancyRecentlyCreated);

            alertService.showAlert.success('La vacante se ha registrado correctamente');

            console.log($scope.postedVacancies);
            $scope.vacancy = {};
            $scope.frontVariables.inValidVacancyForm = false;
            
            alertService.showAlert.success('La vacante se ha registrado correctamente');
        }, () => {
            alertService.showAlert.error('La vacante no se ha podido registrar');
        });
    }


    $scope.updateVacancy = () => {

        let stateString = "";
        $scope.states.map( state => {
            if(state.estado === $scope.fullVacancyToUpdate.vacancy.stateInWhichIsAvailable.estado){
                stateString = state.estado;
            }
        } );

        let vacancyToUpdate = { vacancy:{...$scope.fullVacancyToUpdate.vacancy, stateInWhichIsAvailable: stateString}, benefits: $scope.benefitsToUpdate }

        console.log('this is the data im sending');
        console.log(vacancyToUpdate);

        $http({
            method: "PUT",
            url: 'http://localhost:8080/talenting/vacancies',
            data: vacancyToUpdate
            
        }).then( () => {


            $scope.closeModalForUpdate();
            alertService.showAlert.success("La vacante se ha actualizado correctamente");

            

            let benefitsToWord = [];
            vacancyToUpdate.benefits.map(x => {
                benefitsToWord.push({name: x});
            });
            vacancyToUpdate.retrievedBenefits = [...benefitsToWord]
            delete vacancyToUpdate.benefits;



            console.log(vacancyToUpdate);

            console.log('estes es el index en el response ', $scope.index);

            $scope.postedVacancies.splice($scope.index, 1, vacancyToUpdate);
            $scope.index = 0;

            
            
            
        } ).catch( err => {
            console.log(err);
        } );

    }

    $scope.showAlert = () => {
        $scope.frontVariables.inValidVacancyForm = true;
        Swal.fire({
            title: 'Verifica',
            text: "Necesitas llenar todos los campos de manera correcta",
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Entendido'
        });
    }

    console.log()

    $scope.enableOrDisable = (vacancy, index) => {

        let vacancyToUpdateStatus = {...vacancy};

        vacancyToUpdateStatus.status = !vacancyToUpdateStatus.status; 

        $http({
            method: "PUT",
            url: 'http://localhost:8080/talenting/vacancies/changeStatus',
            data: vacancyToUpdateStatus
        }).then( response => {
            console.log(response);

            $scope.postedVacancies[index].vacancy.status = vacancyToUpdateStatus.status;

            alertService.showAlert.success('Se ha cambiado el estado exitosamente');
        }).catch( err => {

            console.log(err);

            alertService.showAlert.error('Ha ocurrido un error en la actualización');
        } );
        
    }

    $scope.openModalForRegistration = () => {

        let registrationVacancy = new bootstrap.Modal(document.getElementById("registerVacancy"), {});
        $scope.vacancyRegistration.$setUntouched();
        $scope.vacancyRegistration.$setPristine();

        registrationVacancy.show();
    }

    $scope.openModalForUpdate = () => {

        let registrationVacancy = new bootstrap.Modal(document.getElementById("updatePostulation"), {});
        $scope.vacancyUpdate.$setUntouched();
        $scope.vacancyUpdate.$setPristine();

        registrationVacancy.show();
    }
    $scope.closeModalForRegistration = () => {

        var myModalEl = document.getElementById('registerVacancy');
        var modal = bootstrap.Modal.getInstance(myModalEl)
        modal.hide();
    }

    $scope.closeModalForUpdate = () => {

        var myModalEl = document.getElementById('updatePostulation');
        var modal = bootstrap.Modal.getInstance(myModalEl)
        modal.hide();
    }


}]);