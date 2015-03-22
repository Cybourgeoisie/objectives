(function() {
	angular.module('services').factory('userFactory', [
	'$http', 'objectiveFactory', '$rootScope', '$location',
	function($http, objectiveFactory, $rootScope, $location)
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
			'logOut'        : logOut
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

		function load(scope, newObjectiveId)
		{
			reset();

			$http.get('./api/user/load').
				success(function(data)
				{
					if (!data.success) reset();

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
							console.log(newObjectiveId);
							$location.path('/objective/' + parseInt(newObjectiveId));
						}
					}
				}).
				error(function(data)
				{
					reset();
				});
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
