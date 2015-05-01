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

				// If we're adding a goal, then add it to the objective
				if ($scope.taskType == 'Goal' && !$scope.bEdit)
				{
					objectiveService.addTask($scope.task);
				}
				else if ($scope.taskType == 'Task' && $scope.bEdit)
				{
					$scope.callback.apply($scope, [$scope.task]);
				}
				else if ($scope.taskType == 'Task' && !$scope.bEdit)
				{
					//$scope.callback.call($scope, [$scope.task]);
				}

				// Clear data and close this window
				$scope.task = {};
				$scope.closeThisDialog('Cancel');
			}
		}
	]);
})();
