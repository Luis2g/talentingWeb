talenting.controller('userController', ['$scope', '$http', '$location','userService', '$cookies', function($scope, $http, $location, userService, $cookies) {
  $scope.states = [{"clave":"1","estado":"Aguascalientes","abreviatura":"Ags."},{"clave":"10","estado":"Durango","abreviatura":"Dgo."},{"clave":"11","estado":"Guanajuato","abreviatura":"Gto."},{"clave":"12","estado":"Guerrero","abreviatura":"Gro."},{"clave":"13","estado":"Hidalgo","abreviatura":"Hgo."},{"clave":"14","estado":"Jalisco","abreviatura":"Jal."},{"clave":"15","estado":"México","abreviatura":"Mex."},{"clave":"16","estado":"Michoacan","abreviatura":"Mich."},{"clave":"17","estado":"Morelos","abreviatura":"Mor."},{"clave":"18","estado":"Nayarit","abreviatura":"Nay."},{"clave":"19","estado":"Nuevo Leon","abreviatura":"NL"},{"clave":"2","estado":"Baja California","abreviatura":"BC"},{"clave":"20","estado":"Oaxaca","abreviatura":"Oax."},{"clave":"21","estado":"Puebla","abreviatura":"Pue."},{"clave":"22","estado":"Queretaro","abreviatura":"Qro."},{"clave":"23","estado":"Quintana Roo","abreviatura":"Q. Roo"},{"clave":"24","estado":"San Luis Potosi","abreviatura":"SLP"},{"clave":"25","estado":"Sinaloa","abreviatura":"Sin."},{"clave":"26","estado":"Sonora","abreviatura":"Son."},{"clave":"27","estado":"Tabasco","abreviatura":"Tab."},{"clave":"28","estado":"Tamaulipas","abreviatura":"Tamps."},{"clave":"29","estado":"Tlaxcala","abreviatura":"Tlax."},{"clave":"3","estado":"Baja California Sur","abreviatura":"BCS"},{"clave":"30","estado":"Veracruz de Ignacio de la Llave","abreviatura":"Ver."},{"clave":"31","estado":"Yucatan","abreviatura":"Yuc."},{"clave":"32","estado":"Zacatecas","abreviatura":"Zac."},{"clave":"4","estado":"Campeche","abreviatura":"Camp."},{"clave":"5","estado":"Coahuila de Zaragoza","abreviatura":"Coah."},{"clave":"6","estado":"Colima","abreviatura":"Col."},{"clave":"7","estado":"Chiapas","abreviatura":"Chis."},{"clave":"8","estado":"Chihuahua","abreviatura":"Chih."},{"clave":"9","estado":"Ciudad de M","abreviatura":"CDMX"}];
  $scope.person = {};
  $scope.user = {};
  $scope.contactInformation = {};
  $scope.employeer = {};
  $scope.frontVariables = {
    userType: "",
    passwordConfirmation: "",
    invalidForm: false,
    isValidTheConfirmationPassword: true
  };


  if($cookies.get('user')){
      window.location.replace('/');
  }

  console.log('probando contraolladro');

  $scope.validPassword = () => {

    console.log('it gets to the check passwords', $scope.user.password, '  ', $scope.frontVariables.passwordConfirmation)

    if($scope.user.password === $scope.frontVariables.passwordConfirmation){
      $scope.frontVariables.isValidTheConfirmationPassword = true;
    }else{
      $scope.frontVariables.isValidTheConfirmationPassword = false;
    }

  }

  // $cookies.put("probando", JSON.stringify({ luis: "jimenez", apellido: 'probando' }));

  // console.log(JSON.parse($cookies.get('probando')));

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
    }).then( () => {

      Swal.fire({
        title: 'Listo!',
        text: 'Se ha registrado correctamente!, ahora debes iniciar sesión',
        icon: 'success',
        showConfirmButton: false,
        timer: 5000
      }).then( () => {

        window.location.replace('/login');
        $scope.$apply();
      });
    }, err => {
      
      Swal.fire({
        title: 'Error',
        text: "Parece que ha ocurrido un error, intenta mas tarde",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido'
      });

    });

  }

  $scope.showAlert = () => {

    $scope.frontVariables.invalidForm = true;

    Swal.fire({
      title: 'Verifica',
      text: "Necesitas llenar todos los campos de manera correcta",
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Entendido'
    });
  }


}]);