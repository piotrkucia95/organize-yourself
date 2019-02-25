app.controller('HomepageController', ['$scope', 'userService', function($scope, userService) {
    
    userService.getUser()
    .then((result) => {
        $scope.user = result.data;
    })
    .catch((err) => {});


}]);