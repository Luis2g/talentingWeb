talenting.controller('vacancyController', 
['$scope', '$http', 'userService',
function($scope, $http, userService) {

    $scope.states = [{"clave":"1","estado":"Aguascalientes","abreviatura":"Ags."},{"clave":"10","estado":"Durango","abreviatura":"Dgo."},{"clave":"11","estado":"Guanajuato","abreviatura":"Gto."},{"clave":"12","estado":"Guerrero","abreviatura":"Gro."},{"clave":"13","estado":"Hidalgo","abreviatura":"Hgo."},{"clave":"14","estado":"Jalisco","abreviatura":"Jal."},{"clave":"15","estado":"México","abreviatura":"Mex."},{"clave":"16","estado":"Michoac","abreviatura":"Mich."},{"clave":"17","estado":"Morelos","abreviatura":"Mor."},{"clave":"18","estado":"Nayarit","abreviatura":"Nay."},{"clave":"19","estado":"Nuevo Leon","abreviatura":"NL"},{"clave":"2","estado":"Baja California","abreviatura":"BC"},{"clave":"20","estado":"Oaxaca","abreviatura":"Oax."},{"clave":"21","estado":"Puebla","abreviatura":"Pue."},{"clave":"22","estado":"Quer","abreviatura":"Qro."},{"clave":"23","estado":"Quintana Roo","abreviatura":"Q. Roo"},{"clave":"24","estado":"San Luis Potosi","abreviatura":"SLP"},{"clave":"25","estado":"Sinaloa","abreviatura":"Sin."},{"clave":"26","estado":"Sonora","abreviatura":"Son."},{"clave":"27","estado":"Tabasco","abreviatura":"Tab."},{"clave":"28","estado":"Tamaulipas","abreviatura":"Tamps."},{"clave":"29","estado":"Tlaxcala","abreviatura":"Tlax."},{"clave":"3","estado":"Baja California Sur","abreviatura":"BCS"},{"clave":"30","estado":"Veracruz de Ignacio de la Llave","abreviatura":"Ver."},{"clave":"31","estado":"Yucatan","abreviatura":"Yuc."},{"clave":"32","estado":"Zacatecas","abreviatura":"Zac."},{"clave":"4","estado":"Campeche","abreviatura":"Camp."},{"clave":"5","estado":"Coahuila de Zaragoza","abreviatura":"Coah."},{"clave":"6","estado":"Colima","abreviatura":"Col."},{"clave":"7","estado":"Chiapas","abreviatura":"Chis."},{"clave":"8","estado":"Chihuahua","abreviatura":"Chih."},{"clave":"9","estado":"Ciudad de M","abreviatura":"CDMX"}];
    $scope.modalities = ['Presencial', 'Virtual', 'Híbrida'];
    $scope.types = ['Tiempo completo', 'Medio tiempo', 'Fines de semana', 'Horarios flexibles'];
    $scope.paymentFrecuencies = ['Hora', 'Día', 'Semana', 'Quincena', 'Mes', 'Año'];
    // $scope.benefits = [{id: 1, name: 'Uniformes gratuitos'}, {id: 1, name: 'Vales de despensa'}];
    $scope.benefits = ['Uniformes gratuitos', 'Vales de despensa', 'Opción a base laboral', 'Caja de ahorro', 'Apoyo de transporte', 'Teléfono de la empresa', 'Estacionamiento gratuito', 'Seguro de gastos médicos', 'Seguro dental', 'Servicio de comedor', 'Seguro de vida', 'Seguro de la vista', 'Vacaciones superiores a las de la ley', 'Descuentos'];
    $scope.benefitsToSave = [];
    $scope.frontVariables = {
        inValidVacancyForm: false
    }

    $scope.vacancy = {};
    console.log(userService.setUser({luis: "nombre"}));

    $scope.addOrRemoveBenefit = (benefit) => {

        console.log('here');
        let benefitIndex = $scope.benefitsToSave.indexOf(benefit);
        console.log(benefitIndex);
        if(benefitIndex === -1){
            $scope.benefitsToSave.push(benefit);
        }else{
            $scope.benefitsToSave.splice(benefitIndex, 1);
        }
    }

    $scope.registerVacancy = () => {
        console.log('it\'s getting to where it should');

        let vacancyDTO = { vacancy : {...$scope.vacancy, employeer: {id: 1}}, benefits : $scope.benefitsToSave }

        console.log('this is what im sending ', vacancyDTO);

        $http({
            method: 'POST',
            url: 'http://localhost:8080/talenting/vacancies',
            data: vacancyDTO
        }).then( response => {
            console.log(response);
        }, err => {
        
            console.log(err);
    
        });

    }


}]);