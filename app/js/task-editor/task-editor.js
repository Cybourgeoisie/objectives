(function() {
	var module = angular.module('task-editor', []);

	module.controller('TaskEditorController', [
		'$scope', '$filter', 'objectiveService', 'ngDialog', 
		function ($scope, $filter, objectiveService, ngDialog)
		{
			// Get any parent data attached to the scope
			if ($scope.ngDialogData && $scope.ngDialogData.goal)
			{
				$scope.goal = $scope.ngDialogData.goal;

				// If we're editing the goal, get the objective
				if ($scope.ngDialogData.task)
				{
					$scope.objective = objectiveService.load($scope.goal.objective_id);
				}
			}
			else if ($scope.ngDialogData && $scope.ngDialogData.objective)
			{
				$scope.objective = $scope.ngDialogData.objective;
			}

			// Get any edit information attached to the scope
			$scope.bEdit = false;
			if ($scope.ngDialogData && $scope.ngDialogData.task)
			{
				$scope.task  = $scope.ngDialogData.task;
				$scope.bEdit = true;
			}

			// Collect the callback
			if ($scope.ngDialogData && $scope.ngDialogData.callback)
			{
				$scope.callback = $scope.ngDialogData.callback;
			}

			// Define the task type
			$scope.taskType = ($scope.objective) ? 'Goal' : 'Task';

			$scope.submitTask = function()
			{
				// Make sure we have a task provided
				if (!$scope.task || !$scope.task.name)
				{
					return;
				}

				// Follow up with the save action
				$scope.callback.apply($scope, [$scope.task, $scope.goal || $scope.objective]);

				// Clear data and close this window
				$scope.task = {};
				$scope.closeThisDialog('Cancel');
			}
		}
	]);
})();
