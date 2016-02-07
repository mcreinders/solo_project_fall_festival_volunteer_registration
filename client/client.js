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
            templateUrl: 'views/volunteerRegistration.html',
            controller: 'volunteerRegistrationController'
        })
        .when('/coordinatorInformation', {
            templateUrl: 'views/coordinatorInformation.html'
        })
        .when('/openingsByTime', {
            templateUrl: 'views/openingsByTime.html'
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

    //for the password comparison
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

        //sign in the returning user
        $http.post('/signIn', $scope.returningUser).then(function(response){

            //after verifying password, route according to success or failure
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


app.controller('volunteerRegistrationController', ['$scope', '$http', '$location', function($scope, $http, $location){

    //function to show the drop down lists
    $scope.showTimes = false;
    $scope.showActivities = false;

    $scope.showTimeList= function(){
       $scope.showTimes = !$scope.showTimes;
        if($scope.showActivities == true){
            $scope.showActivities=false;
        }
    }
    $scope.showActivityList= function(){
        $scope.showActivities = !$scope.showActivities;
        if($scope.showTimes == true){
            $scope.showTimes = false;
        }
    }

    $scope.getOpenings= function(){
        $http.get('/getOpenings').then(function(response){
        })
    };
}]);

////[][][][] THIS DOESN'T WORK [][][][][[][]
//Service to do get request for activities
app.factory('GetActivitiesService', ['$http', function($http){

        var activityInfo = {};

        $http.get('/getOpenings').then(function(response){
            activityInfo = response.data;
        })

    return {activityInfo: activityInfo};
}]);