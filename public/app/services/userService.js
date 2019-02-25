app.factory('userService', function($http) {   
    return {
        getUser: () => {
            return $http.get('/user');
        }
    }
});