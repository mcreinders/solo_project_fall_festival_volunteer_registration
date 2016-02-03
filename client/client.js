/**
 * Created by user on 2/2/16.
 */
var app = angular.module('locationApp', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/registrationPage.html',
            controller: 'MainController'
        })
        .when('/newUserRegistration', {
            templateUrl: 'views/newUserRegistration.html',
            controller: 'newUserRegistrationController'
        })
        .when('/returningUserSignIn', {
            templateUrl: 'views/returningUserSignIn.html',
            controller: 'returningUserSignInController'
        });
        //.when('/success', {
        //    templateUrl: 'views/success.html',
        //    controller: 'SuccessController'
        //})
        //.when('/failure', {
        //    templateUrl: 'views/fail.html',
        //    controller: 'FailController'
        //})
        //.when('/register', {
        //    templateUrl: 'views/register.html',
        //    controller: 'FailController'
        //})
        //.otherwise({
        //    redirectTo: '/'
        //});

    $locationProvider.html5Mode(true);
}]);

app.controller('MainController', ['$scope', '$http', '$location', function($scope, $http, $location){

    //$scope.data = {};
    //
    //$scope.submitData = function(){
    //    $http.post('/', $scope.data).then(function(response){
    //        console.log(response);
    //        $location.path(response.data);
    //    });
    //};
}]);

app.controller('newUserRegistrationController', ['$scope', '$http', function($scope, $http){

}]);

app.controller('returningUserSignInController', ['$scope', '$http', function($scope, $http){

}]);