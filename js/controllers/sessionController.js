talenting.controller('sessionController', ['$scope', '$http', 'alertService', '$cookies', 
function($scope, $http, alertService, $cookies) {
    
    $http.defaults.headers.post["Content-Type"] = "application/json";

    $scope.frontVariables = {
        invalidForm: false
    };

    $scope.user = {};

    if($cookies.get('user')){
        window.location.replace('/');
    }
    

    $scope.login = () => {

        $http({
            method: "POST",
            url: 'http://localhost:8080/talenting/login',
            params: { username: $scope.user.username, password: $scope.user.password }
        }).then( response => {

            let user = response.data;

            if(user !== ""){

                $cookies.put('user', JSON.stringify(user));
                window.location.replace('/');

            }else{
                alertService.showAlert.error('El usuario y/o contraseña no son correctos');    
            }

        }).catch( err => {
            console.log(err);
            alertService.showAlert.error('Ha ocurrido un error por favor intentalo mas tarde');
        });
    }

    $scope.showAlert = () => {
        alertService.showAlert.warning('Ambos campos deben ser llenados');
        $scope.frontVariables.invalidForm = true;
    }


}])