(function() {
	var module = angular.module('objective', [
		'profile'
	]);

	/** 
	 * Objective
	 **/

	module.controller('ObjectiveController', [
	'$rootScope', '$routeParams', '$location', 'objectiveService', 
	function($rootScope, $routeParams, $location, objectiveService)
	{
		try
		{
			this.objective = objectiveService.load($routeParams.objectiveId);
		}
		catch (exception)
		{
			$location.path('/404');
		}

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

	var Objective = function()
	{
		var data = {
			'id'   : 0,
			'name' : ''
		};

		var tasks = [];

		function getProgress()
		{
			var numTasks = countTasks();
			if (numTasks == 0)
			{
				return 0;
			}

			var progress = parseInt(countTasks({'complete': true}) / numTasks);

			return progress;
		}

		function set(key, value)
		{
			if (data.hasOwnProperty(key))
			{
				data[key] = value;
			}
		}

		function get(key)
		{
			if (data.hasOwnProperty(key))
			{
				return data[key];
			}
		}

		function getTasks()
		{
			return tasks || [];
		}

		function hasTasks()
		{
			return (tasks && tasks instanceof Array && tasks.length);
		}

		function addTask(task)
		{
			tasks.push(new Task(task));
		}

		function countTasks(opt)
		{
			var bComplete = false;
			if (opt && opt instanceof Object)
			{
				if (opt.hasOwnProperty('complete') && opt.complete)
				{
					bComplete = true;
				}
			}

			// If we have no tasks, return 0
			if (tasks.length == 0)
			{
				return 0;
			}

			var numComplete = 0;
			if (bComplete)
			{
				for (var i = 0; i < tasks.length; i++)
				{
					if (tasks[i].hasOwnProperty('complete') && tasks[i].complete)
					{
						numComplete++;
					}
				}

				return numComplete;
			}

			// Default case - all tasks
			return tasks.length;
		}

		return {
			'set'         : set,
			'get'         : get,
			'getTasks'    : getTasks,
			'hasTasks'    : hasTasks,
			'addTask'     : addTask,
			'countTasks'  : countTasks,
			'getProgress' : getProgress
		};
	};

	var Task = function(obj)
	{
		var data = {
			'name'        : '',
			'description' : '',
			'complete'    : false
		};

		if (obj)
		{
			if (typeof obj === "string")
			{
				data.name = obj;
			}
			else if (obj instanceof Object)
			{
				for (var prop in obj)
				{
					if (obj.hasOwnProperty(prop) && data.hasOwnProperty(prop))
					{
						data[prop] = obj[prop];
					}
				}
			}
		}

		function set(key, value)
		{
			if (data.hasOwnProperty(key))
			{
				data[key] = value;
			}
		}

		function get(key)
		{
			if (data.hasOwnProperty(key))
			{
				return data[key];
			}
		}

		function isComplete()
		{
			return get('complete');
		}

		return {
			'get'        : get,
			'set'        : set,
			'isComplete' : isComplete
		};
	}

	module.factory('objectiveService', ['userFactory', function(userFactory)
	{
		// Declarations
		var objective = new Objective();

		function create(data)
		{
			// Reset the current objective
			objective = new Objective();

			// Set the passed data
			if (typeof data === "string")
			{
				objective.set('name', data);
			}

			// Add the objective
			return userFactory.addObjective(objective);
		}

		function loadObjective(id)
		{
			if (userFactory.hasObjective(id))
			{
				objective = userFactory.getObjective(id);
				return objective;
			}

			throw {'error': 'No objective found for ID ' + id};
		}

		function addTask(task)
		{
			objective.addTask(task);
		}

		return {
			'create'  : create,
			'load'    : loadObjective,
			'addTask' : addTask
		};
	}]);

	/**
	 * Tasks
	 **/

	var TaskEditController = function($filter, objectiveService)
	{
		this.task = {};

		this.submitTask = function()
		{
			// Make sure we have a task provided
			if (!this.task || !this.task.name)
			{
				return;
			}

			if (this.task.name)
			{
				this.task.name = $filter('capitalize')(this.task.name);
			}

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

	module.controller('TaskEditController', ['$filter', 'objectiveService', TaskEditController]);

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
