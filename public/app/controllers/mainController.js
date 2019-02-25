app.controller('MainController', ['$scope', '$http', '$window', 'userService', function($scope, $http, $window, userService) {
    
    userService.getUser()
    .then((result) => {
        $scope.user = result.data;
    })
    .catch((err) => {});

    $scope.openAbout = function() {
        $window.location.href = '/about';
    }

    $scope.logout = function() {
        $window.location.href = '/login/logout';       
    }

    $scope.toggleNav = function() {
        if($window.innerWidth <= 768) {
            if(!$('#nav').hasClass('display-in')) {
                $('#nav').addClass('display-in'); 
                $('#nav-switch').removeClass('nav-switch-hide');
                $('#nav-switch').addClass('nav-switch-show');
                $('#nav-switch').html('<span class="ml-1"><i class="fas fa-arrow-left"></i></span>');
            } else {
                $('#nav').removeClass('display-in'); 
                $('#nav-switch').addClass('nav-switch-hide');
                $('#nav-switch').removeClass('nav-switch-show');
                $('#nav-switch').html('<span class="ml-1"><i class="fas fa-arrow-right"></i></span>');
            } 
        }
    }

}]);