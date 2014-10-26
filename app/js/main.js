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

	// Bootstrap's radio buttons (using button view) does not jive with Angular.js
	// Source: https://github.com/angular/angular.js/issues/4516
	app.directive('inputDetectChange', function() {
		return {
			replace: false,
			require: 'ngModel',
			scope: false,
			link: function (scope, element, attrs, ngModelCtrl) {
				element.on('change', function () {
					scope.$apply(function () {
						ngModelCtrl.$setViewValue(element[0].type.toLowerCase() == 'radio' ? element[0].value : element[0].checked);
					});
				});
			}
		};
	});
})();
