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

	module.factory('objectiveService', [
	'userFactory', 'objectiveFactory',
	function(userFactory, objectiveFactory)
	{
		// Declarations
		var objective = objectiveFactory.create();

		function loadObjective(id)
		{
			if (userFactory.hasObjective(id))
			{
				objective = userFactory.getObjective(id);
				return objective;
			}

			throw {'error': 'No objective found for ID ' + id};
		}

		return {
			'create'  : function(obj) { return objective.create(obj); },
			'load'    : loadObjective,
			'addTask' : function(task) { return objective.addTask(task); }
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
