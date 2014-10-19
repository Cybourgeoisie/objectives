(function() {
	// Create the profile module
	var module = angular.module('profile', []);

	module.factory('userFactory', function() {
		return {
			'username'   : '',
			'objectives' : []
		};
	});

	module.controller('ProfileController', ['userFactory', function(userFactory)
	{
		// Keep track of scope
		var self = this;

		// Keep a reference to the user factory
		this.userInfo = userFactory;

		this.isLoggedIn = function()
		{
			return userFactory && userFactory.username;
		}

		this.logOut = function()
		{
			userFactory.username = '';
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
