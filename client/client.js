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
        })
        .when('/volunteerRegistration', {
            templateUrl: 'views/volunteerRegistration.html',
            controller: 'volunteerRegistrationController'
        })
        .when('/loginFailed', {
            templateUrl: 'views/loginFailed.html',
            controller: 'loginFailedController'
        });

    $locationProvider.html5Mode(true);
}]);

app.controller('MainController', ['$scope', '$http', '$location', function($scope, $http, $location){

}]);

app.controller('newUserRegistrationController', ['$scope', '$http', '$location', function($scope, $http, $location){
    $scope.newUser = {};

    $scope.registerUser = function(){
        $http.post('/registerNewUser', $scope.newUser).then(function(response){
            if(response.status==200){
                $location.path('volunteerRegistration');
            }
        })
    }
}]);

app.controller('returningUserSignInController', ['$scope', '$http', '$location', function($scope, $http, $location){
    $scope.returningUser = {};

    $scope.sendSignIn = function(){
        $http.post('/signIn', $scope.returningUser).then(function(response){

            console.log(response);
            //after verifying password route according to success or failure
            if(response.data=='success'){
                $location.path('volunteerRegistration');
            }else{
                $location.path('loginFailed');
            }
        })
    }
}]);

app.controller('volunteerRegistrationController', ['$scope', '$http', '$location', function($scope, $http, $location){

}]);

app.controller('loginFailedController', ['$scope', '$http', '$location', function($scope, $http, $location){

}]);