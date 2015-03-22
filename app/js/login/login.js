(function() {
	// Extend the profile module
	var module = angular.module('profile');

	module.controller('LoginController', [
	'userFactory', '$http', 'notifications',
	function(userFactory, $http, notifications)
	{
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
			userFactory.logIn(loginInfo, callback, this);

			function callback()
			{
				// Hide the window
				$('#login-modal').modal('hide');
			}
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
