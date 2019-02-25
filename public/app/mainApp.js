var app = angular.module('mainApp', ['ngRoute', 'ngAnimate']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {
            templateUrl: 'views/homepage.html',
            controller: 'HomepageController'
        })
        .when('/todos', {
            templateUrl: 'views/todos.html',
            controller: 'TodosController'
        })
        .when('/notes', {
            templateUrl: 'views/notes.html',
            controller: 'NotesController'
        })
        .when('/profile', {
            templateUrl: 'views/profile.html',
            controller: 'ProfileController'
        })
        .otherwise({
            redirectTo : '/'
        });
}]);