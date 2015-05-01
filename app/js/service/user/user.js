(function() {
	angular.module('services').factory('userFactory', [
	'$http', 'objectiveFactory', '$rootScope', '$location', 'notifications',
	function($http, objectiveFactory, $rootScope, $location, notifications)
	{
		var username;
		var objectives;

		// Returned user object
		var userData = {
			'username'        : username,
			'getObjectives'   : getObjectives,
			'hasObjectives'   : hasObjectives,
			'getObjective'    : getObjective,
			'hasObjective'    : hasObjective,
			'isLoggedIn'      : isLoggedIn,
			'logOut'          : logOut,
			'logIn'           : logIn
		};

		// Setup - use a preloaded user object
		if (window.User)
		{
			reset();
			window.User.success = true;
			loadUserData(window.User);
			delete window.User;
		}

		// Event handlers
		$rootScope.$on('new_objective', load);
		$rootScope.$on('new_task', load);

		function isLoggedIn()
		{
			return !!userData.username;
		}

		function logOut()
		{
			// Make the call to the server
			$http.post('./api/user/logout', {}).
				success(function(data, status, headers, config)
				{
					// Validate the output
					if (data.success)
					{
						notifications.success(
							'Logged Out', 
							'You are now logged out',
							{ duration: 4000 }
						);

						userData.username = '';
						reset();
					}
					else
					{
						notifications.error(
							'Logout Failed', 
							'An error has occurred',
							{ duration: -1 }
						);
					}
				}).
				error(function(data, status, headers, config)
				{
					console.log('failure to communicate');
				});
		}

		function logIn(loginInfo, callback, scope)
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
						reset();
						loadUserData(data);
					}
					else
					{
						notifications.error(
							'Login Failed', 
							'Your entered username and password credentials were not found.',
							{ duration: 8000 }
						);

						reset();
					}

					// Perform the success callback
					if (callback && callback.constructor && callback.call && callback.apply)
					{
						callback.call(scope, data);
					}
				}).
				error(function(data, status, headers, config)
				{
					console.log('failure to communicate');
				});
		};

		function load(scope, newObjectiveId)
		{
			reset();

			$http.get('./api/user/load').
				success(function(data)
				{
					loadUserData(data, newObjectiveId);
				}).
				error(function(data)
				{
					reset();
				});
		}

		function loadUserData(data, newObjectiveId)
		{
			if (!data.success || !data.user || !data.objectives)
			{
				reset();
				return;
			}

			// Set the user's data
			userData.username = data.user.name;

			if (data.objectives && data.objectives.length)
			{
				// Set the user's objectives
				for (var i = 0; i < data.objectives.length; i++)
				{
					var obj = objectiveFactory.create(data.objectives[i]);
					objectives.push(obj);
				}
			
				// Redirect to the new objective page if provided
				if (newObjectiveId)
				{
					$location.path('/objective/' + parseInt(newObjectiveId));
				}
			}
		}

		function reset()
		{
			username   = '';
			objectives = [];
		}

		function getObjectives()
		{
			return objectives || [];
		}

		function hasObjectives()
		{
			return (objectives && objectives instanceof Array && objectives.length);
		}

		function getObjective(id)
		{
			for (var i = 0; i < objectives.length; i++)
			{
				if (id == objectives[i].get('id'))
				{
					return objectives[i];
				}
			}

			return null;
		}

		function removeObjective(id)
		{
			for (var i = 0; i < objectives.length; i++)
			{
				if (id == objectives[i].get('id'))
				{
					objectives.splice(i, 1);
					return;
				}
			}
		}

		function hasObjective(id)
		{
			return !!getObjective(id);
		}

		return userData;
	}]);
})();
