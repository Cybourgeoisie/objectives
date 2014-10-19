(function() {
	var module = angular.module('navigation', [
		'profile'
	]);

	module.controller('NavigationController', function() { });

	module.directive('navigation', function()
	{
		return {
			restrict:     "E",
			templateUrl:  "view/navigation/navigation.html",
			controller:   "NavigationController",
			controllerAs: "navCtrl"
		};
	});
})();
