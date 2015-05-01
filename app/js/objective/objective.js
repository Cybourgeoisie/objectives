(function() {
	var module = angular.module('objective', [
		'profile', 'ngDialog', 'task-editor'
	]);

	/** 
	 * Objective
	 **/

	module.controller('ObjectiveController', [
		'$rootScope', '$routeParams', '$location', 'objectiveService', 'ngDialog',
		function($rootScope, $routeParams, $location, objectiveService, ngDialog)
		{
			try
			{
				this.objective = objectiveService.load($routeParams.objectiveId);
			}
			catch (exception)
			{
				$location.path('/404');
			}

			this.openGoalWindow = function()
			{
				ngDialog.open({
					template:   'view/task-editor/task-editor.html',
					controller: 'TaskEditorController',
					className:  'ngdialog-theme-default',
					data:       {objective: this.objective}
				});
			};
		}
	]);

	module.directive('objective', function()
	{
		return {
			restrict: "E",
			templateUrl: "view/objective/objective.html"
		};
	});

	module.factory('objectiveService', [
		'userFactory', 'objectiveFactory', '$rootScope',
		function(userFactory, objectiveFactory, $rootScope)
		{
			// Declarations
			var objective = objectiveFactory.create();

			// Init Events
			$rootScope.$on('reload_objective', reloadObjective);

			function reloadObjective(scope, objective_id)
			{
				var obj = loadObjective(objective_id);
				obj.reload();
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

			return {
				'create'  : function(obj) { return objective.create(obj); },
				'load'    : loadObjective,
				'addTask' : function(task) { return objective.addTask(task); },
				'reload'  : reloadObjective
			};
		}
	]);
})();
