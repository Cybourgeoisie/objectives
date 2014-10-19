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
			.when('/create', {
				templateUrl: 'view/querent/querent.html',
				controller: 'QuerentController'
			})
			.when('/objective/:objectiveId', {
				templateUrl: 'view/objective/objective.html',
				controller: 'ObjectiveController'
			})
			.when('/my-objectives', {
				templateUrl: 'view/profile/my-objectives.html',
				controller: 'ProfileController'
			})
			.otherwise({
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
