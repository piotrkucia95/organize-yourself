app.controller('ProfileController', ['$scope', '$http', '$window', 'userService', function($scope, $http, $window, userService) {
    
    userService.getUser()
    .then((result) => {
        $scope.user = result.data;
    })
    .catch((err) => {});

    $scope.displayModal = function(changeType) {
        $scope.modalChangeType = changeType;

        if(changeType == 'e-mail') $scope.userKey = 'email';
        else if(changeType == 'display name') $scope.userKey = 'displayName';
        else $scope.userKey = changeType;
    }

    $scope.saveChanges = function() {
        if(!$scope.newValue || !$scope.confirmValue) {
            $('.wrong-values').text('Fields cannot be empty.');
            return;
        } else if($scope.newValue != $scope.confirmValue) {
            $('.wrong-values').text('Values in the fields must match.');
            return;
        } else {
            $('.wrong-values').text('');
        }

        if($scope.modalChangeType != 'password') {
            $http.post('/user/change', {
                type: $scope.userKey,
                newValue: $scope.newValue
            })
            .then((result) => {
                console.log(result);
                if(result.data == 'USER EXISTS') {
                    $('.wrong-values').text('User with this username already exists.');
                    return;
                } else if(result.status == 450) {
                    $('.wrong-values').text('Unknown error. Try again.');
                    return;
                } else {
                    $window.location.reload();
                }
            })
            .catch((err) => {
                $('.wrong-values').text('Unknown error. Try again.');
                console.log(err.message);
            });
        } else {
            $http.post('/user/change-password', {
                type: $scope.userKey,
                newValue: $scope.newValue,
                currentPassword: $scope.currentPassword
            })
            .then((result) => {
                if(result.data == 'WRONG PASSWORD') {
                    $('.wrong-values').text('The current password You entered is wrong.');
                    return;
                } else if(result.status == 450) {
                    $('.wrong-values').text('Unknown error. Try again.');
                    return;
                } else {
                    $window.location.reload();
                }
            })
            .catch((err) => {
                $('.wrong-values').text('Unknown error. Try again.');
                console.log(err.message);
            });
        }
    }
}]);