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
            templateUrl: 'views/coordinatorInformation.html',
            controller: 'coordinatorController'
        })
        .when('/duplicateUsername', {
            templateUrl: 'views/duplicateUsername.html'
        })
        .when('/youSignedUpFor', {
            templateUrl: 'views/youSignedUpFor.html',
            controller: 'youSignedUpForController'
        })
        .when('/volunteerList', {
            templateUrl: 'views/volunteerList.html',
            controller: 'volunteerListController'
        })
        .when('/thanks', {
            templateUrl: 'views/thanks.html'
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
                $location.path('returningUserSignIn');
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

    //stuff to sort the lists on DOM
    $scope.predicate = 'shift';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };

    //for filter
    $scope.searchOpening = '';

    //new array to hold only the available openings
    $scope.availableArray = [];

    var getOpenings= function(){
        $http.get('/getOpenings').then(function(response){

            var activities = response.data;

            //loops through the array of all the activities
            for(var i=0;i<activities.length; i++){
                //checks how many openings are available
                var availOpenings = activities[i].max_avail - activities[i].users.length;
                //if there aren't any available openings don't show the activity
                if(availOpenings>0) {
                    $scope.availableArray[i] = activities[i];
                    $scope.availableArray[i].availOpenings = availOpenings;
                }
            }
        })
    };

    //to have openings show up on page load
    getOpenings();

    //object we'll use to send the id of the selected activity
    $scope.submitActivityID = {};

    //sets submitActivity equal to the id of the activity selected
    $scope.activitySelectedFunction = function(selectedActivityID){
        $scope.submitActivityID.id = selectedActivityID;
    };

    //add the volunteer to the user document
    //submitActivityID is the activity selected
    $scope.activitySubmitFunction = function(){

        $http.post('/addVolunteer', $scope.submitActivityID).then(function(response){
            if(response.data == 'success'){
                $location.path('youSignedUpFor');
            }
        });
    };

    //on click of view / change registration button
    $scope.goToSignedUpFor = function(){
        $location.path('youSignedUpFor');
    };

    $scope.logOut = function(){
        $http.get('/logout').then(function(response){

            if(response.data == "logged_out"){
                $location.path('thanks');
            }
        });
    }

}]);


app.controller('youSignedUpForController', ['$scope', '$http', '$location', function($scope, $http, $location){

    //object to hold info on volunteer and openings they signed up for
    var tempActivity = {
        activity: "",
        shiftTime: "",
        activityId: ""
    };

    $scope.signedUpFor = [];
    $scope.firstName = "";

     var getSignedUpFor= function(){
        $http.get('/getSignedUpFor').then(function(response){

            $scope.signedUpFor = [];

            $scope.firstName = response.data.first_name;

             var activityList = response.data.activities;

            //loops through the array of all the activities
            if(activityList.length > 0){
                //shows 'REMOVE' button
                $scope.noActivities = true;

                for(var i=0; i<activityList.length; i++){
                    var tempActivity = { activity: "", shiftTime: "", activityId: "" };
                    tempActivity.activity = activityList[i].activity_name;
                    tempActivity.shiftTime = activityList[i].shift_time;
                    tempActivity.activityId = activityList[i]._id;
                    $scope.signedUpFor.push(tempActivity);
                }
            }else{
                //hides 'REMOVE' button
                $scope.noActivities = false;
                tempActivity = {
                    activity: "You haven't selected any volunteer openings.",
                    shiftTime: ""
                };
                $scope.signedUpFor.push(tempActivity);
            }
        });
    };

    //to have openings signed up for on page load
    getSignedUpFor();

    $scope.deleteActivityId = {};

    //function to delete the selected activity from page
    $scope.activityDeleteFunction = function(activityId){

        $scope.deleteActivityId.id = activityId;

        $http.post('/removeActivity', $scope.deleteActivityId).then(function(response){
            if(response.data=='success'){
                getSignedUpFor();
                $location.path('youSignedUpFor');
            }
        });
    };

    $scope.goToVolunteerRegistration = function(){
        $location.path('volunteerRegistration');
    };

    $scope.logOut = function(){
        $http.get('/logout').then(function(response){

            if(response.data == "logged_out"){
                $location.path('thanks');
            }
        });
    }

}]);

