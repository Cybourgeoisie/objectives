(function() {
	var module = angular.module('objective', [
		'profile'
	]);

	/** 
	 * Objective
	 **/

	module.controller('ObjectiveController', ['userFactory', function(userFactory)
	{
		this.objective = {
			'name'  : '',
			'tasks' : []
		};

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

	/**
	 * Tasks
	 **/

	var TaskEditController = function()
	{
		this.task = {};

		this.submitTask = function(objective)
		{
			// Add the task and clear it out
			objective.tasks.push(this.task);
			this.task = {};

			// Hide the window
			$('#edit-task-modal').modal('hide');
		}
	}

	TaskEditController.prototype.openEditWindow = function()
	{
		$('#edit-task-modal').modal('show');
	}

	module.controller('TaskEditController', TaskEditController);

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
