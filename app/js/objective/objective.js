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

		var id;
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
				// Save the ID to this object as well
				if (key == 'id')
				{
					this.id = value;
				}

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

	module.factory('objectiveService', [
	'userFactory', '$http', 'notifications', '$location',
	function(userFactory, $http, notifications, $location)
	{
		// Declarations
		var objective = new Objective();

		function create(inputData)
		{
			// Format the input
			if (typeof inputData === "string")
			{
				inputData = {
					'name' : inputData
				};
			}

			// Submit the creation request
			$http.post('./api/objective/create', inputData).
				success(function(data, status, headers, config)
				{
					// Validate outcome
					if (data.success && data.objective)
					{
						notifications.success(
							'Objective Created!', 
							'Your objective has been created!',
							{ duration: 4000 }
						);

						// Reset the current objective
						objective = new Objective();
						objective.set('id',   data.objective.objective_id);
						objective.set('name', data.objective.name);

						// Add the objective to the UI
						userFactory.addObjective(objective);

						// Redirect the user to the page
						$location.path('/objective/' + parseInt(data.objective.objective_id));
					}
					else
					{
						notifications.error(
							'Failed to Create Objective', 
							'Your objective could not be created.',
							{ duration: -1 }
						);
					}
				}).
				error(function(data, status, headers, config)
				{
					notifications.error(
						'Failed to Create Objective', 
						'Your objective could not be created.',
						{ duration: -1 }
					);
				});
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
