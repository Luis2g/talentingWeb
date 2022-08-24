talenting.controller('resumeController', ['$scope', '$http', '$location','userService', '$cookies', 'alertService', function($scope, $http, $location, userService, $cookies, alertService) {
    $http.defaults.headers.post["Content-Type"] = "application/json";
    $scope.userSession;
    $scope.myFavoriteOnes = [];

    $scope.languages = ["Español","Inglés", "Francés", "Alemán", "Chino", "Portugués", "Ruso", "Italiano", "Indu", "Árabe", "Japonés", "Coreano", "Otro"];
    
    $scope.languagesLevel = ["Nativo","A1","A2", "B1", "B2","C1","C2"];

    $scope.typeCourse= ["Curso","Certificación"];

    $scope.resume = [];
    $scope.listCourses = [];
    var generateIdCourse = 0;
    $scope.listHabilities = [];
    var generateIdHability = 0;
    $scope.listLanguages = [];
    var generateIdLanguage = 0;
    $scope.isUpdating = false;


    $scope.showCourses = false;
    $scope.showHabilities = false;
    $scope.showLanguages = false;

    $scope.blockAddCourse = true;
    $scope.blockAddHability = true;
    $scope.blockAddLanguage = true;

    var languageValidation = true;

    $scope.alertLanguageValidation = false;

    let session = $cookies.get('user');

    $scope.sesion = JSON.parse(session);

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

    $scope.consultarResume = () => {
        $scope.session = JSON.parse(session);

        $scope.resume.person = $scope.session.person;
        $http({
            method: 'GET',
            url: 'http://localhost:8080/talenting/resumes/'+$scope.resume.person.id,
          }).then( response => {
            console.log(response.data);
            if(response.data.resume === null){
                $scope.isUpdating = false;
                document.getElementById("viewProfileImg").src = "../../../img/user.jpg";
            }else{
                $scope.isUpdating = true;
                $scope.showModuleCourses = true;
                $scope.listLanguages = response.data.language;
                $scope.listHabilities = response.data.skill;
                $scope.resume = response.data.resume;
                $scope.showHabilities = true;
                $scope.showLanguages = true;
                
                if(response.data.resume.profileImage == null){
                    document.getElementById("viewProfileImg").src = "../../../img/user.jpg";
                }else{
                    document.getElementById("viewProfileImg").src = "data:image/png;base64," + response.data.resume.profileImage;
                }

                document.getElementById("ProfileImagePreview").src = "data:image/png;base64," + response.data.resume.profileImage;

                document.getElementById("previewPDF").src = "data:application/pdf;base64," + response.data.resume.pdfresume;

                if(response.data.certificationOrCourse !== null ){
                    $scope.listCourses = response.data.certificationOrCourse;
                    $scope.showCourses = true;
                }else{
                    $scope.showCourses = false;
                }
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

        $scope.resume.person = $scope.session.person;
        let resumeDTO = {
            resume: {
            ...$scope.resume,
            },
            certificationOrCourse: [
                ...$scope.listCourses,
            ],
            language: [
                ...$scope.listLanguages,
            ],
            skill: [
            ...$scope.listHabilities,
            ] 
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
            $scope.listCourses = []
            if($scope.listCourses.length === 0){
                $scope.showCourses = false;
            }
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
            $scope.formLanguage.language.$error.required = true;
            $scope.formLanguage.language.$touched = true;
        }else if($scope.formLanguage.level.$error.required){
            $scope.formLanguage.level.$error.required = true;
            $scope.formLanguage.level.$touched = true;
            $scope.alertEmptyInputs();
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

    $scope.addResume = async() => {
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
        }else if($scope.formResume.schoolPreparation.$error.required){
            $scope.alertEmptyInputs();
            $scope.formResume.schoolPreparation.$error.required = true;
            $scope.formResume.schoolPreparation.$touched = true;
        }else if($scope.listHabilities.length < 2){
            Swal.fire({
                title: 'Sin habilidades',
                text: "Necesitas agregar almenos 2 habilidades",
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
            }).then(async (isConfirm) => {

                if (isConfirm.value){

                    let resumeDTO = $scope.prepareDTO();
                    console.log(resumeDTO);
                    $scope.formResume.title.$error.required
                    $scope.formResume.description.$error.required
                    $scope.formResume.hasExperience.$error.required
                    $scope.formResume.schoolPreparation.$error.required

                    // await this.uploadProfileImage();
                    // await this.uploadPDFResume(); 
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
                            window.location.reload();
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
            swal.fire({
                title: "Guardar información",
                text: "¿Desea guardar los datos de su Curriculum Vitae?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: 'Si',
                confirmButtonColor: '#3085d6',
                cancelButtonText: 'No'
            }).then(async(isConfirm) => {

                if (isConfirm.value){

                    let resumeDTO = $scope.prepareDTO();
                    $scope.formResume.title.$error.required
                    $scope.formResume.description.$error.required
                    $scope.formResume.hasExperience.$error.required
                    
                    $scope.formResume.schoolPreparation.$error.required
                    
                    console.log(resumeDTO);


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
                            window.location.reload();
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
                } else {
                    Swal.fire({
                        title: 'Guardado cancelado',
                        text: "Puedes verificar que tus datos sean correctos",
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

    let inputImage = document.getElementById("profileImage")
    let inputPFDResume = document.getElementById("PDFResume")
    

    inputImage.addEventListener('change', (e) => {
    let reader = new FileReader();
    let profileImageByteArray = [];
    $scope.imagePreview = true;
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onloadend = (evt) => {
            if (evt.target.readyState === FileReader.DONE) {
            const arrayBufferImage = evt.target.result,
                array = new Uint8Array(arrayBufferImage);
            for (const a of array) {
                profileImageByteArray.push(a);
            }
            $scope.resume.profileImage = profileImageByteArray;
            let binaryImage = '';
            let bytesImage = new Uint8Array(profileImageByteArray);
            let lenImage = bytesImage.byteLength;
            for (let i = 0; i < lenImage; i++) {
                binaryImage += String.fromCharCode(bytesImage[i]);
            }
            let file = window.btoa(binaryImage);
            document.getElementById("ProfileImagePreview").src = "data:image/png;base64," + file;
            }
        }
    })

    inputPFDResume.addEventListener('change', (e) => {
        $scope.PDFResumePreview = true;
        let reader = new FileReader();
        let PDFResumeByteArray = [];
        reader.readAsArrayBuffer(e.target.files[0]);
        reader.onloadend = (evt) => {
                if (evt.target.readyState === FileReader.DONE) {
                const arrayBuffer = evt.target.result,
                    array = new Uint8Array(arrayBuffer);
                for (const a of array) {
                    PDFResumeByteArray.push(a);
                }
                $scope.resume.pdfresume = PDFResumeByteArray;
                let binary = '';
                let bytes = new Uint8Array($scope.resume.pdfresume);
                let len = bytes.byteLength;
                for (let i = 0; i < len; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                let filePDF = window.btoa(binary);
                document.getElementById("previewPDF").src = "data:application/pdf;base64," + filePDF;
                }
            }
        })

    $scope.generateResume = () => {
        $http({
            method: "GET",
            url: 'http://localhost:8080/talenting/resumes/CV/'+$scope.resume.id,
            responseType: "arraybuffer",
        }).then((res) => {
            // const fileName = $scope.resume.person.name + " " + $scope.resume.person.surname + " " + $scope.resume.person.secondSurname + " CV";
            // const a = document.createElement("a");
            // document.body.appendChild(a);
            // const file = new Blob([res.data], {type: "application/pdf"});
            // a.href = window.URL.createObjectURL(file);
            // a.download = fileName;
            // a.click();
            let binary = '';
            let bytes = new Uint8Array(res.data);
            let len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            let filePDF = window.btoa(binary);
            document.getElementById("previewPDFApplication").src = "data:application/pdf;base64," + filePDF;
        })
        $("#resumeModal").modal("show");
    }

}]);