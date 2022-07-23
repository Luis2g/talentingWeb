talenting.factory('alertService', function myFactoryFunction() {

    return {
        showAlert: {
            success : (message) => {

                console.log('where inside the service right now');

                Swal.fire({
                    title: 'Listo!',
                    text: message,
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2000
                  });
            },
            warning: (message) => {
                Swal.fire({
                    title: 'Verifica',
                    text: message,
                    icon: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Entendido'
                });
            },
            error: (message) => {
                Swal.fire({
                    title: 'Error',
                    text: message,
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Entendido'
                });
            },
            info: (message) => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: message,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    }

});