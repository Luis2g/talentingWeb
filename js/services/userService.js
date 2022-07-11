talenting.factory('userService', function myFactoryFunction() {
    return {
     user: {},
     setUser : (user) => {
        this.user = user; 
        console.log("at least is going inside the funtion ", this.user);
     },
     getUser: () => {
        return this.user;
     }
    }
 })