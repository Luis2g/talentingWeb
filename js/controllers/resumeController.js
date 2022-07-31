talenting.controller('resumeController', ['$scope', '$http', '$location','userService', '$cookies', 'alertService', function($scope, $http, $location, userService, $cookies, alertService) {

    $scope.userSession;
    $scope.myFavoriteOnes = [];

    $scope.languages = ["Español","Inglés", "Francés", "Alemán", "Chino", "Portugués", "Ruso", "Italiano", "Indu", "Árabe", "Japonés", "Coreano", "Otro"];
    
    $scope.languagesLevel = ["A1","A2", "B1", "B2", "C1","C2"];

    $scope.typeCourse= ["Curso","Certificación"];

    $scope.resume = [];
    $scope.listCourses = [];
    var generateIdCourse = 0;
    $scope.listHabilities = [];
    var generateIdHability = 0;
    $scope.listLanguages = [];
    var generateIdLanguage = 0;


    $scope.showCourses = false;
    $scope.showHabilities = false;
    $scope.showLanguages = false;

    $scope.blockAddCourse = true;
    $scope.blockAddHability = true;
    $scope.blockAddLanguage = true;

    var languageValidation = true;

    $scope.alertLanguageValidation = false;

    let session = $cookies.get('user');

    if(!session){
        $location.path('/401');
    }else{
        $scope.userSession = JSON.parse($cookies.get('user'));
        if($scope.userSession.role !== 'employee'){
            $location.path('/403');
        }
    }

    $scope.switch =  {
        toMyVacancies : () => {
            $location.path('myVacancies');
        },
        toMyFavorites : () => {
            $location.path('myFavorites');
        }   
    }

    $scope.uploadCV = function() {
        var file = document.getElementById('resumeOnPDF').files[0],
        r = new FileReader();

        r.onloadend = function(e) {
            var data = e.target.result;
            console.log(data);
        }

        r.readAsBinaryString(file);
        console.log();
    }

    $scope.prepareDTO = () => {
        $scope.listCourses.map(x => {
            delete x.id;
        })
        $scope.listLanguages.map(x => {
            delete x.id;
        })
        $scope.listHabilities.map(x => {
            delete x.id;
        })
        $scope.session = JSON.parse(session);

        console.log($scope.session.person)
        $scope.resume.person = $scope.session.person;
        let resumeDTO = {
          resume: {
            ...$scope.resume,
            courses: { 
                ...$scope.listCourses,
            },
            languages: { 
                ...$scope.listLanguages,
            },
            habilities: { 
            ...$scope.listHabilities,
            },
          }
        };
        return resumeDTO;
      }

    
    $scope.addCourse = (course) => {
        if($scope.formCourse.nameCourse.$error.required){
            $scope.formCourse.nameCourse.$error.required = true;
            $scope.formCourse.nameCourse.$touched = true;
        }else if($scope.formCourse.institute.$error.required){
            $scope.formCourse.institute.$error.required = true;
            $scope.formCourse.institute.$touched = true;
        }else if( $scope.formCourse.type.$error.required){
            $scope.formCourse.type.$error.required = true;
            $scope.formCourse.type.$touched = true;
        }else if($scope.formCourse.expedition.$error.required){
            $scope.formCourse.expedition.$error.required = true;
            $scope.formCourse.expedition.$touched = true;
        }else{
            generateIdCourse = generateIdCourse + 1;
            course.id = generateIdCourse;

            $scope.listCourses.push(course);

            $scope.course = null;

            $scope.formCourse.nameCourse.$error.required = false;
            $scope.formCourse.nameCourse.$touched = false;
            $scope.formCourse.institute.$error.required = false;
            $scope.formCourse.institute.$touched = false;
            $scope.formCourse.type.$error.required = false;
            $scope.formCourse.type.$touched = false;
            $scope.formCourse.expedition.$error.required = false;
            $scope.formCourse.expedition.$touched = false;

            $scope.showCourses = true;
        }
    }

    $scope.deleteCourse = (course) => {
        for(i = 0; i < $scope.listCourses.length; i++){
            if($scope.listCourses[i].id === course.id){
                $scope.listCourses.splice(i, 1);
            }
        }
        if($scope.listCourses.length === 0){
            $scope.showCourses = false;
        }
    }

    $scope.hasCourses = (hasCourses) => {
        if(hasCourses){
            $scope.showModuleCourses = true;
        }else{
            $scope.showModuleCourses = false;
        }
    }

    $scope.addHability = (hability) => {
        if($scope.formHability.hability.$error.required ){
            $scope.alertEmptyInputs();
            $scope.formHability.hability.$error.required = true;
            $scope.formHability.hability.$touched = true;
        }else{
            generateIdHability = generateIdHability + 1;
            hability.id = generateIdHability;
            $scope.listHabilities.push(hability);

            $scope.hability = null;
            
            $scope.formHability.hability.$error.required = false;
            $scope.formHability.hability.$touched = false;

            $scope.showHabilities = true;
        }
    }

    $scope.deleteHability = (hability) => {
        for(i = 0; i < $scope.listHabilities.length; i++){
            if($scope.listHabilities[i].id === hability.id){
                $scope.listHabilities.splice(i, 1);
            }
        }
        if($scope.listHabilities.length === 0){
            $scope.showHabilities = false;
        }
    }

    $scope.addLanguage = (language) => {
        $scope.alertLanguageValidation = false;
        if($scope.formLanguage.language.$error.required){
            $scope.alertEmptyInputs();
            $scope.formLanguage.language.$error.required = true;
            $scope.formLanguage.language.$touched = true;
        }else{
            if($scope.listLanguages.length >= 1){
                for(i = 0; i < $scope.listLanguages.length; i++){
                    if(language.name === $scope.listLanguages[i].name){
                        languageValidation = true;
                        break;
                    }else{
                        languageValidation = false;
                    }
                }
                if(languageValidation){
                    $scope.alertLanguageValidation = true;
                }else{
                    generateIdLanguage = generateIdLanguage + 1;
                    language.id = generateIdLanguage;
        
                    $scope.listLanguages.push(language);
        
                    $scope.language = null;
        
                    $scope.formLanguage.language.$error.required = false;
                    $scope.formLanguage.language.$touched = false;
        
                    $scope.showLanguages = true;
                }
            }else{
                generateIdLanguage = generateIdLanguage + 1;
                language.id = generateIdLanguage;
    
                $scope.listLanguages.push(language);
    
                $scope.language = null;
    
                $scope.formLanguage.language.$error.required = false;
                $scope.formLanguage.language.$touched = false;
    
                $scope.showLanguages = true;

            }
        }
    }

    $scope.deleteLanguage = (language) => {
        for(i = 0; i < $scope.listLanguages.length; i++){
            if($scope.listLanguages[i].id === language.id){
                $scope.listLanguages.splice(i, 1);
            }
        }
        if($scope.listLanguages.length === 0){
            $scope.showLanguages = false;
        }
    }

    $scope.addResume = () => {
        if($scope.formResume.title.$error.required){
            $scope.alertEmptyInputs();
            $scope.formResume.title.$error.required = true;
            $scope.formResume.title.$touched = true;
        }else if($scope.formResume.description.$error.required){
            $scope.alertEmptyInputs();
            $scope.formResume.description.$error.required = true;
            $scope.formResume.description.$touched = true;
        }else if($scope.formResume.hasExperience.$error.required){
            $scope.alertEmptyInputs();
            $scope.formResume.hasExperience.$error.required = true;
            $scope.formResume.hasExperience.$touched = true;
        }else if($scope.formResume.expertise.$error.required){
            $scope.alertEmptyInputs();
            $scope.formResume.expertise.$error.required = true;
            $scope.formResume.expertise.$touched = true;
        }else if($scope.formResume.schoolPreparation.$error.required){
            $scope.alertEmptyInputs();
            $scope.formResume.schoolPreparation.$error.required = true;
            $scope.formResume.schoolPreparation.$touched = true;
        }else if($scope.listHabilities.length < 3){
            Swal.fire({
                title: 'Sin habilidades',
                text: "Necesitas agregar almenos 3 habilidades",
                icon: 'info',
                showConfirmButton: false,
                timer:5000
              });
        }else if($scope.listLanguages.length < 1){
            Swal.fire({
                title: 'Sin lenguages',
                text: "Necesitas agregar almenos 1 lenguage",
                icon: 'info',
                showConfirmButton: false,
                timer:5000
              });
        }else if($scope.listCourses.length < 1){
            swal.fire({
                title: "Sin cursos/certificaciones agregados",
                text: "¿Estás seguro de guardar tu CV sin cursos o certificaciones?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: 'Si',
                confirmButtonColor: '#3085d6',
                cancelButtonText: 'No'
            }).then((isConfirm) => {

                if (isConfirm.value){

                    // var file = document.getElementById('resumeOnPDF').files[0],
                    // r = new FileReader();

                    // r.onloadend = function(e) {
                    //     var data = e.target.result;
                    //     $scope.resume.Pdf = data;
                    // }
                    // r.readAsBinaryString(file);

                    var listCoursesObject = [];
                    var listHabilitiesObject = [];
                    var listLanguagesObject = [];
                    listCoursesObject = $scope.listCourses;
                    listHabilitiesObject = $scope.listHabilities;
                    listLanguagesObject = $scope.listLanguages;
            
                    $scope.resume.course = listCoursesObject;
                    $scope.resume.hability = listHabilitiesObject;
                    $scope.resume.language = listLanguagesObject;
                    $scope.formResume.title.$error.required
                    $scope.formResume.description.$error.required
                    $scope.formResume.hasExperience.$error.required
                    $scope.formResume.expertise.$error.required
                    $scope.formResume.schoolPreparation.$error.required
                    Swal.fire({
                        title: '¡Listo!',
                        text: 'Guardando información...',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 5000
                    });
                    console.log($scope.resume);
                } else {
                    Swal.fire({
                        title: 'Guardado cancelado',
                        text: "Registra tus cursos/certificaciones",
                        icon: 'info',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Entendido'
                    });
                }
            });
        }else{
            console.log($scope.prepareDTO());
            swal.fire({
                title: "Guardar información",
                text: "¿Desea guardar los datos de su Curriculum Vitae?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: 'Si',
                confirmButtonColor: '#3085d6',
                cancelButtonText: 'No'
            }).then((isConfirm) => {

                if (isConfirm.value){

                    // var listCoursesObject = [];
                    // var listHabilitiesObject = [];
                    // var listLanguagesObject = [];
                    // listCoursesObject = $scope.listCourses;
                    // listHabilitiesObject = $scope.listHabilities;
                    // listLanguagesObject = $scope.listLanguages;
            
                    // $scope.resume.course = listCoursesObject;
                    // $scope.resume.hability = listHabilitiesObject;
                    // $scope.resume.language = listLanguagesObject;

                    let resumeDTO = $scope.prepareDTO();
                    // $scope.formResume.title.$error.required
                    // $scope.formResume.description.$error.required
                    // $scope.formResume.hasExperience.$error.required
                    // $scope.formResume.expertise.$error.required
                    // $scope.formResume.schoolPreparation.$error.required

                    $http({
                        method: 'POST',
                        url: 'http://localhost:8080/talenting/resumes',
                        data: resumeDTO
                      }).then( () => {
                  
                        Swal.fire({
                            title: '¡Listo!',
                            text: 'Guardando información...',
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

                    // var file = document.getElementById('resumeOnPDF').files[0],
                    // r = new FileReader();

                    // r.onloadend = function(e) {
                    //     var data = e.target.result;
                    //     $scope.resume.Pdf = data;
                    // }
                    // r.readAsBinaryString(file);

                    // var listCoursesObject = [];
                    // var listHabilitiesObject = [];
                    // var listLanguagesObject = [];
                    // listCoursesObject = $scope.listCourses;
                    // listHabilitiesObject = $scope.listHabilities;
                    // listLanguagesObject = $scope.listLanguages;
            
                    // $scope.resume.course = listCoursesObject;
                    // $scope.resume.hability = listHabilitiesObject;
                    // $scope.resume.language = listLanguagesObject;
                    // $scope.formResume.title.$error.required
                    // $scope.formResume.description.$error.required
                    // $scope.formResume.hasExperience.$error.required
                    // $scope.formResume.expertise.$error.required
                    // $scope.formResume.schoolPreparation.$error.required
                    // Swal.fire({
                    //     title: '¡Listo!',
                    //     text: 'Guardando información...',
                    //     icon: 'success',
                    //     showConfirmButton: false,
                    //     timer: 5000
                    // });
                    // console.log($scope.resume);
                } else {
                    Swal.fire({
                        title: 'Guardado cancelado',
                        text: "Registra tus cursos/certificaciones",
                        icon: 'info',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Entendido'
                    });
                }
            });
        }
    }


    $scope.alertEmptyInputs = () => {
        Swal.fire({
            title: 'Verifica',
            text: "Necesitas llenar todos los campos de manera correcta",
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Entendido'
        });
    }

    $scope.generateCV = () => {
        var pdfObject = jsPDFInvoiceTemplate.default(props)

        console.log("Object created: ", pdfObject);
    }

    var props = {
        outputType: jsPDFInvoiceTemplate.OutputType.Save,
        returnJsPDFDocObject: true,
        fileName: "Invoice 2021",
        orientationLandscape: false,
        compress: true,
        logo: {
            src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/logo.png",
            type: 'PNG', //optional, when src= data:uri (nodejs case)
            width: 53.33, //aspect ratio = width/height
            height: 26.66,
            margin: {
                top: 0, //negative or positive num, from the current position
                left: 0 //negative or positive num, from the current position
            }
        },
        stamp: {
            inAllPages: true, //by default = false, just in the last page
            src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/qr_code.jpg",
            type: 'JPG', //optional, when src= data:uri (nodejs case)
            width: 20, //aspect ratio = width/height
            height: 20,
            margin: {
                top: 0, //negative or positive num, from the current position
                left: 0 //negative or positive num, from the current position
            }
        },
        business: {
            name: "Business Name",
            address: "Albania, Tirane ish-Dogana, Durres 2001",
            phone: "(+355) 069 11 11 111",
            email: "email@example.com",
            email_1: "info@example.al",
            website: "www.example.al",
        },
        contact: {
            label: "Invoice issued for:",
            name: "Client Name",
            address: "Albania, Tirane, Astir",
            phone: "(+355) 069 22 22 222",
            email: "client@website.al",
            otherInfo: "www.website.al",
        },
        invoice: {
            label: "Invoice #: ",
            num: 19,
            invDate: "Payment Date: 01/01/2021 18:12",
            invGenDate: "Invoice Date: 02/02/2021 10:17",
            headerBorder: false,
            tableBodyBorder: false,
            header: [
              {
                title: "#", 
                style: { 
                  width: 10 
                } 
              }, 
              { 
                title: "Title",
                style: {
                  width: 30
                } 
              }, 
              { 
                title: "Description",
                style: {
                  width: 80
                } 
              }, 
              { title: "Price"},
              { title: "Quantity"},
              { title: "Unit"},
              { title: "Total"}
            ],
            table: Array.from(Array(10), (item, index)=>([
                index + 1,
                "There are many variations ",
                "Lorem Ipsum is simply dummy text dummy text ",
                200.5,
                4.5,
                "m2",
                400.5
            ])),
            additionalRows: [{
                col1: 'Total:',
                col2: '145,250.50',
                col3: 'ALL',
                style: {
                    fontSize: 14 //optional, default 12
                }
            },
            {
                col1: 'VAT:',
                col2: '20',
                col3: '%',
                style: {
                    fontSize: 10 //optional, default 12
                }
            },
            {
                col1: 'SubTotal:',
                col2: '116,199.90',
                col3: 'ALL',
                style: {
                    fontSize: 10 //optional, default 12
                }
            }],
            invDescLabel: "Invoice Note",
            invDesc: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.",
        },
        footer: {
            text: "The invoice is created on a computer and is valid without the signature and stamp.",
        },
        pageEnable: true,
        pageLabel: "Page ",
    };

}]);