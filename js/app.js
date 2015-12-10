'use-strict';
var progress = 0;
var app = angular.module('VocabApp', ['ngSanitize', 'ui.router', 'ui.bootstrap', 'firebase'])
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
			controller: 'LoginCtrl'
		})
		.state('quiz', {
			url: '/quiz',
			templateUrl: 'partials/quiz.html',
			controller: 'LoginCtrl'
		})
})


// Controls the homepage and login/signup screens
.controller('LoginCtrl', ['$scope', '$http', '$firebaseObject','$firebaseArray', '$firebaseAuth','$location', function($scope, $http, $firebaseObject,$firebaseArray, $firebaseAuth, $location) {

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
		//Create user
		Auth.$createUser({
			'email': $scope.newUser.email,
			'password': $scope.newUser.password
		})

		// Once the user is created, call the logIn function
		.then($scope.signIn)

		// Once logged in, set and save the user data
		.then(function(authData) {
			console.log("logged in");

			var newUserInfo = {
				'firstname': $scope.newUser.firstname,
	    		'lastname': $scope.newUser.lastname,
			};

			$scope.users[authData.uid] = newUserInfo;

			$scope.userId = authData.uid; //save userId
			$scope.users[authData.uid] = { //set up new information in our users object
				firstname: $scope.newUser.firstname,
	    	lastname: $scope.newUser.lastname,
			}
			//$scope.users[authData.uid] = newUserInfo;
			/* assign authData.uid to $scope.userId for our views to see */
			//$scope.userId = authData.uid;
			/* call .$save() on the $scope.users object to save to the cloud */
			$scope.users.$save();
		})

		//Catch any errors
		.catch(function(error){
			//error handling (called on the promise)
			console.log(error);
		})

		$state.go('dashboard', {});
	};
	// End signUp

	//LogIn function
	$scope.signIn = function() {
		console.log('log in')
		return Auth.$authWithPassword({
	    	email: $scope.newUser.email,
	    	password: $scope.newUser.password
  		})

		//Catch any errors
		.catch(function(error) {
			console.log(error);
		})

		$state.go('dashboard', {});
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
})

.directive('quiz', function(quizFactory) {
	return {
		restrict: 'AE',
		scope: {},
		templateUrl: 'template.html',
		link: function(scope, elem, attrs) {
			scope.start = function() {
				scope.id = 0;
				scope.quizOver = false;
				scope.inProgress = true;
				scope.getQuestion();
			};

			scope.reset = function() {
				scope.inProgress = false;
				scope.score = 0;
				progress = 0;
			}

			scope.getQuestion = function() {
				var q = quizFactory.getQuestion(scope.id);
				if(q) {
					scope.question = q.question;
					scope.options = q.options;
					scope.answer = q.answer;
					scope.answerMode = true;
				} else {
					scope.quizOver = true;
				}
			};

			scope.checkAnswer = function() {
				if(!$('input[name=answer]:checked').length) return;

				var ans = $('input[name=answer]:checked').val();

				if(ans == scope.options[scope.answer]) {
					scope.score++;
					scope.correctAns = true;
				} else {
					scope.correctAns = false;
				}
				progress++;
				console.log(progress);
				scope.answerMode = false;
			};

			scope.nextQuestion = function() {
				scope.id++;
				scope.getQuestion();
			}

			scope.reset();
		}
	}
});

app.factory('quizFactory', function() {
	var questions = [
		{
			question: "Which is the largest country in the world by population?",
			options: ["India", "USA", "China", "Russia"],
			answer: 2
		},
		{
			question: "When did the second world war end?",
			options: ["1945", "1939", "1944", "1942"],
			answer: 0
		},
		{
			question: "Which was the first country to issue paper currency?",
			options: ["USA", "France", "Italy", "China"],
			answer: 3
		},
		{
			question: "Which city hosted the 1996 Summer Olympics?",
			options: ["Atlanta", "Sydney", "Athens", "Beijing"],
			answer: 0
		},
		{
			question: "Who invented telephone?",
			options: ["Albert Einstein", "Alexander Graham Bell", "Isaac Newton", "Marie Curie"],
			answer: 1
		}
	];

	return {
		getQuestion: function(id) {
			if(id < questions.length) {
				return questions[id];
			} else {
				return false;
			}
		}
	};
});
