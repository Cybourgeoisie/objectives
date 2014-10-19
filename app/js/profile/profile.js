(function() {
	// Create the profile module
	var module = angular.module('profile', []);

	module.factory('userFactory', function()
	{
		var username;
		var objectives;

		// Setup
		reset();

		function reset()
		{
			username   = '';
			objectives = [];
		}

		function addObjective(obj)
		{
			// Create an id
			var id = getNextId();

			if (obj instanceof Object)
			{
				objectives.push({
					'name' : obj.name,
					'id'   : id
				});
			}

			// Return the current ID
			return id;
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

		return {
			'username'      : username,
			'addObjective'  : addObjective,
			'getObjectives' : getObjectives,
			'hasObjectives' : hasObjectives
		};
	});

	module.controller('ProfileController', ['$location', 'userFactory', function($location, userFactory)
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

		this.hasObjectives = function()
		{
			return userFactory.hasObjectives();
		}

		this.getObjectives = function()
		{
			return userFactory.getObjectives();
		}

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
