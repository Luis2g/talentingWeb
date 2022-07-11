talenting.controller('userController', ['$scope', '$http', function($scope, $http) {
  $scope.states = [{"clave":"1","estado":"Aguascalientes","abreviatura":"Ags."},{"clave":"10","estado":"Durango","abreviatura":"Dgo."},{"clave":"11","estado":"Guanajuato","abreviatura":"Gto."},{"clave":"12","estado":"Guerrero","abreviatura":"Gro."},{"clave":"13","estado":"Hidalgo","abreviatura":"Hgo."},{"clave":"14","estado":"Jalisco","abreviatura":"Jal."},{"clave":"15","estado":"México","abreviatura":"Mex."},{"clave":"16","estado":"Michoac","abreviatura":"Mich."},{"clave":"17","estado":"Morelos","abreviatura":"Mor."},{"clave":"18","estado":"Nayarit","abreviatura":"Nay."},{"clave":"19","estado":"Nuevo Leon","abreviatura":"NL"},{"clave":"2","estado":"Baja California","abreviatura":"BC"},{"clave":"20","estado":"Oaxaca","abreviatura":"Oax."},{"clave":"21","estado":"Puebla","abreviatura":"Pue."},{"clave":"22","estado":"Quer","abreviatura":"Qro."},{"clave":"23","estado":"Quintana Roo","abreviatura":"Q. Roo"},{"clave":"24","estado":"San Luis Potosi","abreviatura":"SLP"},{"clave":"25","estado":"Sinaloa","abreviatura":"Sin."},{"clave":"26","estado":"Sonora","abreviatura":"Son."},{"clave":"27","estado":"Tabasco","abreviatura":"Tab."},{"clave":"28","estado":"Tamaulipas","abreviatura":"Tamps."},{"clave":"29","estado":"Tlaxcala","abreviatura":"Tlax."},{"clave":"3","estado":"Baja California Sur","abreviatura":"BCS"},{"clave":"30","estado":"Veracruz de Ignacio de la Llave","abreviatura":"Ver."},{"clave":"31","estado":"Yucatan","abreviatura":"Yuc."},{"clave":"32","estado":"Zacatecas","abreviatura":"Zac."},{"clave":"4","estado":"Campeche","abreviatura":"Camp."},{"clave":"5","estado":"Coahuila de Zaragoza","abreviatura":"Coah."},{"clave":"6","estado":"Colima","abreviatura":"Col."},{"clave":"7","estado":"Chiapas","abreviatura":"Chis."},{"clave":"8","estado":"Chihuahua","abreviatura":"Chih."},{"clave":"9","estado":"Ciudad de M","abreviatura":"CDMX"}];
  $scope.person = {};
  $scope.contactInformation = {};
  $scope.employeer = {};
  $scope.frontVariables = {
    userType: ""
  };

  $http.defaults.headers.post["Content-Type"] = "application/json";

  $scope.prepareDTO = () => {
    let userDTO = {
      user: {
        ...$scope.user,
        person: { 
          ...$scope.person,
          contactInformation: {
            ...$scope.contactInformation
          }
        }
      }
    };
    if($scope.user.role === 'employeer'){
      userDTO = { ...userDTO, employeer: { ...$scope.employeer } }
    }
    return userDTO;
  }

  $scope.registerUser = () => {

    let userDTO = $scope.prepareDTO();

    console.log(userDTO);

    $http({
      method: 'POST',
      url: 'http://localhost:8080/talenting/people',
      data: userDTO
    }).then( response => {
        console.log(response);
    }, err => {
      
      console.log(err);

    });

  }


}]);