/**
 * Created by user on 2/2/16.
 */
var app = angular.module('locationApp', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/registrationPage.html'
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
            templateUrl: 'views/loginFailed.html'
        })
        .when('/volunteerRegistration', {
            templateUrl: 'views/volunteerRegistration.html'
        })
        .when('/coordinatorInformation', {
            templateUrl: 'views/coordinatorInformation.html'
        })
        .when('/openingsByTime', {
            templateUrl: 'views/openingsByTime.html',
            controller: 'openingsByTimeController'
        })
        .when('/openingsByActivity', {
            templateUrl: 'views/openingsByActivity.html'
            })
        .when('/duplicateUsername', {
            templateUrl: 'views/duplicateUsername.html'
        })
        .when('/youSignedUpFor', {
            templateUrl: 'views/youSignedUpFor.html'
        });

    $locationProvider.html5Mode(true);
}]);

app.controller('newUserRegistrationController', ['$scope', '$http', '$location', function($scope, $http, $location){

    $scope.show = true;
    $scope.hide = false;

    $scope.newUser = {};

    $scope.registerUser = function(){
        $http.post('/registerNewUser', $scope.newUser).then(function(response){

            //this didn't work
            //if(response.status==200){
            //    $location.path('volunteerRegistration');
            //}
            if(response.data=='success'){
                $location.path('volunteerRegistration');
            }else{
                //route if the username is already taken
                $location.path('duplicateUsername');
            }
        })
    }
}]);

app.controller('returningUserSignInController', ['$scope', '$http', '$location', function($scope, $http, $location){

    $scope.returningUser = {};

    $scope.sendSignIn = function(){
        $http.post('/signIn', $scope.returningUser).then(function(response){

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
app.controller('openingsByTimeController', ['$scope', '$http', '$location', function($scope, $http, $location){

    //this is on a button click now, will want to have run when page loads
    $scope.getOpeningsByTime= function(){
        $http.get('/getOpenings').then(function(response){
           console.log('client side', response.data);
        })
    };

    //just to test the You Signed up for page
    $scope.youSignedUpForPage = function(){
        $location.path('youSignedUpFor');
    };
}]);
