(function() {
	// Extend the profile module
	var module = angular.module('profile');

	module.controller('LoginController', ['userFactory', function(userFactory)
	{
		// Keep track of scope
		var self = this;

		// User information
		this.loginInfo = {
			'username' : '',
			'password' : ''
		};

		// Open the login window
		this.openLoginWindow = function()
		{
			$('#login-modal').modal('show');
		}

		this.submitLogin = function(loginInfo)
		{
			// Set the login information
			userFactory.username = loginInfo.username;

			// Hide the window
			$('#login-modal').modal('hide');
		};
	}]);

	module.directive('loginButton', function()
	{
		return {
			restrict:     "E",
			templateUrl:  "view/login/login-button.html",
			controller:   "LoginController",
			controllerAs: "loginCtrl"
		};
	});

	module.directive('loginModal', function()
	{
		return {
			restrict:     "E",
			templateUrl:  "view/login/login-modal.html",
			controller:   "LoginController",
			controllerAs: "loginCtrl"
		};
	});
})();
