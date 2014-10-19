(function(){
	var app = angular.module('main', [
		'ngRoute',
		'navigation',
		'querent',
		'objective',
		'footer'
	]);

	app.config(function($routeProvider, $locationProvider)
	{
		// Route URLs
		$routeProvider
			.when('/', {
				templateUrl: 'view/querent/querent.html',
				controller: 'QuerentController'
			})
			.when('/querent', {
				templateUrl: 'view/querent/querent.html',
				controller: 'QuerentController'
			})
			.when('/objectives', {
				templateUrl: 'view/objective/objective.html',
				controller: 'ObjectiveController'
			})
			.when('/feed', {
				templateUrl: 'view/querent/querent.html',
				controller: 'QuerentController'
			});

		// Use HTML5 History API if available
		//$locationProvider.html5Mode(true);
	});

	app.controller('MainController', function()
	{
		this.title = 'Objectives';
	});
})();
