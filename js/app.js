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
			controller: 'SignupCtrl'
		})
})

// Controls the homepage and login/signup screens
.controller('SignupCtrl', ['$scope', '$http', function($scope, $http) {
	
}])