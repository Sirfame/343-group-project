'use-strict';

window.onload = function() {

};

angular.module('VocabApp', ['ngSanitize', 'ui.router', 'ui.bootstrap', 'firebase'])
.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/');
	$stateProvider
		.state('home', {
			url: '/', //"root" directory
			templateUrl: 'partials/home.html',
			controller: 'LoginCtrl'
		})
		.state('signIn', {
			url: '/sign-in',
			templateUrl: 'partials/signIn.html',
			controller: 'LoginCtrl'
		})
		.state('signUp', {
			url:'/sign-up',
			templateUrl: 'partials/signUp.html',
			controller: 'LoginCtrl'
		})
		.state('dashboard', {
			url: '/dashboard',
			templateUrl: 'partials/dashboard.html',
			controller: 'DashboardCtrl'
		})
})

// Controls the homepage and login/signup screens
.controller('LoginCtrl', ['$scope', '$http', '$firebaseObject','$firebaseArray', '$firebaseAuth', function($scope, $http, $firebaseObject,$firebaseArray, $firebaseAuth) {

	/* define reference to your firebase app */
	var ref = new Firebase("https://343.firebaseio.com/");

	/* define reference to the "users" value in the app */
	var usersRef = ref.child("users");

	/* create a $firebaseObject for the users reference and add to scope (as $scope.users) */
	$scope.users = $firebaseObject(usersRef);

	//for sign-in
	$scope.newUser = {};

	/* Authentication */
	var Auth = $firebaseAuth(ref);

	$scope.signUp = function() {
		console.log("creating user " + $scope.newUser.email);

		//pass in an object with the new 'email' and 'password'
		Auth.$createUser({
			'email': $scope.newUser.email,
			'password': $scope.newUser.password
		})

		// Once the user is created, call the logIn function
		.then($scope.signIn)

		// Once logged in, set and save the user data
		.then(function(authData){
			console.log("logged in");
			var newUserInfo = {
				'firstname': $scope.newUser.firstname,
	    		'lastname': $scope.newUser.lastname,
			};

			$scope.users[authData.uid] = newUserInfo;



			/* assign authData.uid to $scope.userId for our views to see */
			$scope.userId = authData.uid;

			/* call .$save() on the $scope.users object to save to the cloud */
			$scope.users.$save();

		})
		//Catch any errors
		.catch(function(error){
			//error handling (called on the promise)
			console.log(error);
		})
	};
	// End signUp

	//LogIn function
	$scope.signIn = function() {
		console.log('log in')
		return Auth.$authWithPassword({
	    	email: $scope.newUser.email,
	    	password: $scope.newUser.password
  	})
	};
	// End signIn

	//Make LogOut function available to views
	$scope.logOut = function() {
	   Auth.$unauth(); //"unauthorize" to log out
	};
	// End logOut

	//Any time auth status updates, set the userId so we know
	Auth.$onAuth(function(authData) {
	   if(authData) { //if we are authorized
	      $scope.userId = authData.uid;
	   }
	   else {
	      $scope.userId = undefined;
	   }
	});

	//Test if already logged in (when page load)
	var authData = Auth.$getAuth(); //get if we're authorized
	if(authData) {
	   $scope.userId = authData.uid;
	}
}])

.directive('nxEqualEx', function() {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, model) {
            if (!attrs.nxEqualEx) {
                console.error('nxEqualEx expects a model as an argument!');
                return;
            }
            scope.$watch(attrs.nxEqualEx, function (value) {
                // Only compare values if the second ctrl has a value.
                if (model.$viewValue !== undefined && model.$viewValue !== '') {
                    model.$setValidity('nxEqualEx', value === model.$viewValue);
                }
            });
            model.$parsers.push(function (value) {
                // Mute the nxEqual error if the second ctrl is empty.
                if (value === undefined || value === '') {
                    model.$setValidity('nxEqualEx', true);
                    return value;
                }
                var isValid = value === scope.$eval(attrs.nxEqualEx);
                model.$setValidity('nxEqualEx', isValid);
                return isValid ? value : undefined;
            });
        }
    };
});
