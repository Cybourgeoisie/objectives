(function() {
	angular.module('services').factory('userFactory', [
	'$http', 'objectiveFactory', '$rootScope', '$location', 'notifications',
	function($http, objectiveFactory, $rootScope, $location, notifications)
	{
		var username;
		var objectives;

		// Returned user object
		var userData = {
			'username'      : username,
			'addObjective'  : addObjective,
			'getObjectives' : getObjectives,
			'hasObjectives' : hasObjectives,
			'getObjective'  : getObjective,
			'hasObjective'  : hasObjective,
			'isLoggedIn'    : isLoggedIn,
			'logOut'        : logOut,
			'logIn'         : logIn
		};

		// Setup
		load();

		// Event handlers
		$rootScope.$on('new_objective', load);

		function isLoggedIn()
		{
			return !!userData.username;
		}

		function logOut()
		{
			userData.username = '';
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
					var objectiveObj = objectiveFactory.create();
					objectiveObj.set('id',   data.objectives[i].objective_id);
					objectiveObj.set('name', data.objectives[i].name);

					if (data.objectives[i].tasks && data.objectives[i].tasks.length)
					{
						for (var j = 0; j < data.objectives[i].tasks.length; j++)
						{
							objectiveObj.loadTask(data.objectives[i].tasks[j]);
						}
					}

					addObjective(objectiveObj);
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

		function addObjective(obj)
		{
			// Create an id if none is provided
			if (!obj.id)
			{
				obj.id = getNextId();
			}

			objectives.push(obj);

			// Return the current ID
			return obj.id;
		}

		function getObjectives()
		{
			return objectives || [];
		}

		function hasObjectives()
		{
			return (objectives && objectives instanceof Array && objectives.length);
		}

		function getNextId()
		{
			var id = 1;
			for (var i = 0; i < objectives.length; i++)
			{
				if (id <= objectives[i].id)
				{
					id++;
				}
			}
			return id;
		}

		function getObjective(id)
		{
			for (var i = 0; i < objectives.length; i++)
			{
				if (id == objectives[i].id)
				{
					return objectives[i];
				}
			}

			return null;
		}

		function hasObjective(id)
		{
			return !!getObjective(id);
		}

		return userData;
	}]);
})();
