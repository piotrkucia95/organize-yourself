var app = angular.module('indexApp', []);

app.controller('IndexController', ['$scope', '$http', '$timeout', '$window', function($scope, $http, $timeout, $window) {
    
    $scope.formVisible = true;
    $scope.isFormWrong = false;

    $scope.signIn = function() {
        $http.post('/login/credentials', {
            username: $scope.username,
            password: $scope.password
        })
        .then((result) => {
            console.log(result);
            if(result.data.status == 'ok') $window.location.reload();
            else {
                $scope.username = '';
                $scope.password = '';
                $('.wrong-login-form').text(result.data.message);
            }
        })
        .catch((err) => {
            $scope.username = '';
            $scope.password = '';
            $('.wrong-login-form').text('Unknown error. Try again!');
        });
    }

    $scope.signUp = function() {
        var recaptcha = $scope.validateForm();

        if(!$scope.isFormWrong) {
            $http.post('/register', {
                displayName: $scope.displayName,
                username: $scope.username,
                email: $scope.email,
                password: $scope.password,
                recaptchaResponse: recaptcha
            })
            .then((result) => {
                if(result.data == 'USER EXISTS') {
                    $('#wrong-username').text("A user with this username already exists.");
                    grecaptcha.reset();
                } else if(result.data == 'RECAPTCHA ERROR') {
                    $('#wrong-captcha').text("reCaptcha error. Reload the page and try again!");
                } else if(result.data == 'SUCCESS'){
                     $scope.formVisible = false;
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }

    $scope.closeModal = function() {
        $scope.username = '';
        $scope.email = '';
        $scope.password = '';
        $scope.passwordConfirm = '';
        $scope.displayName = '';
        grecaptcha.reset();
        $timeout(() => {
            $scope.formVisible = true;
        }, 300);
    }

    $scope.validateForm = function() {
        var recaptcha = $('#recaptcha-form').serialize().split('=')[1];

        $scope.isFormWrong = false;

        if(!$scope.username) {
            $scope.isFormWrong = true;
            $('#wrong-username').text('Username field cannot be empty!');
        } else {
            $('#wrong-username').text('');
        }
        
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if($scope.email == null) {
            $scope.isFormWrong = true;
            $('#wrong-email').text('Email field cannot be empty!');
        } else if(re.test($scope.email) == false) {
            $scope.isFormWrong = true;
            $('#wrong-email').text("Make sure You've entered correct email address!");
        } else {
            $('#wrong-email').text('');
        }

        if(!$scope.password) {
            $scope.isFormWrong = true;
            $('#wrong-password').text('Password field cannot be empty!');
        } else if($scope.password.length < 7 || !(/\d/.test($scope.password))) {
            $scope.isFormWrong = true;
            $('#wrong-password').text('Password must be at least 7 characters long and contain at least 1 number!');
        } else {
            $('#wrong-password').text('');
        }

        if(!$scope.passwordConfirm) {
            $scope.isFormWrong = true;
            $('#wrong-password-confirm').text('Password confirmation field cannot be empty!');
        } else if($scope.password != $scope.passwordConfirm && $scope.passwordConfirm) {
            $scope.isFormWrong = true;
            $('#wrong-password-confirm').text("Reentered password doesn't match actual password!");
        } else {
            $('#wrong-password-confirm').text('');
        }

        if(!$scope.displayName) {
            $scope.isFormWrong = true;
            $('#wrong-displayname').text('Display name field cannot be empty!');
        } else {
            $('#wrong-displayname').text('');
        }

        if(!recaptcha) {
            $scope.isFormWrong = true;
            $('#wrong-captcha').text("Check reCaptcha before submitting form!");
        } else {
            $('#wrong-captcha').text('');
        }

        return recaptcha;
    }

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
}]);