(function() {
	var module = angular.module('querent', [
		'objective'
	]);

	module.controller('QuerentController', [
	'$rootScope', '$scope', '$location', '$filter', 'objectiveService', 
	function($rootScope, $scope, $location, $filter, objectiveService)
	{
		var randomPlaceholders = [
			'learn a new language',
			'paint a mural',
			'learn an instrument',
			'perform a concert',
			'develop a videogame',
			'start a business',
			'create a resolution',
			'aspire for greatness',
			'write a novella',
			'travel the world',
			'learn quantum mechanics',
			'program a microcontroller',
			'dream big'
		];

		this.randomPlaceholder = randomPlaceholders[Math.floor(Math.random() * randomPlaceholders.length)];

		this.submitObjective = function(objective)
		{
			// Only support strings for now
			if (objective && typeof objective !== "string")
			{
				return;
			}

			if (!objective)
			{
				objective = this.randomPlaceholder;
			}

			// Update the objective service
			objectiveService.create($filter('capitalize')(objective));
		}
	}]);

	module.directive('querent', function()
	{
		return {
			restrict: "E",
			templateUrl: "view/querent/querent.html"
		};
	});
})();
