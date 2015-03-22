(function() {
	// Extend the profile module
	var module = angular.module('profile');

	module.controller('LoginController', [
	'userFactory', '$http', 'notifications',
	function(userFactory, $http, notifications)
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
			// Make the call to the server
			$http.post('./api/user/login', loginInfo).
				success(function(data, status, headers, config)
				{
					// Validate the output
					if (data.success)
					{
						notifications.success(
							'Logged In', 
							'Welcome, ' + loginInfo.username + ', you are successfully logged in.',
							{ duration: 4000 }
						);

						// Set the login information
						userFactory.username = loginInfo.username;
					}
					else
					{
						notifications.error(
							'Login Failed', 
							'Your entered username and password credentials were not found.',
							{ duration: 8000 }
						);
					}

					// Hide the window
					$('#login-modal').modal('hide');
				}).
				error(function(data, status, headers, config)
				{
					console.log('failure to communicate');
				});
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
