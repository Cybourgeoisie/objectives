(function() {
	// Create the profile module
	var module = angular.module('profile', []);

	module.controller('ProfileController', ['$location', 'userFactory', function($location, userFactory)
	{
		// Keep track of scope
		var self = this;

		// Keep a reference to the user factory
		this.userInfo = userFactory;

		this.isLoggedIn    = userFactory.isLoggedIn;
		this.logOut        = userFactory.logOut;
		this.hasObjectives = userFactory.hasObjectives
		this.getObjectives = userFactory.getObjectives

		this.createObjective = function()
		{
			$location.path('/create');
		}
	}]);

	module.directive('profileHeader', function()
	{
		return {
			restrict:     "E",
			templateUrl:  "view/profile/profile-header.html",
			controller:   "ProfileController",
			controllerAs: "profileCtrl"
		};
	});

	module.directive('profileOptions', function()
	{
		return {
			restrict:     "E",
			templateUrl:  "view/profile/profile-options.html",
			controller:   "ProfileController",
			controllerAs: "profileCtrl"
		};
	});
})();
