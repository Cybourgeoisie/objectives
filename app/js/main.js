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
			.when('/settings', {
				templateUrl: 'view/profile/settings.html',
				controller:  'ProfileController'
			})
			.when('/about', {
				templateUrl: 'view/about/about.html'
			})
			.when('/404', {
				templateUrl: 'view/error/404.html'
			})
			.otherwise({
				templateUrl: 'view/error/404.html'
			});

		// Use HTML5 History API if available
		//$locationProvider.html5Mode(true);
	});

	app.controller('MainController', function()
	{
		this.title = 'Objectives';
	});

	app.filter('capitalize', function() {
		return function(input, all) {
			return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
		}
	});
})();
