talenting.controller('userController', ['$scope', '$http', '$location','userService', '$cookies', function($scope, $http, $location, userService, $cookies) {
  $scope.states = [{"clave":"1","estado":"Aguascalientes","abreviatura":"Ags."},{"clave":"10","estado":"Durango","abreviatura":"Dgo."},{"clave":"11","estado":"Guanajuato","abreviatura":"Gto."},{"clave":"12","estado":"Guerrero","abreviatura":"Gro."},{"clave":"13","estado":"Hidalgo","abreviatura":"Hgo."},{"clave":"14","estado":"Jalisco","abreviatura":"Jal."},{"clave":"15","estado":"México","abreviatura":"Mex."},{"clave":"16","estado":"Michoacan","abreviatura":"Mich."},{"clave":"17","estado":"Morelos","abreviatura":"Mor."},{"clave":"18","estado":"Nayarit","abreviatura":"Nay."},{"clave":"19","estado":"Nuevo Leon","abreviatura":"NL"},{"clave":"2","estado":"Baja California","abreviatura":"BC"},{"clave":"20","estado":"Oaxaca","abreviatura":"Oax."},{"clave":"21","estado":"Puebla","abreviatura":"Pue."},{"clave":"22","estado":"Queretaro","abreviatura":"Qro."},{"clave":"23","estado":"Quintana Roo","abreviatura":"Q. Roo"},{"clave":"24","estado":"San Luis Potosi","abreviatura":"SLP"},{"clave":"25","estado":"Sinaloa","abreviatura":"Sin."},{"clave":"26","estado":"Sonora","abreviatura":"Son."},{"clave":"27","estado":"Tabasco","abreviatura":"Tab."},{"clave":"28","estado":"Tamaulipas","abreviatura":"Tamps."},{"clave":"29","estado":"Tlaxcala","abreviatura":"Tlax."},{"clave":"3","estado":"Baja California Sur","abreviatura":"BCS"},{"clave":"30","estado":"Veracruz de Ignacio de la Llave","abreviatura":"Ver."},{"clave":"31","estado":"Yucatan","abreviatura":"Yuc."},{"clave":"32","estado":"Zacatecas","abreviatura":"Zac."},{"clave":"4","estado":"Campeche","abreviatura":"Camp."},{"clave":"5","estado":"Coahuila de Zaragoza","abreviatura":"Coah."},{"clave":"6","estado":"Colima","abreviatura":"Col."},{"clave":"7","estado":"Chiapas","abreviatura":"Chis."},{"clave":"8","estado":"Chihuahua","abreviatura":"Chih."},{"clave":"9","estado":"Ciudad de M","abreviatura":"CDMX"}];
  $scope.states2 = [{"clave":"1","state":"Aguascalientes","abreviatura":"Ags."},{"clave":"10","state":"Durango","abreviatura":"Dgo."},{"clave":"11","state":"Guanajuato","abreviatura":"Gto."},{"clave":"12","state":"Guerrero","abreviatura":"Gro."},{"clave":"13","state":"Hidalgo","abreviatura":"Hgo."},{"clave":"14","state":"Jalisco","abreviatura":"Jal."},{"clave":"15","state":"México","abreviatura":"Mex."},{"clave":"16","state":"Michoacan","abreviatura":"Mich."},{"clave":"17","state":"Morelos","abreviatura":"Mor."},{"clave":"18","state":"Nayarit","abreviatura":"Nay."},{"clave":"19","state":"Nuevo Leon","abreviatura":"NL"},{"clave":"2","state":"Baja California","abreviatura":"BC"},{"clave":"20","state":"Oaxaca","abreviatura":"Oax."},{"clave":"21","state":"Puebla","abreviatura":"Pue."},{"clave":"22","state":"Queretaro","abreviatura":"Qro."},{"clave":"23","state":"Quintana Roo","abreviatura":"Q. Roo"},{"clave":"24","state":"San Luis Potosi","abreviatura":"SLP"},{"clave":"25","state":"Sinaloa","abreviatura":"Sin."},{"clave":"26","state":"Sonora","abreviatura":"Son."},{"clave":"27","state":"Tabasco","abreviatura":"Tab."},{"clave":"28","state":"Tamaulipas","abreviatura":"Tamps."},{"clave":"29","state":"Tlaxcala","abreviatura":"Tlax."},{"clave":"3","state":"Baja California Sur","abreviatura":"BCS"},{"clave":"30","state":"Veracruz de Ignacio de la Llave","abreviatura":"Ver."},{"clave":"31","state":"Yucatan","abreviatura":"Yuc."},{"clave":"32","state":"Zacatecas","abreviatura":"Zac."},{"clave":"4","state":"Campeche","abreviatura":"Camp."},{"clave":"5","state":"Coahuila de Zaragoza","abreviatura":"Coah."},{"clave":"6","state":"Colima","abreviatura":"Col."},{"clave":"7","state":"Chiapas","abreviatura":"Chis."},{"clave":"8","state":"Chihuahua","abreviatura":"Chih."},{"clave":"9","state":"Ciudad de M","abreviatura":"CDMX"}];
  $scope.person = {};
  $scope.user = {};
  $scope.contactInformation = {};
  $scope.employeer = {};

  $scope.contactState = {};
  $scope.employeerState = {};
  $scope.userForChangePassword = {}
  $scope.enableSendButton = false;
  $scope.enableChangePassword = false;
  $scope.isEmployeer=false;

  $scope.frontVariables = {
    userType: "",
    passwordConfirmation: "",
    invalidForm: false,
    isValidTheConfirmationPassword: true
  };
  $scope.flagEnable = false;

  $scope.path = window.location.toString()
  $scope.session = $cookies.get('user');
  if($scope.session != undefined){
    $scope.session2 = {}
    $scope.session2 = JSON.parse($scope.session);
  }
  

  ($scope.initialFunction = async() => {
    $scope.idUser = $scope.session2.id
    await $http({
      method: 'GET',
      url: 'http://localhost:8080/talenting/users/'+$scope.idUser,
    }).then( (data) => {
      $scope.session = data.data
    }, err => {
      console.log("Ocurrio un error al consultar usuarios")    
    });
    return $scope.session;
  })();
  
  
  if($scope.session !== undefined){
    $scope.session = JSON.parse($scope.session);
  }
  
  $scope.enableForm = () =>{
    $scope.flagEnable = true;

  }

  $scope.disableForm = () =>{
    $scope.flagEnable = false;
  }

  $scope.enableButton = () =>{
    if($scope.person.name != undefined){
      $scope.enableSendButton = true;
    }
  }

  $scope.copyStateCompany = () => {
    let state = document.getElementById('stateCompany')
    let selected = state.options[state.selectedIndex].text
    $scope.employeer.stateTheCompanyIsIn = selected;
  }

  $scope.loadData = async() =>{
    $scope.session = await $scope.initialFunction();
    
    if($scope.session != undefined){
      $scope.person = $scope.session.person
      $scope.contactInformation = $scope.session.person.contactInformation
      $scope.contactState.state = $scope.contactInformation.state;
      $scope.user = $scope.session 
      $scope.person.dateOfBirth = new Date($scope.person.dateOfBirth.split('T')[0]+' 00:00:00')
      
      if($scope.session.role === 'employeer'){
        $scope.isEmployeer = true;
        let id = $scope.session.id
        $http({
          method: 'GET',
          url: 'http://localhost:8080/talenting/employeersByPersonId/'+id,
        }).then( (data) => {
          $scope.employeer = data.data
          $scope.employeerState.state = $scope.employeer.stateTheCompanyIsIn;
        }, err => {
          console.log("Ocurrio un error al consultar employeers")    
        });
      }
    }
  }

  $scope.updateInformation = () =>{
    $scope.contactInformation.state = $scope.contactState.state;
      
    let userDTO = $scope.prepareDTO();

      $http({
        method: 'POST',
        url: 'http://localhost:8080/talenting/people',
        data: userDTO
      }).then( (data) => {
        $scope.session = data.data
        Swal.fire({
          title: 'Listo!',
          text: 'Se actualizó la información correctamente!',
          icon: 'success',
          showConfirmButton: false,
          timer: 5000
        }).then( () => {
         $scope.session = userDTO;
         $scope.disableForm();
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

  $scope.enableChangePasswordButton = () =>{
    if($scope.userForChangePassword.oldPassword && $scope.userForChangePassword.password && $scope.userForChangePassword.passwordConfirmation){
      $scope.enableChangePassword = true;
    }else{
      $scope.enableChangePassword = false;
    }
  }


  $scope.sendDataChangePassword = () =>{
    if($scope.userForChangePassword.oldPassword && $scope.userForChangePassword.password && $scope.userForChangePassword.passwordConfirmation){
      $scope.enableChangePassword = true;
      if($scope.userForChangePassword.password === $scope.userForChangePassword.passwordConfirmation){
          // Pasa todos los filtros
          let userChangePasswordDTO = {
            idUser : $scope.user.id,
            oldPassword : $scope.userForChangePassword.oldPassword,
            password : $scope.userForChangePassword.password 
          }

          $http({
            method: 'POST',
            url: 'http://localhost:8080/talenting/people/changePassword',
            data: userChangePasswordDTO
          }).then( (data) => {
            if(data.data.id !==0){
              Swal.fire({
                title: 'Listo!',
                text: 'Se actualizó la contraseña correctamente!',
                icon: 'success',
                showConfirmButton: false,
                timer: 5000
              }).then( () => {
                $scope.disableForm();
                $scope.userForChangePassword = {}
              });
            }else{
              Swal.fire({
                title: 'Ups!',
                text: 'La contraseña ingresada no es correcta, vuelve a intentarlo',
                icon: 'error',
                showConfirmButton: false,
                timer: 5000
              }).then( () => {
                
              });
            }
            
          }, err => {   
            Swal.fire({
              title: 'Error',
              text: "Parece que ha ocurrido un error, intenta mas tarde",
              icon: 'warning',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Entendido'
            });
      
          });
      }else{
        Swal.fire({
          title: 'Atención',
          text: "Las contraseñas no coinciden, vuelve a ingresarlas",
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Entendido'
        });
        $scope.userForChangePassword.password = undefined
        $scope.userForChangePassword.passwordConfirmation = undefined
      }
    }else{
      $scope.enableChangePassword = false;
      Swal.fire({
        title: 'Atención',
        text: "Debes llenar todos los campos para cambiar la contraseña",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido'
      });
    }
  }

 
  if($cookies.get('user') && !$scope.path.includes('profile')){
      window.location.replace('/');
  }

  //console.log('probando contraolladro '+$scope.session.person.dateOfBirth);

  $scope.validPassword = () => {

    if($scope.user.password === $scope.frontVariables.passwordConfirmation){
      $scope.frontVariables.isValidTheConfirmationPassword = true;
    }else{
      $scope.frontVariables.isValidTheConfirmationPassword = false;
    }

  }

  // $cookies.put("probando", JSON.stringify({ luis: "jimenez", apellido: 'probando' }));

  // console.log(JSON.parse($cookies.get('probando')));

  $http.defaults.headers.post["Content-Type"] = "application/json";

  $scope.prepareDTO2 = () =>{
    
    let userDTO = {}
    if($scope.session.role === 'employeer'){
      userDTO = {employeer:{...$scope.employeer}}
    }else{
      userDTO = {
        user: {
          ...$scope.user,
          person:{
            ...$scope.person,
            contactInformation:{
              ...$scope.contactInformation
            }
          }
        }
      }
    }
    return userDTO;
  }

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