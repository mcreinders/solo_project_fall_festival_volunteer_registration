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
        .when('/loginFailed', {
            templateUrl: 'views/loginFailed.html',
            //controller: 'loginFailedController'
        })
        .when('/volunteerRegistration', {
            templateUrl: 'views/volunteerRegistration.html',
            //controller: 'volunteerRegistrationController'
        })
        .when('/coordinatorInformation', {
            templateUrl: 'views/coordinatorInformation.html',
            //controller: 'coordinatorInformationController'
        })
        .when('/openingsByTime', {
            templateUrl: 'views/openingsByTime.html',
            //controller: 'openingsByTimeController'
        })
        .when('/openingsByActivity', {
            templateUrl: 'views/openingsByActivity.html',
            //controller: 'openingsByActivityController'
        });



    $locationProvider.html5Mode(true);
}]);

app.controller('MainController', ['$scope', '$http', '$location', function($scope, $http, $location){

}]);

app.controller('newUserRegistrationController', ['$scope', '$http', '$location', function($scope, $http, $location){
    $scope.newUser = {};

    $scope.registerUser = function(){
        $http.post('/registerNewUser', $scope.newUser).then(function(response){
            console.log('register new user response:', response);
            //this didn't work
            //if(response.status==200){
            //    $location.path('volunteerRegistration');
            //}
            if(response.data=='success'){
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

                //if success do a request for the user info and check if its the coordinator
                //if yes route to the coordinator page otherwise route to volunteer registration page
                $http.post('/getUserInfo', $scope.returningUser).then(function(response){
                    if(response.data.coordinator==true){
                        $location.path('coordinatorInformation');
                    }else{
                        $location.path('volunteerRegistration');
                    }
                })
            }else{
                $location.path('loginFailed');
            }
        })
    }
}]);

//app.controller('volunteerRegistrationController', ['$scope', '$http', '$location', function($scope, $http, $location){
//
//}]);

//app.controller('coordinatorInformationController', ['$scope', '$http', '$location', function($scope, $http, $location){
//
//}]);

//app.controller('loginFailedController', ['$scope', '$http', '$location', function($scope, $http, $location){
//
//}]);