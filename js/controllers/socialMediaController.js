talenting.controller('socialMediaController', ['$scope', '$http', '$location','userService', '$cookies', function($scope, $http, $location, userService, $cookies) {


    $scope.sharedVacancies = [];
    $scope.sharedVacaniesRaw = [];
    $scope.toShow = [];

    $scope.userSession;
    
    let session = $cookies.get('user');

    if(session){
        $scope.userSession = JSON.parse($cookies.get('user'));
        console.log($scope.userSession);
    }else{
        $scope.userSession
    }

    $scope.retrieveSharedVacancies = () => {
        $http({
            method: "GET",
            url: 'http://localhost:8080/talenting/socialMedia',
            params: {personId: $scope.userSession.person.id}
        }).then( response => {

            $scope.sharedVacanciesRaw = [...response.data]
            console.log($scope.sharedVacanciesRaw.length)
            console.log(response.data);

            $scope.preparedSharedVacancies()
            
        });
    }

    $scope.preparedSharedVacancies = () => {
        $scope.sharedVacancies = [...$scope.sharedVacanciesRaw];
        console.log($scope.sharedVacancies);

        let indexes = [];

        $scope.myNumber = 0;

        let counter = 0;

        for(let i = 0; i < $scope.sharedVacancies.length; i++){

            console.log('entra 1');

            for(let j = 0; j < $scope.sharedVacanciesRaw.length; j++){
                console.log('entra 1');

                if($scope.sharedVacancies[i].vacancy.id ===  $scope.sharedVacanciesRaw[j].vacancy.id){
                    counter ++;
                    console.log(counter);
                    console.log('entra 1');

                    if(counter > 1){

                        let personWhoSharedIt = $scope.sharedVacanciesRaw[i].personWhoSharedIt;
                        indexes.push(
                            {
                                personId: personWhoSharedIt.id,
                                repeatedIndex: i,
                                idVacancy: $scope.sharedVacanciesRaw[j].vacancy.id,
                                peopleWhoSharedIt: personWhoSharedIt.name + ' ' + personWhoSharedIt.surname + ' ' + personWhoSharedIt.secondSurname 
                            }
                        );

                    }
                }
            }
            counter = 0;
        }
        console.log(indexes);

        $scope.deleteRepeatedIndexAndAddNamesFromFriends(indexes);
    }

    $scope.deleteRepeatedIndexAndAddNamesFromFriends = (indexes) => {

        console.log($scope.sharedVacancies);

        let toShowToShow = [...$scope.sharedVacancies]

        let counterIn = 0;

        let myVariable = {};


        indexes.map(x => {
            
            if(x.personId !== $scope.userSession.person.id){

                let names = $scope.sharedVacancies[x.repeatedIndex].personWhoSharedIt;

                console.log(names)

                myVariable = $scope.sharedVacancies.find( obj => obj.vacancy.id === x.idVacancy);
                if(myVariable.names === undefined){
                    myVariable.names = [];
                }
                myVariable.names.push(names);
                console.log(myVariable);
                toShowToShow.splice(counterIn, 1, myVariable);

                toShowToShow.splice(x.repeatedIndex, 1, "luis");

                counterIn++;
            }

        });

        console.log(toShowToShow);

        toShowToShow = toShowToShow.filter( x => x !== "luis");

        //to delete repeated names
        toShowToShow.map( x => {
            console.log(x.names);
            if(x.names !== undefined){

                x.names = x.names.filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t.place === value.place && t.name === value.name
                    ))
                )
            }

        });

        


        $scope.toShow = toShowToShow


       

        console.log($scope.toShow)
    };

}]);