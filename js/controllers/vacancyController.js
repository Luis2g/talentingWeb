talenting.controller('vacancyController', 
['$scope', '$http', 'userService', 'alertService',
function($scope, $http, userService, alertService) {

    $scope.states = [{"clave":"1","estado":"Aguascalientes","abreviatura":"Ags."},{"clave":"10","estado":"Durango","abreviatura":"Dgo."},{"clave":"11","estado":"Guanajuato","abreviatura":"Gto."},{"clave":"12","estado":"Guerrero","abreviatura":"Gro."},{"clave":"13","estado":"Hidalgo","abreviatura":"Hgo."},{"clave":"14","estado":"Jalisco","abreviatura":"Jal."},{"clave":"15","estado":"México","abreviatura":"Mex."},{"clave":"16","estado":"Michoac","abreviatura":"Mich."},{"clave":"17","estado":"Morelos","abreviatura":"Mor."},{"clave":"18","estado":"Nayarit","abreviatura":"Nay."},{"clave":"19","estado":"Nuevo Leon","abreviatura":"NL"},{"clave":"2","estado":"Baja California","abreviatura":"BC"},{"clave":"20","estado":"Oaxaca","abreviatura":"Oax."},{"clave":"21","estado":"Puebla","abreviatura":"Pue."},{"clave":"22","estado":"Quer","abreviatura":"Qro."},{"clave":"23","estado":"Quintana Roo","abreviatura":"Q. Roo"},{"clave":"24","estado":"San Luis Potosi","abreviatura":"SLP"},{"clave":"25","estado":"Sinaloa","abreviatura":"Sin."},{"clave":"26","estado":"Sonora","abreviatura":"Son."},{"clave":"27","estado":"Tabasco","abreviatura":"Tab."},{"clave":"28","estado":"Tamaulipas","abreviatura":"Tamps."},{"clave":"29","estado":"Tlaxcala","abreviatura":"Tlax."},{"clave":"3","estado":"Baja California Sur","abreviatura":"BCS"},{"clave":"30","estado":"Veracruz de Ignacio de la Llave","abreviatura":"Ver."},{"clave":"31","estado":"Yucatan","abreviatura":"Yuc."},{"clave":"32","estado":"Zacatecas","abreviatura":"Zac."},{"clave":"4","estado":"Campeche","abreviatura":"Camp."},{"clave":"5","estado":"Coahuila de Zaragoza","abreviatura":"Coah."},{"clave":"6","estado":"Colima","abreviatura":"Col."},{"clave":"7","estado":"Chiapas","abreviatura":"Chis."},{"clave":"8","estado":"Chihuahua","abreviatura":"Chih."},{"clave":"9","estado":"Ciudad de M","abreviatura":"CDMX"}];
    $scope.modalities = ['Presencial', 'Virtual', 'Híbrida'];
    $scope.types = ['Tiempo completo', 'Medio tiempo', 'Fines de semana', 'Horarios flexibles'];
    $scope.paymentFrecuencies = ['Hora', 'Día', 'Semana', 'Quincena', 'Mes', 'Año'];
    $scope.benefits = ['Uniformes gratuitos', 'Vales de despensa', 'Opción a base laboral', 'Caja de ahorro', 'Apoyo de transporte', 'Teléfono de la empresa', 'Estacionamiento gratuito', 'Seguro de gastos médicos', 'Seguro dental', 'Servicio de comedor', 'Seguro de vida', 'Seguro de la vista', 'Vacaciones superiores a las de la ley', 'Descuentos'];
    $scope.benefitsToSave = [];
    $scope.postedVacancies = [];
    $scope.vacancyToUpdate = {};
    $scope.frontVariables = {
        inValidVacancyForm: false
    }

    $scope.loadVacancyToUpdate = (vacancy) => {

        let state = {};

        $scope.states.map( x => {
            if(x.estado === vacancy.stateInWhichIsAvailable){
                return state = x;
            }
        });

        let startDateValue = new Date(vacancy.startDate.split('T')[0] + " 00:00:00");
        let validityDateValue = new Date(vacancy.validityDate.split('T')[0] + " 00:00:00");

        console.log('this is the vacancy to update ', vacancy);

        $scope.vacancyToUpdate = {...vacancy, stateInWhichIsAvailable: state, startDate: startDateValue, validityDate: validityDateValue};
    }

    $scope.vacancy = {};
    console.log(userService.setUser({luis: "nombre"}));

    $scope.retrieveUserVacancies = () => {
        $http({
            method: 'GET',
            url: 'http://localhost:8080/talenting/vacancies',
            params: { params: 1 }
        }).then( response => {
            $scope.postedVacancies = response.data;
            console.log($scope.postedVacancies);
            
        }, err => {
            console.log('This is the error ', err);
        });
    }

    $scope.addOrRemoveBenefit = (benefit) => {

        let benefitIndex = $scope.benefitsToSave.indexOf(benefit);
        console.log(benefitIndex);
        if(benefitIndex === -1){
            $scope.benefitsToSave.push(benefit);
        }else{
            $scope.benefitsToSave.splice(benefitIndex, 1);
        }
    }

    $scope.registerVacancy = () => {

        let vacancyDTO = { vacancy : {...$scope.vacancy, employeer: {id: 1}}, benefits: $scope.benefitsToSave }

        $http({
            method: 'POST',
            url: 'http://localhost:8080/talenting/vacancies',
            data: vacancyDTO
        }).then( () => {
            console.log('it\'s coming to where i want it to go');
            alertService.showAlert.success('La vacante se ha registrado correctamente');
        }, () => {
            alertService.showAlert.error('La vacante no se ha podido registrar');
        });
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




}]);