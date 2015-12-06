'use-strict';

window.onload = function() {

};

angular.module('VocabApp', ['ngSanitize', 'ui.router', 'ui.bootstrap'])
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
.controller('LoginCtrl', ['$scope', '$http', function($scope, $http) {
	
}])