app.controller('coordinatorController', ['$scope', '$http', '$location', function($scope, $http, $location){

    //stuff to sort the lists on DOM
    $scope.predicate = 'shift';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };

    //for filter
    $scope.searchOpening = '';

    //new array to hold only the available openings
    $scope.availableArray = [];

    var getOpenings= function(){
        $http.get('/getOpenings').then(function(response){

            var activities = response.data;

            //loops through the array of all the activities
            for(var i=0;i<activities.length; i++){
                $scope.availableArray[i] = activities[i];
                //checks how many openings are available
                var availOpenings = activities[i].max_avail - activities[i].users.length;
                $scope.availableArray[i].availOpenings = availOpenings;
                if(availOpenings == 0){
                    $scope.availableArray[i].filled = "full";
                }else{
                    $scope.availableArray[i].filled = "open";
                }
            }
        })
    };

    //to have openings show up on page load
    getOpenings();

    $scope.goToVolunteerList = function(){
        $location.path('volunteerList');
    };

    $scope.logOut = function(){
        $http.get('/logout').then(function(response){

            if(response.data == "logged_out"){
                $location.path('thanks');
            }
        });
    }

}]);

app.controller('volunteerListController', ['$scope', '$http', '$location', function($scope, $http, $location){

    //stuff to sort the lists on DOM
    $scope.predicate = 'shift';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };

    //for filter
    $scope.searchVolunteers = '';

    //object to hold volunteer list
    var tempVolunteer = {
        name: "",
        contact: "",
        reminder: "",
        activities: []
    };

    $scope.volunteerList = [];

    //get the volunteer list
    var getVolunteers = function(){
        $http.get('getAllUsers').then(function(response){

            var userList = response.data;

            for(var i=0; i<userList.length; i++){
                //check if the user has signed up for any openings
                if(userList[i].activities.length>0){
                    var tempVolunteer = {
                        name: "",
                        contact: "",
                        reminder: "",
                        activities: []
                    };
                    tempVolunteer.name = userList[i].first_name + " " + userList[i].last_name;
                    if(userList[i].contact_method == "email"){
                        tempVolunteer.contact = userList[i].contact_method + " " + userList[i].email;
                    }else if (userList[i].contact_method == "phonecall"){
                        tempVolunteer.contact = userList[i].contact_method + " " + userList[i].phone;
                    }else if (userList[i].contact_method == "text"){
                        tempVolunteer.contact = userList[i].contact_method + " " + userList[i].phone;
                    }
                    tempVolunteer.reminder = userList[i].reminder;

                        //to hold activity list for each volunteer
                        var tempActivity = {
                            activity_name: "",
                            shift_time:""
                        };
                        //add the activities to the array
                        for(var j=0; j<userList[i].activities.length; j++){
                            tempActivity = {
                                activity_name: "",
                                shift_time:""
                            };
                            tempActivity.activity_name = userList[i].activities[j].activity_name;
                            tempActivity.shift_time = userList[i].activities[j].shift_time;
                            tempVolunteer.activities.push(tempActivity);
                        }

                    $scope.volunteerList.push(tempVolunteer);

                }
            }
        });

    };

    //get the volunteer list on page load
    getVolunteers();

    //button click to return to the coordinator activity list
    $scope.goToActivityList = function(){
        $location.path('coordinatorInformation');
    };

    $scope.logOut = function(){
        $http.get('/logout').then(function(response){

            if(response.data == "logged_out"){
                $location.path('thanks');
            }
        });
    }

}]);
