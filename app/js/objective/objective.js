(function() {
	var module = angular.module('objective', [
		'profile'
	]);

	/** 
	 * Objective
	 **/

	module.controller('ObjectiveController', ['$rootScope', 'objectiveService', function($rootScope, objectiveService)
	{
		this.objective = objectiveService;

		// Open the edit window
		this.openEditWindow = TaskEditController.prototype.openEditWindow;
	}]);

	module.directive('objective', function()
	{
		return {
			restrict: "E",
			templateUrl: "view/objective/objective.html"
		};
	});

	module.factory('objectiveService', ['userFactory', function(userFactory)
	{
		// Declarations
		var objective;
		var tasks;

		// Setup
		reset();

		function create(data)
		{
			// Reset the current objective
			reset();

			// Set the passed data
			if (typeof data === "string")
			{
				set('name', data);
			}

			// Add the objective
			return userFactory.addObjective(objective);
		}

		function set(key, value)
		{
			if (objective.hasOwnProperty(key))
			{
				objective[key] = value;
			}
		}

		function get(key)
		{
			if (objective.hasOwnProperty(key))
			{
				return objective[key];
			}
		}

		function reset()
		{
			objective = {
				'name'  : '',
				'tasks' : []
			};
		}

		function getTasks()
		{
			return objective.tasks || [];
		}

		function hasTasks()
		{
			return (objective.tasks && objective.tasks instanceof Array && objective.tasks.length);
		}

		function addTask(task)
		{
			if (typeof task === "string")
			{
				objective.tasks.push({
					'name' : task
				});
			}
			else if (task instanceof Object)
			{
				objective.tasks.push({
					'name' : task.name
				});
			}
		}

		return {
			'create'   : create,
			'set'      : set,
			'get'      : get,
			'reset'    : reset,
			'getTasks' : getTasks,
			'hasTasks' : hasTasks,
			'addTask'  : addTask
		};
	}]);

	/**
	 * Tasks
	 **/

	var TaskEditController = function(objectiveService)
	{
		this.task = {};

		this.submitTask = function()
		{
			// Add the task and clear it out
			objectiveService.addTask(this.task);
			this.task = {};

			// Hide the window
			$('#edit-task-modal').modal('hide');
		}
	}

	TaskEditController.prototype.openEditWindow = function()
	{
		$('#edit-task-modal').modal('show');
	}

	module.controller('TaskEditController', ['objectiveService', TaskEditController]);

	module.directive('editTaskModal', function()
	{
		return {
			restrict:     "E",
			templateUrl:  "view/objective/edit-task-modal.html",
			controller:   "TaskEditController",
			controllerAs: "taskCtrl"
		};
	});
})();
